import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  TorusGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  PointLightHelper,
  GridHelper,
  SphereGeometry,
  MathUtils,
  TextureLoader,
  BoxGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const torus = new Mesh(
  new TorusGeometry(10, 3, 16, 100),
  new MeshStandardMaterial({
    color: 0xff6347,
  })
);

const pointLight = new PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientlight = new AmbientLight(0xffffff);

const lightHelper = new PointLightHelper(pointLight);
const gridHelper = new GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const star = new Mesh(
    new SphereGeometry(0.25, 24, 24),
    new MeshStandardMaterial({ color: 0xffffff })
  );

  const [x, y, z] = Array(3)
    .fill()
    .map(() => MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new TextureLoader().load("./assets/space.jpg");
scene.background = spaceTexture;

const borgTexture = new TextureLoader().load("./assets/borg.jpg");

const borg = new Mesh(
  new BoxGeometry(3, 3, 3),
  new MeshBasicMaterial({ map: borgTexture })
);

const moonTexture = new TextureLoader().load("./assets/moon.jpg");
const normalTexture = new TextureLoader().load("./assets/normal.jpg");

const moon = new Mesh(
  new SphereGeometry(3, 32, 32),
  new MeshStandardMaterial({ map: borgTexture, normalMap: normalTexture })
);

borg.position.z = 30;
borg.position.setX(-10);

scene.add(pointLight, ambientlight, torus, borg, moon);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  borg.rotation.y += 0.01;
  borg.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
