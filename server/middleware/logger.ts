export default defineEventHandler((event) => {
  const startTime = Date.now();

  // Hook into the response 'finish' event to log after the response is sent
  event.node.res.on("finish", () => {
    const duration = Date.now() - startTime;
    const status = event.node.res.statusCode;
    const method = event.method;
    const path = event.path;

    // Format: [METHOD] /path STATUS - DURATIONms
    const logMessage = `[${method}] ${path} ${status} - ${duration}ms`;

    if (status >= 500) {
      console.error(logMessage);
    } else if (status >= 400) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  });
});
