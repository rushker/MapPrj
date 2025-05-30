// src/hooks/useMapEntities.js
import { useState, useEffect } from 'react';
import {
  getEntitiesByArea,
  createEntity,
  updateEntity,
  deleteEntity,
} from '../../services/entities';
import { deleteImage } from '../../services/media';
import { toast } from 'react-hot-toast';

export default function useMapEntities(projectId, areaId) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch entities
  const fetchAll = async () => {
    if (!projectId || !areaId) return;
    setLoading(true);
    try {
      const data = await getEntitiesByArea(projectId, areaId);
      setEntities(data);
    } catch (err) {
      console.error('Failed to load entities', err);
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [projectId, areaId]);

  // Create
  const create = async (payload) => {
    try {
      const saved = await createEntity(projectId, areaId, payload);
      setEntities((prev) => [...prev, saved]);
      toast.success('Tạo thành công');
      return saved;
    } catch {
      toast.error('Tạo thất bại');
      throw new Error('createEntity failed');
    }
  };

  // Update
  const update = async (id, payload) => {
    const prevEntity = entities.find((e) => e._id === id);
    try {
      const updated = await updateEntity(projectId, areaId, id, payload);

      // Delete old image if changed
      const oldId = prevEntity?.image?.public_id;
      const newId = updated?.image?.public_id;
      if (oldId && oldId !== newId) {
        try {
          await deleteImage(oldId);
        } catch (err) {
          console.warn('Failed to delete old image from Cloudinary', err);
        }
      }

      setEntities((prev) =>
        prev.map((e) => (e._id === id ? updated : e))
      );
      toast.success('Cập nhật thành công');
      return updated;
    } catch {
      toast.error('Cập nhật thất bại');
      throw new Error('updateEntity failed');
    }
  };

  // Delete
  const remove = async (id) => {
    const entity = entities.find((e) => e._id === id);
    try {
      // Delete associated image if exists
      const publicId = entity?.image?.public_id;
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (err) {
          console.warn('Failed to delete image from Cloudinary', err);
        }
      }

      await deleteEntity(projectId, areaId, id);
      setEntities((prev) => prev.filter((e) => e._id !== id));
      toast.success('Xoá thành công');
    } catch {
      toast.error('Xoá thất bại');
      throw new Error('deleteEntity failed');
    }
  };

  // Subsets
  const khuCs = entities.filter((e) => e.type === 'khuC');
  const markers = entities.filter((e) => e.type === 'marker');

  return {
    entities,
    loading,
    fetchAll,
    createEntity: create,
    updateEntity: update,
    deleteEntity: remove,
    khuCs,
    markers,
  };
}
