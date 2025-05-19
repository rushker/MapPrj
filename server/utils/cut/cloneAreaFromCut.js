// utils/cut/cloneAreaFromCut.js
import Area from '../../models/Area.js';
import Entity from '../../models/Entity.js';
import { pointInPolygon } from './filterMarkersInsidePolygon.js';

export const cloneAreaFromCut = async (projectId, areaId, body) => {
  const oldArea = await Area.findOne({ _id: areaId, projectId });
  if (!oldArea) throw new Error('Original area not found');

  const entities = await Entity.find({ areaId });

  const filtered = entities.filter(e => pointInPolygon(e.location, body.polygon));
  const newArea = new Area({
    ...body,
    projectId,
  });
  await newArea.save();

  // Optionally clone filtered markers
  await Entity.insertMany(
    filtered.map(e => ({ ...e.toObject(), _id: undefined, areaId: newArea._id }))
  );

  return newArea;
};
