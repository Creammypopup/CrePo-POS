/**
 * Middleware to handle 404 Not Found errors.
 * This runs when no other route matches the request.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (our errorHandler)
};

/**
 * General error handling middleware.
 * This catches all errors that occur in the application.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error comes in with a 200 status code, we want to default to 500 in that case
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // We only want to show the detailed stack trace in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
