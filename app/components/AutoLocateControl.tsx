import { createControlComponent } from "@react-leaflet/core";
import { Control, DomUtil } from "leaflet";

Control.AutoLocate = Control.extend({
  onAdd: function (map) {
    const img = DomUtil.create("img");
    img.src = "/images/current_location.png";
    img.style.width = "30px";
    img.style.height = "30px";
    img.style.cursor = "pointer";
    img.style.padding = "8px";
    img.style.backgroundColor = "white";
    img.style.borderRadius = "50%";
    img.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    img.style.margin = "10px";
    img.title = "Current Position";
    img.alt = "Current Position";

    // onClick
    img.onclick = function () {
      map.locate({ setView: true });
    };

    return img;
  },
  onRemove: function (map) {},
});

export const AutoLocateControl = createControlComponent(
  (props) => new Control.AutoLocate(props)
);
