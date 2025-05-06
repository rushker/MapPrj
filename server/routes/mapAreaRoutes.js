import express from 'express';
import { createMapArea, getMapArea } from '../controllers/mapAreaController.js';

const router = express.Router();

router.post('/', createMapArea);         // Finalize and publish a map

//Public List View Endpoint
router.get('/', async (req, res) => {
    try {
      const areas = await MapArea.find({ isFinalized: true }).sort({ createdAt: -1 });
      res.json(areas);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch public maps' });
    }
  });   
  
router.get('/:id', getMapArea);          // View a public map

export default router;
