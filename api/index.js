// Vercel serverless function handler
import { setupApp } from '../dist/index.js';

let appPromise = null;

// Handler for Vercel serverless function
export default async function handler(req, res) {
  // Initialize app once and reuse
  if (!appPromise) {
    appPromise = setupApp();
  }
  
  const { app } = await appPromise;
  return app(req, res);
}
