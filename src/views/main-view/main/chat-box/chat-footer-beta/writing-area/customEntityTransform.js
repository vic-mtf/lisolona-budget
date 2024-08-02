import { isPlainObject } from "lodash";
import styleToCss from "style-object-to-css-string";

export default function customEntityTransform(entity, text) {
  if (entity.type === "MENTION") {
    return `<a href="${entity.data.url}" class="mention">${text}</a>`;
  }
  if (entity.type === "EMOJI") {
    const data = entity.data;
    const children = data.metadata.glyph;
    const url = window.encodeURI(`${process.env.PUBLIC_URL}/${data.src}`);
    const style = {
      width: 0,
      height: 0,
      position: "relative",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${url})`,
      color: "transparent",
      fontFamily: "noto emoji",
      padding: 0,
      margin: 0,
    };

    return `<span style="${styleToCss(style)}">${children}</span>`;
  }
  return text;
}
