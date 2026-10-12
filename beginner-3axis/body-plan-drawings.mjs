/** Teaching diagrams, not additional simulated machines. */
const paths = {
  articulated:
    "M38 80H90M50 80V64L77 27L126 46V65M116 65H136M116 65V77M136 65V77",
  cartesian:
    "M35 83V20H165V83M25 83H175M45 32H155M97 20V62M87 62H107M87 62V73M107 62V73",
  scara: "M40 83H77M57 83V46L103 30L146 51V76M136 76H156",
  delta:
    "M50 20H150M57 20L78 51L98 72M143 20L122 51L102 72M100 20V48L102 72M91 73H111M100 73V84",
  mobile: "M47 67H151V37H47ZM57 37V25H98V37M67 79H130M46 80H32M159 80H175",
};
export function bodyPlanDrawing(type, label) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 200 100");
  svg.setAttribute("class", "body-plan-drawing");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label);
  const path = document.createElementNS(svg.namespaceURI, "path");
  path.setAttribute("d", paths[type]);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#4568ad");
  path.setAttribute("stroke-width", "8");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-linecap", "round");
  svg.append(path);
  if (type === "articulated" || type === "mobile")
    for (const [x, y] of type === "articulated"
      ? [
          [50, 64],
          [77, 27],
          [126, 46],
        ]
      : [
          [64, 69],
          [135, 69],
        ]) {
      const c = document.createElementNS(svg.namespaceURI, "circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", "7");
      c.setAttribute("fill", "#26374c");
      svg.append(c);
    }
  return svg;
}
