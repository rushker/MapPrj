// routes/mapAreaRoutes.js
import express from 'express';
import {
  createMapArea,
  getMapArea,
  updateMapArea,
  deleteMapArea,
} from '../controllers/mapAreaController.js';

const router = express.Router();

router.post('/', createMapArea);
router.get('/', async (req, res) => {
  try {
    const areas = await MapArea.find({ isFinalized: true }).sort({ createdAt: -1 });
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public maps' });
  }
});
router.get('/:id', getMapArea);
router.put('/:id', updateMapArea);
router.delete('/:id', deleteMapArea);

export default router;
