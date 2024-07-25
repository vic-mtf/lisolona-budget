import React from "react";
import defaultIcon from "./icons8-info-64.png";
import propType from "prop-types";

export default function ImgToIcon({
  src = "",
  uri = "",
  size = 20,
  alt,
  ...otherProps
}) {
  const srcUrl = src || uri || defaultIcon;
  return (
    <React.Fragment>
      <img
        src={srcUrl}
        height={size}
        width={size}
        {...otherProps}
        alt={alt || srcUrl}
      />
    </React.Fragment>
  );
}

ImgToIcon.propTypes = {
  size: propType.number,
  src: propType.string,
  uri: propType.string,
};
