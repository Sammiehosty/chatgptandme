import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
  <App />
</AuthProvider>
  </StrictMode>
);


let deferredPrompt;
const installBanner = document.getElementById('install-banner'); // Your HTML banner
const installBtn = document.getElementById('install-btn');       // Your HTML button

// 1. Listen for the secret browser install signal
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome from showing its tiny default bar
  e.preventDefault();
  // Save the event so we can use it later
  deferredPrompt = e;
  // Show your custom automatic install banner/pop-up
  if (installBanner) installBanner.style.display = 'block';
});

// 2. Trigger the install when the user clicks your button
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Show the native browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to click "Install" or "Cancel"
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    
    // Reset the prompt variable
    deferredPrompt = null;
    // Hide your custom banner
    if (installBanner) installBanner.style.display = 'none';
  });
}
