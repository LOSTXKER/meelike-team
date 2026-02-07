/**
 * MSW Browser Worker Setup
 *
 * Registers the service worker that intercepts HTTP requests
 * and routes them to our mock handlers.
 *
 * Only active in development.
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
