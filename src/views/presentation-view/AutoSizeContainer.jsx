import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";

const AutoSizeContainer = React.memo(({ rootRef, children }) => {
  const [size, setSize] = useState({});
  const originalSize = useMemo(() => ({ height: 0, width: 0 }), []);

  useEffect(() => {
    const root = rootRef?.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setSize(
          adjustDimensions(
            originalSize.height,
            originalSize.width,
            entry.target.clientHeight,
            entry.target.clientWidth
          )
        );
      });
    });

    if (root) {
      resizeObserver.observe(root);
      root
        .querySelector("& > video")
        ?.addEventListener("loadedmetadata", (event) => {
          originalSize.height = event.target.videoHeight;
          originalSize.width = event.target.videoWidth;
          setSize(
            adjustDimensions(
              event.target.videoHeight,
              event.target.videoWidth,
              event.target.clientHeight,
              event.target.clientWidth
            )
          );
        });
      return () => resizeObserver.unobserve(root);
    }
  }, [rootRef, originalSize]);
  return typeof children === "function" ? children(size) : children;
});

AutoSizeContainer.displayName = "AutoSizeContainer";

AutoSizeContainer.propTypes = {
  rootRef: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

function adjustDimensions(originalHeight, originalWidth, maxHeight, maxWidth) {
  if (!originalHeight && !originalWidth) return { height: 0, width: 0 };
  let widthRatio = maxWidth / originalWidth;
  let heightRatio = maxHeight / originalHeight;
  let ratio = Math.min(widthRatio, heightRatio);
  let width = originalWidth * ratio;
  let height = originalHeight * ratio;
  return { width, height, ratio };
}
export default AutoSizeContainer;
