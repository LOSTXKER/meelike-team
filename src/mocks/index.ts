/**
 * MSW initialization
 *
 * Call initMocks() early in your app to start the service worker.
 * Only active when NODE_ENV === "development".
 */

export async function initMocks() {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "development") return;

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass", // Don't warn about unhandled requests (e.g. static assets)
    quiet: false, // Log handled requests to console
  });

  console.log("[MSW] Mock service worker started");
}
