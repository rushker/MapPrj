//  Refactored PostMapWrapper.jsx 
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import LeafletMap from './draw/LeafletMap';
import SidebarContainer from './sidebars/SidebarContainer';
import { createArea, updateAreaPolygon} from '../../services/areas';
import { updateEntityGeometry } from '../../services/entities';
import { useTempAreaId } from '../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../context/AreaContext';
import { SidebarProvider, useSidebarContext } from '../../context/SidebarContext';
import { useEnsureValidAreaId } from '../../utils/useEnsureValidAreaId';

export default function PostMapWrapper({
  onSaveAreaMetadata,
  onSaveEntityMetadata,
  onCreateAreaSuccess,
}) {
  const mapRef = useRef(null);
  const getCoordinates = () => null;
  useEnsureValidAreaId(getCoordinates, 18);

  const { saveAreaId } = useTempAreaId();
  const {
    areaId,
    areaMetadata,
    setAreaMetadata,
    addEntity,
    updateEntityMetadata: contextUpdateEntityMetadata,
    updateEntityGeometry: contextUpdateEntityGeometry,
    clearEntities,
    isEditMode,
  } = useAreaContext();

  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [isCreatingArea, setIsCreatingArea] = useState(false);

  const { sidebarOpen, editingType, openSidebar } = useSidebarContext();

  useEffect(() => {
    setSelectedEntityId(null);
    clearEntities?.();
  }, [areaId]);

  const handleCreateArea = async ({ coordinates, polygon }) => {
    if (!window.confirm('Bạn có chắc muốn tạo khu vực này?')) return;
    if (isCreatingArea) return;

    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length < 3 ||
      coordinates.some(
        (c) =>
          !Array.isArray(c) ||
          c.length !== 2 ||
          c.includes(undefined) ||
          c.includes(null)
      )
    ) {
      toast.error('Tọa độ không hợp lệ để tạo khu vực');
      return;
    }

    const currentZoom = mapRef.current?.getZoom();
    const maxZoom = typeof currentZoom === 'number' ? currentZoom : 18;

    setIsCreatingArea(true);
    try {
      const res = await createArea({ coordinates, polygon, maxZoom });

      if (!res.success || !res.data?._id) {
        throw new Error('Tạo khu vực thất bại từ phía backend');
      }

      const newId = res.data._id;
      saveAreaId(newId, coordinates);
      toast.success('Đã tạo khu vực thành công!');

      openSidebar('area', res.data);
      onCreateAreaSuccess?.(res.data);

      return newId;
    } catch (err) {
      console.error(err);
      toast.error('Tạo khu vực thất bại: ' + err.message);
      return null;
    } finally {
      setIsCreatingArea(false);
    }
  };

  const handleUpdatePolygon = async ({ coordinates }) => {
    if (!areaId) {
      toast.error('Chưa có khu vực để cập nhật polygon');
      return;
    }
    try {
      const res = await updateAreaPolygon(areaId, { polygon: coordinates });
      if (!res.success) throw new Error('Backend cập nhật polygon thất bại');
      setAreaMetadata(res.data);
      toast.success('Cập nhật polygon thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật polygon thất bại: ' + err.message);
    }
  };

  const handleUpdateEntityGeometry = async ({ entityId, coordinates }) => {
    if (!areaId) {
      toast.error('Không tìm thấy areaId');
      return;
    }
    try {
      await updateEntityGeometry(areaId, entityId, { coordinates });
      contextUpdateEntityGeometry(entityId, { coordinates });
      toast.success('Đã cập nhật vị trí/thể hiện hình học của đối tượng');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật hình học thất bại');
    }
  };

  const handleCreateEntity = (entity) => {
    if (!areaId) {
      toast.error('Vui lòng tạo khu vực trước khi thêm đối tượng');
      return;
    }
    addEntity(entity);
    setSelectedEntityId(entity._id);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative">
        {areaId && (!sidebarOpen || editingType !== 'area') && (
          <button
            className="absolute top-4 left-4 z-[1000] bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            onClick={() => openSidebar('area', areaMetadata)}
          >
            ✏️ Chỉnh sửa Khu A
          </button>
        )}

        <div className="flex-1">
          <LeafletMap
            areaMetadata={areaMetadata}
            selectedEntityId={selectedEntityId}
            onSelectEntity={setSelectedEntityId}
            isEditMode={isEditMode}
            enableDraw={isEditMode}
            drawShape={null}
            enableEdit={isEditMode}
            enableDrag={isEditMode}
            enableRemove={isEditMode}
            onCreateArea={handleCreateArea}
            onUpdatePolygon={handleUpdatePolygon}
            onUpdateEntityGeometry={handleUpdateEntityGeometry}
            onCreateEntity={handleCreateEntity}
            isCreatingArea={isCreatingArea}
            mapRef={mapRef}
          />
        </div>

        <SidebarContainer
          onSaveAreaMetadata={onSaveAreaMetadata}
          onSaveEntity={onSaveEntityMetadata}
        />
      </div>
    </SidebarProvider>
  );
}
