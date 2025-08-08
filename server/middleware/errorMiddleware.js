// Middleware สำหรับจัดการเมื่อไม่พบ Route
const notFound = (req, res, next) => {
  const error = new Error(`ไม่พบ - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware สำหรับจัดการ Error ทั่วไป
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };