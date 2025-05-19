// middleware/validateAreaUpdate.js
export const validateAreaUpdate = (req, res, next) => {
  const { name, polygon, entities } = req.body;
  if (typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
  if (!Array.isArray(polygon) || polygon.length < 3) return res.status(400).json({ error: 'Polygon must be valid array' });
  if (entities && !Array.isArray(entities)) return res.status(400).json({ error: 'Entities must be array' });
  next();
};
