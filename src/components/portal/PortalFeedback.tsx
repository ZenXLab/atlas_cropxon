import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { format } from "date-fns";

interface PortalFeedbackProps {
  userId?: string;
}

export const PortalFeedback = ({ userId }: PortalFeedbackProps) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [selectedProject, setSelectedProject] = useState("");

  const { data: projects } = useQuery({
    queryKey: ["user-projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: feedbackHistory } = useQuery({
    queryKey: ["user-feedback", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("client_feedback")
        .select("*, projects(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("client_feedback").insert({
        user_id: userId,
        project_id: selectedProject || null,
        rating,
        comment,
        feedback_type: feedbackType,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-feedback"] });
      toast.success("Thank you for your feedback!");
      setRating(0);
      setComment("");
      setFeedbackType("general");
      setSelectedProject("");
    },
    onError: () => toast.error("Failed to submit feedback"),
  });

  const avgRating = feedbackHistory?.length
    ? (feedbackHistory.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackHistory.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Feedback & Ratings</h1>
        <p className="text-muted-foreground">Share your experience and help us improve</p>
      </div>

      {/* Submit Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>Rate your experience and provide comments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Feedback Type</label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="sprint">Sprint Review</SelectItem>
                  <SelectItem value="milestone">Milestone Feedback</SelectItem>
                  <SelectItem value="support">Support Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Project (Optional)</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Comments</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>

          <Button 
            onClick={() => submitMutation.mutate()}
            disabled={rating === 0 || !comment.trim()}
            className="w-full sm:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground">Based on your feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackHistory?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {feedbackHistory?.filter(f => (f.rating || 0) >= 4).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Positive ratings (4+)</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback History</CardTitle>
          <CardDescription>Previous feedback you've submitted</CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackHistory?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No feedback submitted yet
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackHistory?.map((feedback) => (
                <div key={feedback.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (feedback.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant="outline">{feedback.feedback_type}</Badge>
                  </div>
                  <p className="text-sm mb-2">{feedback.comment}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {(feedback.projects as any)?.name && (
                      <span>Project: {(feedback.projects as any).name}</span>
                    )}
                    <span>{format(new Date(feedback.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
