export function $(e) {return document.querySelector(e)}

export function once(e, f) {
  if(Array.isArray(e)) {
    for(const i of e) f(i);
  } else {
    f(e);
  }
}

export function $$(name, opts = {}) {
  const el = document.createElement(name);
  for(const key in opts.attrs) {
    if(key == "style") {
      if(typeof opts.attrs[key] != "string") {
        el.setAttribute(key, parseCSS(opts.attrs[key]));
      } else {
        el.setAttribute(key, opts.attrs[key]);
      } 
    } else {
      el.setAttribute(key, opts.attrs[key]);
    }
  }
  
  if(opts.on != undefined) {
    if(!Array.isArray(opts.on[0])) {
      el.addEventListener(opts.on[0], opts.on[1]());
    } else {
      for(const [event, func] of opts.on)
        el.addEventListener(event, func);
    }
  }
  
  if(opts.up != undefined) 
    once(opts.up, func => 
      el.addEventListener("pointerup", func)
    );
  
  if(opts.down != undefined) 
    once(opts.down, func => 
      el.addEventListener("pointerdown", func)
    );
  
  if(opts.inside != undefined)
    once(opts.inside, func => {
      el.addEventListener("pointerup", e => {
        const pos = el.getBoundingClientRect();
        
        /*console.log({
          mouseX: e.pageX,
          mouseY: e.pageY,
          top: pos.top,
          right: pos.right,
          bottom: pos.bottom,
          left: pos.left,
        });*/
        
        if(e.pageX > pos.left
        && e.pageX < pos.right
        && e.pageY > pos.top
        && e.pageY < pos.bottom) func(e);
      });
    });
  
  if(opts.outside != undefined)
    once(opts.outside, func => {
      el.addEventListener("pointerup", e => {
        const pos = el.getBoundingClientRect();
        if(!(e.pageX > pos.left
        && e.pageX < pos.right
        && e.pageY > pos.top
        && e.pageY < pos.bottom)) func(e);
      });
    });
  
  if(opts.children != undefined) {
    once(opts.children, e => {
      if(typeof e == "string") {
        el.appendChild(document.createTextNode(e));
      } else {
        el.appendChild(e);
      }
    });
  }
  
  if(opts.forEach != undefined) {
    once(opts.forEach, func => {
      for(let i = 0; i < el.children.length; i++)
        func(el.children[i]);
    });
  }
  
  return el;
}

export function addToGame(a, b) {
  $("#ui > #" + b).appendChild(a);
}

export function parseCSS(css) {
  var str = "";
  for(const key in css) str += `${key}:${css[key]};`;
  
  return str;
}