import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

interface RazorpayPaymentEvent {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id: string | null;
        method: string;
        email: string;
        contact: string;
        notes: {
          invoice_id?: string;
          plan_name?: string;
        };
        created_at: number;
      };
    };
  };
  created_at: number;
}

const verifySignature = async (body: string, signature: string, secret: string): Promise<boolean> => {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("razorpay-webhook function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();

    console.log("Webhook event received");

    // Verify signature if webhook secret is configured
    if (webhookSecret && signature) {
      const isValid = await verifySignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      console.log("Webhook signature verified");
    }

    const event: RazorpayPaymentEvent = JSON.parse(body);
    console.log("Event type:", event.event);

    // Initialize Supabase client with service role for database updates
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.event === "payment.captured" || event.event === "payment.authorized") {
      const payment = event.payload.payment.entity;
      console.log("Processing successful payment:", payment.id);

      // Update invoice status in database
      const { data: invoice, error: fetchError } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_number", payment.notes.invoice_id || payment.order_id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching invoice:", fetchError);
      }

      if (invoice) {
        const { error: updateError } = await supabase
          .from("invoices")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            notes: JSON.stringify({
              razorpay_payment_id: payment.id,
              razorpay_order_id: payment.order_id,
              payment_method: payment.method,
              payment_email: payment.email,
              payment_contact: payment.contact,
            }),
            updated_at: new Date().toISOString(),
          })
          .eq("id", invoice.id);

        if (updateError) {
          console.error("Error updating invoice:", updateError);
        } else {
          console.log("Invoice updated successfully:", invoice.id);
        }
      } else {
        // Create new invoice record if not found
        const { error: insertError } = await supabase
          .from("invoices")
          .insert({
            invoice_number: payment.notes.invoice_id || `RZP-${payment.order_id}`,
            amount: payment.amount / 100, // Convert from paise
            tax_amount: 0,
            total_amount: payment.amount / 100,
            status: "paid",
            paid_at: new Date().toISOString(),
            notes: JSON.stringify({
              razorpay_payment_id: payment.id,
              razorpay_order_id: payment.order_id,
              payment_method: payment.method,
              payment_email: payment.email,
              payment_contact: payment.contact,
              plan_name: payment.notes.plan_name,
            }),
          });

        if (insertError) {
          console.error("Error creating invoice:", insertError);
        } else {
          console.log("New invoice created for payment:", payment.id);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "Payment processed" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      console.log("Processing failed payment:", payment.id);

      const { error } = await supabase
        .from("invoices")
        .update({
          status: "failed",
          notes: JSON.stringify({
            razorpay_payment_id: payment.id,
            razorpay_order_id: payment.order_id,
            failure_reason: "Payment failed",
          }),
          updated_at: new Date().toISOString(),
        })
        .eq("invoice_number", payment.notes.invoice_id || payment.order_id);

      if (error) {
        console.error("Error updating failed invoice:", error);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Payment failure recorded" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // For other events, just acknowledge
    return new Response(
      JSON.stringify({ success: true, message: "Event received" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in razorpay-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
