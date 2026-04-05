import { useDraggableCursor } from '../../../../../../../hooks/useDrawingStageRef';
import ArrowTool from './ArrowTool';
import CircleTool from './CircleTool';
import LineTool from './LineTool';
import RectangleTool from './RectangleTool';

const Figures = () => {
  useDraggableCursor();
  return (
    <>
      <ArrowTool />
      <CircleTool />
      <RectangleTool />
      <LineTool />
    </>
  );
};
export default Figures;
