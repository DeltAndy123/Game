export function newCamera(fov) {
  return new THREE.PerspectiveCamera(
    fov, innerWidth / innerHeight, 0.1, 1000
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
}

export new class TouchControls {
  
}