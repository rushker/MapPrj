  // middleware/errorHandler.js
  export default function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    console.error(`[${new Date().toISOString()}] Error:`, {
      path: req.path,
      method: req.method,
      error: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
  