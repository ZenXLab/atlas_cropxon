import { useSessionRecording } from "@/hooks/useSessionRecording";

interface SessionRecorderProps {
  enabled?: boolean;
}

/**
 * Component to enable rrweb session recording across the app.
 * Add this component to your App.tsx to start recording user sessions.
 */
export const SessionRecorder = ({ enabled = true }: SessionRecorderProps) => {
  useSessionRecording({ enabled });
  
  // This component doesn't render anything
  return null;
};
