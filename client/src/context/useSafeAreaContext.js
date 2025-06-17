// hooks/context/useSafeAreaContext.js
import { useAreaContext } from '../context/AreaContext';
import { isValidAreaId } from '../utils/areaUtils';

export function useSafeAreaContext() {
  const context = useAreaContext();
  return isValidAreaId(context?.areaId) ? context : null;
}
