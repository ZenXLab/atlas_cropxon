import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PillarsSection } from "@/components/PillarsSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { PricingCalculator } from "@/components/PricingCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { QuoteModal } from "@/components/QuoteModal";

const Index = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Header onQuoteClick={() => setQuoteModalOpen(true)} />
      <HeroSection onQuoteClick={() => setQuoteModalOpen(true)} />
      <AboutSection />
      <PillarsSection />
      <WhyChooseSection />
      <section id="pricing">
        <PricingCalculator />
      </section>
      <TestimonialsSection />
      <Footer />
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </main>
  );
};

export default Index;
