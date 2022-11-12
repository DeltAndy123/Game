import {$, $$, addToGame, parseCSS} from "./util.js";
import {menu} from "./menu.js";

const inDevEl = $$("div", {
  attrs: {
    class: "every-full",
    style: parseCSS({
      display: "none",
      "flex-direction": "column",
      "background-color": "gray",
      height: "100%",
    }),
  },
  children: [
    $$("button", {
      attrs: {
        class: "down",
        style: parseCSS({
          border: "5px outset green",
          background: "linear-gradient(45deg, green, darkgreen)",
          color: "white",
          "font-weight": "bold",
        }),
      },
      children: "Return Home?",
      up() {
        inDevEl.style.display = "none";
        menu.style.display = "flex";
      },
    }),
    $$("img", {
      attrs: {
        style: parseCSS({
          height: "80vh",
          "object-fit": "scale-down",
        }),
        src: "/assets/images/in-dev-troll.png",
        alt: "Troll face with a construction hat"
      },
    }),
  ],
});

addToGame(inDevEl, "page");

export {inDevEl};