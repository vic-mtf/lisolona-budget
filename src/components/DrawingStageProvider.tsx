import React from 'react';
import { Stage } from 'react-konva';
import { DrawingStageContext } from '../hooks/useDrawingStageRef';

const DrawingStageProvider = React.forwardRef(
  ({ children, width, height, scaleX, scaleY }, ref) => {
    const stageRef = React.useRef();

    return (
      <Provider value={stageRef}>
        <div style={{ position: 'absolute' }}>
          <Stage
            width={width}
            height={height}
            ref={(node) => {
              stageRef.current = node;
              if (ref && Object.hasOwnProperty.call(ref, 'current'))
                ref.current = node;
            }}
            style={{ touchAction: 'none' }}
            scaleX={scaleX}
            scaleY={scaleY}
          >
            {children}
          </Stage>
        </div>
      </Provider>
    );
  }
);

DrawingStageProvider.displayName = 'DrawingStageProvider';

const { Provider } = DrawingStageContext;

export default React.memo(DrawingStageProvider);
