// src/components/postmap/PostMapWrapper.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import LeafletMap from './draw/LeafletMap';
import SidebarContainer from './sidebars/SidebarContainer';

import { useTempAreaId } from '../../hooks/local/useTempAreaId';
import { useAreaContext } from '../../context/AreaContext';
import { useSidebarContext } from '../../context/SidebarContext';

import useAutoSave from '../../hooks/local/useAutoSave';
import { useEnsureValidAreaId } from '../../utils/useEnsureValidAreaId';

import {
  createAreaHandler,
  updatePolygonHandler,
  saveAreaMetadataHandler,
} from './handlers/areaHandlers';

import {
  handleCreateEntityDispatcher,
  updateEntityGeometryHandler,
  saveEntityMetadataHandler,
} from './handlers/entityUtils.js';

export default function PostMapWrapper() {
  const mapRef = useRef(null);
  useEnsureValidAreaId(() => null, 18);

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

  const { openSidebar } = useSidebarContext();

  useAutoSave();

  // 🧹 Reset selectedEntity và entity list khi areaId thay đổi
  useEffect(() => {
    setSelectedEntityId(null);
    clearEntities?.();
  }, [areaId]);

  // ✅ Xử lý khi tạo khu vực (rectangle)
  const onCreateArea = createAreaHandler({
    mapRef,
    setIsCreatingArea,
    saveAreaId,
    openSidebar,
    setAreaMetadata,
  });

  // ✅ Xử lý khi vẽ Polygon / Marker
  const onCreateEntity = useCallback(
  ({ type, coordinates, geometry }) => {
    if (!areaId) {
      toast.error('Vui lòng chờ khởi tạo khu vực trước khi vẽ');
      console.warn('[onCreateEntity] Không có areaId, đang chờ...');
      return;
    }

    const dispatch = handleCreateEntityDispatcher({
      areaId,
      addEntity,
      setSelectedEntityId,
      openSidebar,
    });

    if (typeof dispatch !== 'function') {
      console.error('[onCreateEntity] dispatch không hợp lệ:', dispatch);
      return;
    }

    dispatch({ type, coordinates, geometry });
  },
  [areaId, addEntity, setSelectedEntityId, openSidebar]
);

  return (
    <div className="flex h-screen w-full relative">
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
          mapRef={mapRef}
          isCreatingArea={isCreatingArea}
          onCreateArea={onCreateArea}
          onCreateEntity={onCreateEntity}
          disableEntityCreation={!areaId}
          onUpdatePolygon={({ coordinates }) =>
            updatePolygonHandler({ areaId, coordinates, setAreaMetadata }) 
          }
          onUpdateEntityGeometry={({ entityId, coordinates }) =>
            updateEntityGeometryHandler({
              areaId,
              entityId,
              coordinates,
              contextUpdateEntityGeometry,
            })
          }
        />
      </div>

      <SidebarContainer
        onSaveAreaMetadata={(metadata) =>
          saveAreaMetadataHandler({ areaId, metadata, setAreaMetadata })
        }
        onSaveEntity={(entityId, metadata) =>
          saveEntityMetadataHandler({
            areaId,
            entityId,
            metadata,
            contextUpdateEntityMetadata,
          })
        }
      />
    </div>
  );
}
