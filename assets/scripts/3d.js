import {mderr, checkEl, noop, clamp, RADIAN_HALF} from "./util.js";

export function newCamera(o = {}) {
  return new THREE.PerspectiveCamera(
    o.fov || 80, innerWidth / innerHeight,
    o.min || 0.1, o.max || 1000,
  );
}

export function newBox(size, color) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({color}),
  );
}

export function setQuaternion(mathX, mathY) {
  const qx = new THREE.Quaternion();
  qx.setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    mathX,
  );
  const qz = new THREE.Quaternion();
  qz.setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    mathY,
  );
  
  return {qx, qz};
}

export function updateCamera(cam, mathX, mathY) {
  const {qx, qz} = setQuaternion(mathX, mathY);
  const q = new THREE.Quaternion();
  
  q.multiply(qx);
  q.multiply(qz);
  cam.quaternion.copy(q);
  cam.rotation.z = RADIAN_HALF;
}

export class ControlCamera {
  rx = RADIAN_HALF;
  ry = -RADIAN_HALF;
  changed = false;
  canPan = false;
  
  constructor(o) {
    this.camera = newCamera(o);
    this.loop();
    return this;
  }
  
  loop() {
    if(this.changed) {
      this.changed = false;
      updateCamera(this.camera, this.rx, this.ry);
    }
    requestAnimationFrame(() => this.loop());
  }
  
  bind(el) {
    if(!el) return console.error(
      mderr("Null element @ControlCamera")
    );
    this.el = el;
    return this;
  }
  
  touch = {
    down: false,
    id: null,
    lx: 0,
    ly: 0,
    x: 0,
    y: 0,
  };
  
  onPointerMove = noop;
  
  down(e) {
    if(!this.touch.down) {
      this.touch.down = true;
      this.touch.id = e.pointerId;
      this.touch.lx = e.pageX;
      this.touch.ly = e.pageY;
    }
  }
  
  move(e) {
    if(e.identifier == this.touch.id) {
      this.touch.x = this.touch.lx - e.pageX;
      this.touch.y = this.touch.ly - e.pageY;
      this.touch.lx = e.pageX;
      this.touch.ly = e.pageY;
      this.changed = true;
      
      const sx = -this.touch.x * 0.005;
      const sy = this.touch.y * 0.005;
      
      this.onPointerMove({
        x: this.touch.x,
        y: this.touch.y,
      });
    }
  }
  
  up(e) {
    if(this.touch.down) {
      this.touch.down = false;
      this.touch.id = null;
    }
  }
  
  enable() {
    this.canPan = true;
    this.el.addEventListener("pointerdown", e => this.down(e));
    this.el.addEventListener("touchmove", 
      e => this.move(e.touches[e.touches.length-1]),
    );
    this.el.addEventListener("mousemove", e => this.down(e))
    this.el.addEventListener("pointerup", e => this.up(e));
    return this;
  }
  
  disable() {
    this.canPan = false;
    return this;
  }
}

