const getSize = (text, width) => {
  toggleAppendELement(true, { width });
  const element = document.createElement("div");
  element.style.width = "80%";
  element.style.display = "inline-block";
  element.innerText = text;
  pseudoContainer.appendChild(element);
  const clientRect = element.getBoundingClientRect();
  pseudoContainer.removeChild(element);
  toggleAppendELement(false);
  console.log(clientRect);
  return clientRect.height;
};

const pseudoContainer = document.createElement("div");
//pseudoContainer.style.width = 0;
//pseudoContainer.style.height = 0;
pseudoContainer.style.position = "fixed";
pseudoContainer.style.top = "-9999px";
pseudoContainer.style.zIndex = -10;
pseudoContainer.style.overflow = "hidden";

const toggleAppendELement = (append = true, style = {}) => {
  if (style)
    Object.keys(style).forEach((key) => {
      pseudoContainer.style[key] = style[key];
    });
  if (append && !document.body.contains(pseudoContainer))
    document.body.appendChild(pseudoContainer);
  if (!append && document.body.contains(pseudoContainer))
    document.body.removeChild(pseudoContainer);
};
export default getSize;
