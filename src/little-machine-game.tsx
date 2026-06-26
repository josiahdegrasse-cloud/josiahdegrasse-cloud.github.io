import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  box,
  canvasTexture,
  colors,
  cylinder,
  makeLacrosseHead,
  material,
} from "./game-kit";
import { caseById } from "./machine-campaign-data";
import {
  resolveDeskObstacle,
  robotVelocity,
  type DeskObstacle,
} from "./little-machine-physics";
import { littleMachineSound } from "./little-machine-audio";
import type {
  RobotPartId,
} from "./little-machine-types";
import type {
  CampaignHud,
  CaseEvidence,
  CaseId,
} from "./machine-campaign-types";

type LittleMachineGameProps = {
  paused: boolean;
  quality: "high" | "low";
  guided: boolean;
  soundEnabled: boolean;
  activeCase: CaseId;
  collectedEvidence: string[];
  equipped: RobotPartId[];
  onHudChange: (hud: CampaignHud) => void;
  onCollectEvidence: (evidence: CaseEvidence) => void;
};

type EvidenceModel = {
  evidence: CaseEvidence;
  group: THREE.Group;
  beacon: THREE.Group;
};

const ROBOT_RADIUS = 0.85;
const DESK_X = 24;
const DESK_Z = 21;

function addShadows(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });
}

function textPanel(
  text: string,
  subtitle: string,
  background: string,
  size: [number, number],
) {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(...size),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(text, subtitle, background, "#17130f", "#d82f24"),
    }),
  );
}

function makeTrackedRobot(scene: THREE.Scene) {
  const robot = new THREE.Group();
  robot.name = "little-machine";

  const base = new THREE.Group();
  robot.add(base);
  box(base, [1.7, 0.5, 1.65], [0, 0.62, 0], colors.orange);
  box(base, [1.35, 0.38, 1.42], [0, 0.88, -0.02], colors.ink);
  box(base, [1.1, 0.2, 0.15], [0, 0.78, 0.82], colors.yellow, {
    emissive: colors.yellow,
    emissiveIntensity: 0.3,
  });

  const treads: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const tread = new THREE.Group();
    tread.position.set(side * 0.95, 0.48, 0);
    base.add(tread);
    box(tread, [0.38, 0.62, 1.9], [0, 0, 0], colors.charcoal);
    for (const z of [-0.62, 0, 0.62]) {
      const wheel = cylinder(tread, 0.24, 0.4, [0, 0, z], colors.chrome, 12);
      wheel.rotation.z = Math.PI / 2;
    }
    treads.push(tread);
  }

  const neck = cylinder(robot, 0.13, 0.82, [0, 1.35, 0], colors.chrome, 10);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.82, 0.06);
  robot.add(headPivot);
  const head = box(headPivot, [1.15, 0.72, 0.72], [0, 0, 0], colors.tuftsBrown);
  head.rotation.z = -0.035;
  box(headPivot, [0.95, 0.08, 0.55], [0, 0.4, 0], colors.yellow);

  const eyeHousing = cylinder(headPivot, 0.28, 0.18, [0.18, 0.02, 0.43], colors.ink, 18);
  eyeHousing.rotation.x = Math.PI / 2;
  const aperture = cylinder(headPivot, 0.15, 0.2, [0.18, 0.02, 0.54], colors.powder, 18);
  aperture.rotation.x = Math.PI / 2;
  (aperture.material as THREE.MeshStandardMaterial).emissive.setHex(colors.powder);
  (aperture.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.1;
  const smallSensor = cylinder(headPivot, 0.09, 0.17, [-0.32, -0.05, 0.4], colors.red, 12);
  smallSensor.rotation.x = Math.PI / 2;

  const leftRail = box(robot, [0.14, 0.65, 1.15], [-1, 1.05, 0], colors.chrome);
  const rightRail = box(robot, [0.14, 0.65, 1.15], [1, 1.05, 0], colors.chrome);
  void leftRail;
  void rightRail;

  const attachments = new Map<RobotPartId, THREE.Group>();
  const makeAttachment = (id: RobotPartId) => {
    const group = new THREE.Group();
    group.visible = false;
    group.name = id;
    robot.add(group);
    attachments.set(id, group);
    return group;
  };

  const clamps = makeAttachment("clamp-arms");
  for (const side of [-1, 1]) {
    const arm = box(clamps, [0.22, 0.22, 1.2], [side * 1.28, 1.1, 0.45], colors.orange);
    arm.rotation.x = -0.25;
    const jaw = box(clamps, [0.42, 0.45, 0.18], [side * 1.28, 0.92, 1.02], colors.yellow);
    jaw.rotation.z = side * 0.18;
  }

  const scanner = makeAttachment("sensory-scanner");
  const scannerDish = cylinder(scanner, 0.32, 0.12, [0, 2.28, 0], colors.green, 18);
  scannerDish.rotation.x = Math.PI / 2;
  box(scanner, [0.06, 0.62, 0.06], [0, 1.96, 0], colors.chrome);

  const diagnostic = makeAttachment("diagnostic-module");
  box(diagnostic, [0.75, 0.55, 0.18], [-0.63, 1.35, -0.88], colors.red, {
    emissive: colors.red,
    emissiveIntensity: 0.2,
  });
  for (let index = 0; index < 3; index += 1) {
    box(diagnostic, [0.1, 0.08, 0.04], [-0.83 + index * 0.2, 1.35, -0.78], index === 2 ? colors.yellow : colors.white);
  }

  const radio = makeAttachment("radio-antenna");
  const mast = box(radio, [0.045, 1.2, 0.045], [0.58, 2.15, -0.2], colors.chrome);
  mast.rotation.z = -0.08;
  const radioTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshBasicMaterial({ color: colors.pink }),
  );
  radioTip.position.set(0.63, 2.78, -0.2);
  radio.add(radioTip);

  const scoop = makeAttachment("scoop-launcher");
  const lacrosseHead = makeLacrosseHead(colors.white);
  lacrosseHead.position.set(1.48, 1.25, 0.42);
  lacrosseHead.scale.setScalar(0.48);
  lacrosseHead.rotation.set(0, 0.35, -Math.PI / 2);
  scoop.add(lacrosseHead);

  const runners = makeAttachment("runner-kit");
  for (const side of [-1, 1]) {
    const runner = box(runners, [0.18, 0.12, 2.4], [side * 0.93, 0.08, 0], colors.powder);
    runner.rotation.x = -0.02;
  }

  const predictor = makeAttachment("prediction-processor");
  const predictionOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.28, 1),
    material(colors.yellow, { emissive: colors.yellow, emissiveIntensity: 0.7 }),
  );
  predictionOrb.position.set(-0.65, 2.08, -0.28);
  predictor.add(predictionOrb);

  const compass = makeAttachment("navigation-compass");
  const compassRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.31, 0.055, 8, 24),
    material(colors.blue, { emissive: colors.blue, emissiveIntensity: 0.65 }),
  );
  compassRing.position.set(0, 1.32, -0.96);
  compass.add(compassRing);

  const coffee = makeAttachment("coffee-cell");
  cylinder(coffee, 0.24, 0.7, [0.68, 1.1, -0.78], colors.oxblood, 12);
  box(coffee, [0.2, 0.1, 0.2], [0.68, 1.5, -0.78], colors.chrome);

  robot.position.set(-1.35, 0, 4.15);
  addShadows(robot);
  scene.add(robot);
  return {
    robot,
    base,
    treads,
    neck,
    headPivot,
    aperture,
    attachments,
    predictionOrb,
    radioTip,
  };
}

function addDesk(scene: THREE.Scene) {
  const desk = box(scene, [52, 1.1, 46], [0, -0.65, 0], 0x7b4d31);
  desk.receiveShadow = true;
  for (let index = -5; index <= 5; index += 1) {
    box(scene, [52, 0.015, 0.035], [0, -0.08, index * 4], index % 2 ? 0x5f3825 : 0x8b5a3b);
  }
  box(scene, [1.1, 8, 46], [-26.3, -4, 0], colors.walnut);
  box(scene, [1.1, 8, 46], [26.3, -4, 0], colors.walnut);
  box(scene, [52, 8, 1.1], [0, -4, -23.3], colors.walnut);
  box(scene, [52, 8, 1.1], [0, -4, 23.3], colors.walnut);
}

function addBooks(scene: THREE.Scene, obstacles: DeskObstacle[]) {
  const colorsUsed = [colors.red, colors.blue, colors.green, colors.yellow];
  for (let index = 0; index < 4; index += 1) {
    const width = 8.5 - index * 0.5;
    const book = box(scene, [width, 0.75, 5.5], [-6, 0.35 + index * 0.75, -15], colorsUsed[index]);
    book.rotation.y = index % 2 ? 0.05 : -0.03;
  }
  const title = textPanel("SYSTEMS", "NOTES / TESTS / FAILED IDEAS", "#f6c83f", [6.8, 1.5]);
  title.position.set(-6, 3.55, -12.2);
  scene.add(title);
  obstacles.push({ x: -6, z: -15, radius: 4.2 });
}

function addLaptop(scene: THREE.Scene, obstacles: DeskObstacle[]) {
  const base = box(scene, [11, 0.45, 7], [14.5, 0.25, 14], colors.charcoal);
  base.rotation.y = -0.08;
  const screen = box(scene, [11, 7, 0.5], [14.5, 3.6, 17.2], colors.ink);
  screen.rotation.x = -0.08;
  screen.rotation.y = -0.08;
  const ui = textPanel("AI REVIEW", "SOURCES / DIFF / ROLLBACK", "#d82f24", [9.6, 5.6]);
  ui.position.set(14.85, 4, 16.9);
  ui.rotation.x = -0.08;
  ui.rotation.y = -0.08;
  scene.add(ui);
  obstacles.push({ x: 14.5, z: 14, radius: 5.3 });
}

function addRecordPlayer(scene: THREE.Scene, obstacles: DeskObstacle[], animations: Array<(t: number) => void>) {
  const group = new THREE.Group();
  group.position.set(-17, 0, 13);
  scene.add(group);
  box(group, [10, 0.8, 8], [0, 0.4, 0], colors.oxblood);
  const record = cylinder(group, 3.1, 0.12, [0, 0.9, 0], colors.ink, 48);
  const label = cylinder(group, 0.72, 0.14, [0, 0.98, 0], colors.pink, 28);
  box(group, [0.15, 0.15, 4.5], [3.2, 1.15, -0.5], colors.chrome).rotation.y = -0.32;
  const title = textPanel("HEADTAP", "MADRID / TONIGHT / 1.2 KM", "#f26a8d", [6.5, 1.45]);
  title.position.set(0, 3.1, -3.8);
  group.add(title);
  animations.push((t) => {
    record.rotation.y = t * 0.65;
    label.rotation.y = t * 0.65;
  });
  obstacles.push({ x: -17, z: 13, radius: 4.8 });
}

function addLab(scene: THREE.Scene, obstacles: DeskObstacle[]) {
  const group = new THREE.Group();
  group.position.set(16, 0, -12);
  scene.add(group);
  box(group, [11, 0.55, 7], [0, 0.28, 0], colors.white);
  for (let index = 0; index < 5; index += 1) {
    cylinder(group, 0.42, 1.2 + index * 0.12, [-3.6 + index * 1.8, 0.9, 0.5], index === 2 ? colors.orange : colors.green, 16);
  }
  box(group, [3.6, 4.5, 3], [2.8, 2.55, -1.6], colors.white);
  box(group, [3, 1.2, 0.08], [2.8, 3, -0.06], colors.green, { emissive: colors.green, emissiveIntensity: 0.28 });
  const report = textPanel("TWEAK", "TEXTURE 43 / 100 · PANEL n=24", "#f6c83f", [5.8, 1.5]);
  report.position.set(-1.8, 2.1, -3.25);
  group.add(report);
  obstacles.push({ x: 16, z: -12, radius: 5.2 });
}

function addBackgammon(scene: THREE.Scene, obstacles: DeskObstacle[]) {
  const board = box(scene, [9.5, 0.35, 7], [-2, 0.15, 5.5], colors.tuftsBrown);
  for (let index = 0; index < 12; index += 1) {
    const x = -5.8 + (index % 6) * 1.55;
    const z = 4.2 + Math.floor(index / 6) * 2.6;
    const point = box(scene, [0.72, 0.07, 2], [x, 0.38, z], index % 2 ? colors.white : colors.red);
    point.rotation.y = Math.floor(index / 6) ? Math.PI : 0;
  }
  for (let index = 0; index < 8; index += 1) {
    cylinder(scene, 0.34, 0.15, [-5 + (index % 4) * 1.3, 0.54, 4.5 + Math.floor(index / 4) * 2.1], index % 2 ? colors.ink : colors.white, 18);
  }
  // The board is intentionally driveable: its points and checkers form the first playground.
  void obstacles;
  void board;
}

function addLacrosseRig(scene: THREE.Scene, obstacles: DeskObstacle[]) {
  const shaft = cylinder(scene, 0.16, 16, [6, 0.8, 17], colors.chrome, 12);
  shaft.rotation.z = Math.PI / 2;
  const head = makeLacrosseHead(colors.white);
  head.position.set(14.2, 0.9, 17);
  head.rotation.z = -Math.PI / 2;
  head.scale.setScalar(1.2);
  scene.add(head);
  for (const x of [2, 6, 10]) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.48, 14, 10), material(colors.yellow));
    ball.position.set(x, 0.55, 18.5);
    scene.add(ball);
  }
  obstacles.push({ x: 14.2, z: 17, radius: 1.5 });
}

function addSnowboardBridge(scene: THREE.Scene) {
  const board = box(scene, [3.2, 0.28, 15], [-17, 1.35, -1], colors.powder);
  board.rotation.x = -0.12;
  board.rotation.z = 0.04;
  box(scene, [1.2, 0.35, 0.8], [-17, 1.65, -4], colors.ink);
  box(scene, [1.2, 0.35, 0.8], [-17, 1.2, 2], colors.ink);
}

function addMokaStation(scene: THREE.Scene, obstacles: DeskObstacle[], animations: Array<(t: number) => void>) {
  const group = new THREE.Group();
  group.position.set(2, 0, -16);
  scene.add(group);
  cylinder(group, 2.3, 0.45, [0, 0.23, 0], colors.charcoal, 22);
  const body = cylinder(group, 1.2, 2.7, [0, 1.75, 0], colors.chrome, 8);
  body.scale.set(1, 1, 0.9);
  cylinder(group, 0.95, 1.5, [0, 3.7, 0], colors.chrome, 8);
  box(group, [1.9, 0.22, 0.8], [1.45, 3.7, 0], colors.ink);
  const steam: THREE.Mesh[] = [];
  for (let index = 0; index < 4; index += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.25 + index * 0.07, 10, 8),
      new THREE.MeshBasicMaterial({ color: colors.white, transparent: true, opacity: 0.2 }),
    );
    puff.position.set(0, 5 + index * 0.5, 0);
    group.add(puff);
    steam.push(puff);
  }
  animations.push((t) => steam.forEach((puff, index) => {
    puff.position.y = 4.8 + ((t * 0.42 + index * 0.22) % 1) * 2.2;
    puff.position.x = Math.sin(t * 1.2 + index) * 0.25;
  }));
  obstacles.push({ x: 2, z: -16, radius: 2.5 });
}

function makeEvidencePickup(scene: THREE.Scene, evidence: CaseEvidence, accent: string): EvidenceModel {
  const group = new THREE.Group();
  group.position.set(evidence.position[0], 0.45, evidence.position[1]);
  scene.add(group);
  const core = new THREE.Mesh(
    evidence.strength === "missing"
      ? new THREE.OctahedronGeometry(0.52, 0)
      : new THREE.DodecahedronGeometry(0.52, 0),
    material(new THREE.Color(accent).getHex(), {
      emissive: new THREE.Color(accent).getHex(),
      emissiveIntensity: 0.75,
      roughness: 0.3,
    }),
  );
  group.add(core);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.08, 8, 24),
    new THREE.MeshBasicMaterial({ color: colors.white }),
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const beacon = new THREE.Group();
  beacon.position.set(evidence.position[0], 1.6, evidence.position[1]);
  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 0),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(accent) }),
  );
  beacon.add(diamond);
  scene.add(beacon);
  return { evidence, group, beacon };
}

export function LittleMachineGame({
  paused,
  quality,
  guided,
  soundEnabled,
  activeCase,
  collectedEvidence,
  equipped,
  onHudChange,
  onCollectEvidence,
}: LittleMachineGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const guidedRef = useRef(guided);
  const soundRef = useRef(soundEnabled);
  const collectEvidenceRef = useRef(onCollectEvidence);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { guidedRef.current = guided; }, [guided]);
  useEffect(() => { soundRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { collectEvidenceRef.current = onCollectEvidence; }, [onCollectEvidence]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x15202a);
    scene.fog = new THREE.Fog(0x15202a, 34, 68);
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.08, 110);
    const renderer = new THREE.WebGLRenderer({ antialias: quality === "high", powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, quality === "high" ? 1.3 : 0.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = quality === "high";
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9e5ed, 0x2f1c12, 1.25));
    const lamp = new THREE.DirectionalLight(0xffd59b, 4.2);
    lamp.position.set(-18, 30, 15);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(quality === "high" ? 2048 : 1024, quality === "high" ? 2048 : 1024);
    const lampCamera = lamp.shadow.camera as THREE.OrthographicCamera;
    lampCamera.left = -30;
    lampCamera.right = 30;
    lampCamera.top = 28;
    lampCamera.bottom = -28;
    scene.add(lamp, lamp.target);
    const monitorGlow = new THREE.PointLight(colors.powder, 20, 28, 1.5);
    monitorGlow.position.set(15, 10, 20);
    scene.add(monitorGlow);
    const recordGlow = new THREE.PointLight(colors.pink, 12, 20, 1.5);
    recordGlow.position.set(-18, 5, 14);
    scene.add(recordGlow);

    addDesk(scene);
    const obstacles: DeskObstacle[] = [];
    const worldAnimations: Array<(time: number) => void> = [];
    addBooks(scene, obstacles);
    addLaptop(scene, obstacles);
    addRecordPlayer(scene, obstacles, worldAnimations);
    addLab(scene, obstacles);
    addBackgammon(scene, obstacles);
    addLacrosseRig(scene, obstacles);
    addSnowboardBridge(scene);
    addMokaStation(scene, obstacles, worldAnimations);

    const machineCase = caseById.get(activeCase)!;
    const recovered = new Set(collectedEvidence);
    const evidenceModels = machineCase.evidence.map((evidence) =>
      makeEvidencePickup(scene, evidence, machineCase.accent),
    );
    const {
      robot,
      base,
      treads,
      neck,
      headPivot,
      aperture,
      attachments,
      predictionOrb,
      radioTip,
    } = makeTrackedRobot(scene);
    const spawnX = machineCase.startPosition[0];
    const spawnZ = machineCase.startPosition[1];
    robot.position.set(spawnX, 0, spawnZ);

    const caseGlow = new THREE.PointLight(new THREE.Color(machineCase.accent), 18, 24, 1.4);
    caseGlow.position.set(spawnX, 7, spawnZ);
    scene.add(caseGlow);

    equipped.forEach((id) => {
      const attachment = attachments.get(id);
      if (attachment) attachment.visible = true;
    });
    evidenceModels.forEach((model) => {
      model.group.visible = !recovered.has(model.evidence.id);
      model.beacon.visible = !recovered.has(model.evidence.id) && guidedRef.current;
    });

    const keys = new Set<string>();
    let elapsed = 0;
    let previousFrame = performance.now();
    const targetCamera = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    let frame = 0;
    let heading = Math.PI;
    let speed = 0;
    let verticalVelocity = 0;
    let grounded = true;
    let charge = 100;
    let nearbyEvidence: CaseEvidence | null = null;
    let message: string | null = `${machineCase.project}: recover the evidence before making the call.`;
    let messageUntil = 5;
    let lastHud = "";
    let eyeBlink = 0;
    let bump = 0;
    let lastBumpSound = -10;

    const recoverEvidence = (evidence: CaseEvidence) => {
      recovered.add(evidence.id);
      const model = evidenceModels.find((entry) => entry.evidence.id === evidence.id)!;
      model.group.visible = false;
      model.beacon.visible = false;
      message = `${evidence.label}: ${evidence.finding}`;
      messageUntil = elapsed + 5;
      eyeBlink = 1;
      if (soundRef.current) littleMachineSound("part");
      collectEvidenceRef.current(evidence);
    };

    const interact = () => {
      if (nearbyEvidence) {
        recoverEvidence(nearbyEvidence);
        nearbyEvidence = null;
      }
    };

    const reset = () => {
      robot.position.set(spawnX, 0, spawnZ);
      heading = Math.PI;
      speed = 0;
      verticalVelocity = 0;
      grounded = true;
      message = "The machine rights itself with as much dignity as it can manage.";
      messageUntil = elapsed + 3.5;
    };

    const keyDown = (event: KeyboardEvent) => {
      keys.add(event.code);
      if (event.code === "KeyE" || event.code === "Enter") interact();
      if (event.code === "KeyR") reset();
      if (event.code === "Space" && grounded) {
        verticalVelocity = equipped.includes("scoop-launcher")
          ? 6.7
          : equipped.includes("runner-kit") ? 5.8 : 4.1;
        grounded = false;
      }
    };
    const keyUp = (event: KeyboardEvent) => keys.delete(event.code);
    const virtualInput = (event: Event) => {
      const detail = (event as CustomEvent<{ code: string; active: boolean }>).detail;
      if ((detail.code === "KeyE" || detail.code === "Enter") && detail.active) {
        interact();
        return;
      }
      if (detail.code === "KeyR" && detail.active) {
        reset();
        return;
      }
      if (detail.active) keys.add(detail.code);
      else keys.delete(detail.code);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("portfolio-game-input", virtualInput);

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);

    camera.position.set(spawnX + 8, 9, spawnZ + 8);
    camera.lookAt(robot.position);

    const publishHud = () => {
      const hud: CampaignHud = {
        activeCase,
        nearbyEvidence,
        collectedEvidence: [...recovered],
        charge: Math.round(charge),
        message: message && elapsed <= messageUntil ? message : null,
      };
      const signature = JSON.stringify(hud);
      if (signature !== lastHud) {
        lastHud = signature;
        onHudChange(hud);
      }
    };

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previousFrame) / 1000, 1 / 30);
      previousFrame = now;
      elapsed += delta;
      worldAnimations.forEach((animateWorld) => animateWorld(elapsed));

      evidenceModels.forEach((model, index) => {
        if (!model.group.visible) return;
        model.beacon.visible = guidedRef.current;
        model.group.rotation.y = elapsed * 0.8 + index;
        model.group.position.y = 0.55 + Math.sin(elapsed * 2.2 + index) * 0.12;
        model.beacon.rotation.y = -elapsed * 0.6;
        model.beacon.position.y = 1.8 + Math.sin(elapsed * 2 + index) * 0.18;
      });

      if (!pausedRef.current) {
        const throttle = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown"));
        const steering = Number(keys.has("KeyA") || keys.has("ArrowLeft")) - Number(keys.has("KeyD") || keys.has("ArrowRight"));
        const wantsBoost = keys.has("ShiftLeft") || keys.has("ShiftRight");
        const has = (id: RobotPartId) => equipped.includes(id);
        const coffeeBoost = has("coffee-cell") && wantsBoost && charge > 0;
        const runners = has("runner-kit");
        const clampTorque = has("clamp-arms");
        const prediction = has("prediction-processor");
        const diagnostics = has("diagnostic-module");
        const maxSpeed = coffeeBoost ? 12.5 : runners ? 9.5 : 7.2;
        const acceleration = coffeeBoost ? 16 : runners ? 11 : clampTorque ? 10 : 8;
        if (throttle !== 0) speed += throttle * acceleration * delta;
        else speed = THREE.MathUtils.damp(speed, 0, runners ? 0.8 : 2.4, delta);
        speed = THREE.MathUtils.clamp(speed, -4, maxSpeed);
        if (coffeeBoost) charge = Math.max(0, charge - delta * 12);
        else charge = Math.min(100, charge + delta * 2.5);

        const steeringRate = runners ? 2.2 : prediction ? 1.9 : 1.55;
        heading += steering * delta * steeringRate * THREE.MathUtils.clamp(Math.abs(speed) / 3, 0.35, 1) * (speed >= 0 ? 1 : -1);
        robot.rotation.y = heading;
        const velocity = robotVelocity(speed, heading);
        let nextX = THREE.MathUtils.clamp(robot.position.x + velocity.x * delta, -DESK_X, DESK_X);
        let nextZ = THREE.MathUtils.clamp(robot.position.z + velocity.z * delta, -DESK_Z, DESK_Z);
        for (const obstacle of obstacles) {
          const result = resolveDeskObstacle(nextX, nextZ, obstacle, ROBOT_RADIUS);
          nextX = result.x;
          nextZ = result.z;
          if (result.collided) {
            speed *= diagnostics ? -0.05 : -0.18;
            bump = 1;
            eyeBlink = 1;
            if (soundRef.current && elapsed - lastBumpSound > 0.45) {
              littleMachineSound("bump");
              lastBumpSound = elapsed;
            }
            if (diagnostics) {
              message = "Diagnostics isolated the collision. No dramatic systems failure required.";
              messageUntil = elapsed + 2.8;
            }
          }
        }
        robot.position.x = nextX;
        robot.position.z = nextZ;

        if (!grounded) {
          verticalVelocity -= 12 * delta;
          robot.position.y += verticalVelocity * delta;
          if (robot.position.y <= 0) {
            robot.position.y = 0;
            grounded = true;
            verticalVelocity = 0;
            bump = 0.6;
          }
        }

        const treadMotion = speed * delta * 0.25;
        treads.forEach((tread, index) => {
          tread.position.z = Math.sin(elapsed * 18 + index) * Math.min(0.025, Math.abs(treadMotion));
        });
        base.rotation.x = THREE.MathUtils.damp(base.rotation.x, throttle * -0.035 + bump * 0.08, 8, delta);
        base.rotation.z = THREE.MathUtils.damp(base.rotation.z, steering * -0.055, 7, delta);
        bump = THREE.MathUtils.damp(bump, 0, 7, delta);

        nearbyEvidence = null;
        const evidenceSense = has("radio-antenna") ? 4.2 : has("sensory-scanner") ? 5.2 : 2.6;
        let nearestEvidence = evidenceSense;
        for (const model of evidenceModels) {
          if (!model.group.visible) continue;
          const distance = Math.hypot(robot.position.x - model.evidence.position[0], robot.position.z - model.evidence.position[1]);
          if (distance < nearestEvidence) {
            nearestEvidence = distance;
            nearbyEvidence = model.evidence;
          }
        }
      }

      const interest = nearbyEvidence
        ? new THREE.Vector3(nearbyEvidence.position[0], 0.5, nearbyEvidence.position[1])
        : null;
      const targetYaw = interest
        ? Math.atan2(interest.x - robot.position.x, interest.z - robot.position.z) - heading
        : -0.38 + Math.sin(elapsed * 0.42) * 0.11;
      headPivot.rotation.y = THREE.MathUtils.damp(headPivot.rotation.y, THREE.MathUtils.clamp(targetYaw, -0.65, 0.65), 4.5, delta);
      headPivot.rotation.z = Math.sin(elapsed * 0.7) * 0.018;
      neck.scale.y = 1 + Math.sin(elapsed * 1.3) * 0.025;
      if (Math.random() < delta * 0.18) eyeBlink = 1;
      eyeBlink = Math.max(0, eyeBlink - delta * 5);
      aperture.scale.y = Math.max(0.08, 1 - Math.sin(eyeBlink * Math.PI));
      if (equipped.includes("prediction-processor")) predictionOrb.rotation.y = elapsed * 1.7;
      if (equipped.includes("radio-antenna")) radioTip.position.y = 2.78 + Math.sin(elapsed * 4) * 0.06;

      const behind = heading + Math.PI + 0.52;
      const cameraDistance = guidedRef.current ? 8.2 : 7.4;
      targetCamera.set(
        robot.position.x + Math.sin(behind) * cameraDistance,
        robot.position.y + 6.2,
        robot.position.z + Math.cos(behind) * cameraDistance,
      );
      camera.position.lerp(targetCamera, 1 - Math.exp(-4.3 * delta));
      lookTarget.set(robot.position.x, robot.position.y + 1.15, robot.position.z);
      camera.lookAt(lookTarget);
      lamp.target.position.copy(robot.position);
      publishHud();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("portfolio-game-input", virtualInput);
      window.removeEventListener("resize", resize);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((entry) => {
          (entry as THREE.MeshStandardMaterial).map?.dispose();
          entry.dispose();
        });
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [activeCase, equipped, onHudChange, quality]);

  return <div ref={mountRef} className="lm-world" aria-label="A modular salvage robot exploring a giant desktop" />;
}
