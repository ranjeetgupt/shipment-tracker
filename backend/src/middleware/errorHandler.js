export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);  
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value — a shipment with this data already exists.",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
