// utils/cut/cloneAreaFromCut.js
import Area from '../../models/Area.js';
import Entity from '../../models/Entity.js';
import { pointInPolygon } from './filterMarkersInsidePolygon.js';

export const cloneAreaFromCut = async (projectId, areaId, body) => {
  // Thêm validate projectId
  const oldArea = await Area.findOne({ _id: areaId, projectId });
  if (!oldArea) throw new Error('Original area not found');

  // Sửa thành geometry.coordinates
  const filtered = entities.filter(e => {
  const [lng, lat] = e.geometry.coordinates; // GeoJSON format
  return pointInPolygon([lng, lat], body.polygon);
  });

  // Thêm logic clone metadata
  const newArea = new Area({
    ...oldArea.toObject(),
    _id: undefined,
    ...body,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await newArea.save();

  // Optionally clone filtered markers
  await Entity.insertMany(
    filtered.map(e => ({ ...e.toObject(), _id: undefined, areaId: newArea._id }))
  );

  return newArea;
};
