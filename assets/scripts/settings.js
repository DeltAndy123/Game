import {$, $$, addToGame, parseCSS} from "./util.js";
import {menu} from "./menu.js";
import {inDevEl} from "./in-dev.js";

var settingsEl;

const settingsArr = [
  {
    name: "Back",
    type: "back",
    change() {
      settingsEl.style.display = "none";
    },
  },
  {
    name: "Music",
    type: "bar",
    change(a, b) {
      a.innerText = `Music [${b}%]`;
    },
  },
  {
    name: "Sound",
    type: "bar",
    change(a, b) {
      a.innerText = `Sound [${b}%]`;
    },
  },
  {
    name: "Controls",
    type: "button",
    change(e) {
      console.log(e);
      settingsEl.style.display = "none";
      inDevEl.style.display = "flex";
    },
    //buttonName: "",
  },
];

function parseSettings(arr = []) {
  const internal = [];
  
  function row(left, right) {
    if(left.getAttribute("class") == undefined) {
      left.setAttribute("class", "left");
    } else {
      left.setAttribute(
        "class",
        left.getAttribute("class") + " left",
      );
    }
    
    if(right.getAttribute("class") == undefined) {
      right.setAttribute("class", "right");
    } else {
      right.setAttribute(
        "class",
        right.getAttribute("class") + " right",
      );
    }
    
    return $$("tr", {
      attrs: {style: parseCSS({
        display: "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        border: "2px outset silver",
        "background": "linear-gradient(45deg, silver, white)",
        color: "black",
        "text-align": "center",
        "align-items": "center",
      })},
      children: [left, right],
    });
  }
  
  for(const i of arr) {
    const {name, type, change} = i;
    if(type == "bar") {
      const label = $$("td", {
        //attrs: {class: "left"},
        children: name + " [100%]",
      });
      const slider = $$("input", {
        attrs: {
          type: "range",
          name: "a",
          min: 0,
          max: 100,
          value: 100,
          class: "slider",
          style: parseCSS({width: "100%", height: "100%"}),
        },
      });
      const el = row(label, $$("td", {children: slider}));
      slider.addEventListener("input", 
        e => change(label, e.currentTarget.value),
      );
      internal.push(el);
    } else if(type == "button") {
      i.buttonName ||= "";
      const label = $$("p", {
        attrs: {class: "left"},
        children: name,
      });
      const button = $$("button", {
        attrs: {
          class: "right down",
          style: parseCSS({
            width: "100%",
            height: "100%",
          }),
        },
        children: i.buttonName,
        up: change,
      });
      const el = row(label, $$("td", {children: button}));
      internal.push(el);
    } else if(type == "back") {
      i.buttonName ||= "Back";
      const label = $$("p", {
        attrs: {class: "left"},
        children: name,
      });
      const button = $$("button", {
        attrs: {
          class: "right down",
          style: parseCSS({
            width: "100%",
            height: "100%",
          }),
        },
        children: i.buttonName,
      });
      //const el = row(label, $$("td", {children: button}));
      const el = $$("tr", {
        children: $$("td", {
          children: $$("button", {
            children: i.buttonName,
            attrs: {
              style: parseCSS({
                height: "70px",
              }),
              class: "down",
            },
          }),
        }),
        attrs: {
          class: "every-full", 
          style: parseCSS({
            width: "100%",
            height: "100%",
            display: "flex",
            "flex-direction": "row",
            "justify-content": "space-between",
            border: "2px outset silver",
            "background": "linear-gradient(45deg, silver, white)",
            color: "black",
            "text-align": "center",
            "align-items": "center",
          }),
        },
        up() {
          settingsEl.style.display = "none";
          menu.style.display = "flex";
        }
      });
      internal.push(el);
    }
  }
  
  return internal;
}

settingsEl = $$("table", {
  attrs: {
    id: "settings",
    style: parseCSS({
      display: "none",
    }),
  },
  children: parseSettings(settingsArr),
});

addToGame(settingsEl, "page");

function settings() {
  settingsEl.style.display = "block";
}

export {settings};