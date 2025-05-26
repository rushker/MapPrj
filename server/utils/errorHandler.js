//utils/errorHandler.js
export const handleError = (res, message, error = null, code = 500) => {
  if (error) console.error(message, error);
  else console.error(message);
  return res.status(code).json({ success: false, message });
};

export const handleNotFound = (res, entity = 'Resource') =>
  res.status(404).json({ success: false, message: `${entity} not found` });
