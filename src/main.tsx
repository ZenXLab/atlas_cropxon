import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./lib/serviceWorker";
import { OfflineIndicator } from "./components/OfflineIndicator";

// Register service worker for caching and offline support
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById("root")!).render(
  <>
    <OfflineIndicator />
    <App />
  </>
);
