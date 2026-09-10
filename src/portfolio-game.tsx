import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { PortfolioProject } from "./portfolio-data";
import type { ChapterId, Collider, GameHudState, Portal, RoomBuild, RoomProp, StoryStep } from "./game-types";
import {
  buildRoom,
  chapters,
  destinationChapters,
  disposeRoom,
  HUB_ID,
} from "./portfolio-world-builder";
import { HOMECOMING, recommendedOrder, roomStory } from "./portfolio-story";
import { moodFor } from "./portfolio-mood";
import { portfolioProjects } from "./portfolio-data";
import { setSfxEnabled, sfxBark, sfxBoing, sfxFocus, sfxFootstep, sfxInteract, sfxPortal, stopMusic, toggleMusic } from "./portfolio-audio";
import { createDogCompanion } from "./dog-companion";

export type { GameHudState } from "./game-types";

type PortfolioGameProps = {
  paused: boolean;
  sensitivity: number;
  invertY: boolean;
  showMarkers: boolean;
  sound: boolean;
  onHudChange: (state: GameHudState) => void;
  onOpenProject: (project: PortfolioProject) => void;
  onOpenMission: (mission: NonNullable<StoryStep["mission"]>, stepId: string) => void;
  onFinish: () => void;
};

const PLAYER_RADIUS = 0.42;
const FADE_OUT = 0.6;
const FADE_IN = 0.6;
// Any obstacle without an explicit surface height is still climbable at this
// default top, so you can hop onto furniture in every room — not just the bedroom.
const DEFAULT_PLATFORM_TOP = 0.85;

type SavedProgress = {
  completed: string[];
  rooms?: ChapterId[];
  awakened?: boolean;
};

const STORAGE_KEY = "josiah-portfolio-progress-v13";

/**
 * Push a player point out of any axis-aligned collider it has entered, resolving along the
 * shortest penetration axis. Colliders are inflated by the player radius (XZ only).
 */
export function pushOutOfColliders(
  x: number,
  z: number,
  colliders: Collider[],
  radius: number,
  feetY = 0,
): { x: number; z: number } {
  let nextX = x;
  let nextZ = z;
  for (const collider of colliders) {
    // If your feet have cleared this surface, you can stand on it — don't block.
    if (feetY >= (collider.top ?? DEFAULT_PLATFORM_TOP) - 0.05) continue;
    const minX = collider.minX - radius;
    const maxX = collider.maxX + radius;
    const minZ = collider.minZ - radius;
    const maxZ = collider.maxZ + radius;
    if (nextX <= minX || nextX >= maxX || nextZ <= minZ || nextZ >= maxZ) continue;
    const penLeft = nextX - minX;
    const penRight = maxX - nextX;
    const penBack = nextZ - minZ;
    const penFront = maxZ - nextZ;
    const minPen = Math.min(penLeft, penRight, penBack, penFront);
    if (minPen === penLeft) nextX = minX;
    else if (minPen === penRight) nextX = maxX;
    else if (minPen === penBack) nextZ = minZ;
    else nextZ = maxZ;
  }
  return { x: nextX, z: nextZ };
}

export function cameraRelativeVelocity(
  localX: number,
  localZ: number,
  yaw: number,
  speed: number,
) {
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  return {
    x: (localX * cos + localZ * sin) * speed,
    z: (-localX * sin + localZ * cos) * speed,
  };
}

function readProgress(): SavedProgress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as SavedProgress;
  } catch {
    return { completed: [] };
  }
}

function saveProgress(completed: Set<string>, rooms: Set<ChapterId>, awakened: boolean) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completed: [...completed],
    rooms: [...rooms],
    awakened,
  } satisfies SavedProgress));
}

function ownsObject(root: THREE.Object3D, target: THREE.Object3D) {
  let current: THREE.Object3D | null = target;
  while (current) {
    if (current === root) return true;
    current = current.parent;
  }
  return false;
}

export function PortfolioGame({
  paused,
  sensitivity,
  invertY,
  showMarkers,
  sound,
  onHudChange,
  onOpenProject,
  onOpenMission,
  onFinish,
}: PortfolioGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const sensitivityRef = useRef(sensitivity);
  const invertYRef = useRef(invertY);
  const showMarkersRef = useRef(showMarkers);

  useEffect(() => {
    setSfxEnabled(sound);
  }, [sound]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  useEffect(() => {
    invertYRef.current = invertY;
  }, [invertY]);

  useEffect(() => {
    showMarkersRef.current = showMarkers;
  }, [showMarkers]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(66, mount.clientWidth / mount.clientHeight, 0.08, 220);
    camera.rotation.order = "YXZ";
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    // Black overlay used for the room-to-room cinematic fade.
    const fade = document.createElement("div");
    fade.style.cssText =
      "position:absolute;inset:0;background:#050505;opacity:0;pointer-events:none;transition:none;z-index:2;";
    mount.appendChild(fade);

    // Connective narration shown over the fade as one room becomes the next (the "blend").
    const caption = document.createElement("div");
    caption.style.cssText =
      "position:absolute;left:50%;bottom:20%;transform:translateX(-50%);max-width:60ch;" +
      "padding:0 6vw;color:#fff9e9;font:500 clamp(16px,2.4vw,26px)/1.5 Georgia,serif;text-align:center;" +
      "opacity:0;pointer-events:none;z-index:3;text-shadow:0 2px 24px rgba(0,0,0,.85);";
    mount.appendChild(caption);

    // Global sky + key light, re-tuned per room by applyMood(); per-room accent lights live in each group.
    scene.background = new THREE.Color(0x1d1a24);
    scene.fog = new THREE.Fog(0x1d1a24, 11, 64);
    const hemisphere = new THREE.HemisphereLight(0xffe6c2, 0x2a211a, 0.55);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffd49a, 2.7);
    sun.position.set(-11, 13, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0006;
    const shadowCam = sun.shadow.camera as THREE.OrthographicCamera;
    shadowCam.left = -16;
    shadowCam.right = 16;
    shadowCam.top = 16;
    shadowCam.bottom = -16;
    shadowCam.near = 1;
    shadowCam.far = 64;
    scene.add(sun);
    scene.add(sun.target);

    // Cinematic atmosphere: a slow drift of dust motes catching the key light.
    // Lives on the scene (not the room) so it carries across rooms; animated by
    // a gentle rotation + bob in the loop rather than per-particle updates.
    const dustCount = 240;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 24;
      dustPositions[i * 3 + 1] = Math.random() * 5.4 + 0.3;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffe9c4,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.frustumCulled = false;
    scene.add(dust);

    const applyMood = (id: ChapterId) => {
      const mood = moodFor(id);
      (scene.background as THREE.Color).setHex(mood.background);
      if (scene.fog) {
        (scene.fog as THREE.Fog).color.setHex(mood.background);
        (scene.fog as THREE.Fog).near = mood.fog[0];
        (scene.fog as THREE.Fog).far = mood.fog[1];
      }
      hemisphere.color.setHex(mood.hemiSky);
      hemisphere.groundColor.setHex(mood.hemiGround);
      hemisphere.intensity = mood.hemiIntensity;
      sun.color.setHex(mood.keyColor);
      sun.intensity = mood.keyIntensity;
      sun.position.set(...mood.keyPosition);
      renderer.toneMappingExposure = mood.exposure;
    };

    const saved = readProgress();
    const completed = new Set(saved.completed ?? []);
    const completedRooms = new Set<ChapterId>(saved.rooms ?? []);
    const linkedChapterId = new URLSearchParams(window.location.search).get("chapter");
    const linkedChapter = chapters.find((chapter) => chapter.id === linkedChapterId);
    const debugCam = new URLSearchParams(window.location.search).get("cam"); // "plan" | "iso" layout views

    let currentRoom: ChapterId = linkedChapter ? linkedChapter.id : HUB_ID;
    let room: RoomBuild = buildRoom(scene, currentRoom, completedRooms);
    let bounds = room.bounds;
    camera.position.fromArray(room.entry);
    applyMood(currentRoom);

    // Pepper — the schnoodle companion. Trails you, hops when petted/fed, and
    // re-homes beside you whenever a new room loads.
    const dog = createDogCompanion(scene);
    dog.setHome(room.entry[0] + 0.9, room.entry[2] + 0.5);
    const GROUND_Y = 1.72;
    let jumpVel = 0;
    let airborne = false;

    const keys = new Set<string>();
    const velocity = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    let yaw = 0;
    let pitch = -0.05;
    let frame = 0;
    let focusedStep: StoryStep | null = null;
    let focusedPortal: Portal | null = null;
    let focusedProp: RoomProp | null = null;
    let carried: RoomProp | null = null;
    const propOn = new Map<string, boolean>();
    let lastHud = "";
    let detail: string | null = null;
    let bobPhase = 0;
    let lastFootstepIndex = 0;
    let lastFocusKey: string | null = null;
    let springObject: THREE.Object3D | null = null;
    let interactPulse: { object: THREE.Object3D; t: number } | null = null;
    let padInteractPrev = false;
    let activeVehicle: RoomProp | null = null;
    let vehicleSpeed = 0;

    // Toylike spring helpers: remember each interactable's resting scale so the
    // hover-wobble and use-pop can spring around it and snap cleanly back.
    const baseScaleOf = (object: THREE.Object3D): THREE.Vector3 => {
      const data = object.userData as { baseScale?: THREE.Vector3 };
      if (!data.baseScale) data.baseScale = object.scale.clone();
      return data.baseScale;
    };
    const restoreScale = (object: THREE.Object3D | null) => {
      if (object) object.scale.copy(baseScaleOf(object));
    };
    let transition: { phase: "out" | "in"; t: number; to: ChapterId } | null = null;
    let diveTarget: THREE.Vector3 | null = null;

    const openingSequence =
      currentRoom === HUB_ID && !linkedChapter && completed.size === 0 && !saved.awakened;
    let openingStartedAt: number | null = null;
    let openingComplete = !openingSequence || Boolean(debugCam);
    let wakePhase: GameHudState["wakePhase"] = openingSequence && !debugCam ? "sleeping" : "awake";

    const setWakePhase = (next: GameHudState["wakePhase"]) => {
      if (wakePhase === next) return;
      wakePhase = next;
      publishHud();
    };

    // Bruno-style instant play: any input during the wake cinematic drops you
    // straight into the room instead of waiting out the ~9s sequence.
    const skipOpening = () => {
      if (openingComplete) return;
      openingComplete = true;
      yaw = -0.12;
      pitch = -0.07;
      camera.position.fromArray(room.entry);
      camera.fov = 66;
      camera.updateProjectionMatrix();
      setWakePhase("awake");
      publishHud();
    };

    const resolveCollisions = () => {
      const feetY = camera.position.y - GROUND_Y;
      const resolved = pushOutOfColliders(camera.position.x, camera.position.z, room.colliders, PLAYER_RADIUS, feetY);
      camera.position.x = resolved.x;
      camera.position.z = resolved.z;
    };

    // The furniture surface you're currently standing over (highest one), so you
    // can jump up and walk around on top of anything.
    const topOf = (c: Collider) => c.top ?? DEFAULT_PLATFORM_TOP;
    const standingPlatform = (): Collider | null => {
      let best: Collider | null = null;
      for (const collider of room.colliders) {
        if (camera.position.x <= collider.minX || camera.position.x >= collider.maxX) continue;
        if (camera.position.z <= collider.minZ || camera.position.z >= collider.maxZ) continue;
        if (!best || topOf(collider) > topOf(best)) best = collider;
      }
      return best;
    };
    const canUsePortal = (portal: Portal) =>
      camera.position.y - GROUND_Y >= (portal.minFeetY ?? 0);

    const allRoomsComplete = () => destinationChapters.every((chapter) => completedRooms.has(chapter.id));

    const nextRecommendedRoom = (): ChapterId | undefined =>
      recommendedOrder.find((id) => !completedRooms.has(id));

    const roomTasksDone = () =>
      currentRoom !== HUB_ID && room.steps
        .filter((step) => !step.playsMusic && !step.optional)
        .every((step) => completed.has(step.id));

    const publishHud = () => {
      const mode: GameHudState["mode"] = currentRoom === HUB_ID ? "hub" : "room";
      const nextId = nextRecommendedRoom();
      const nextTitle = chapters.find((chapter) => chapter.id === nextId)?.title;
      const objective =
        mode === "hub"
          ? (allRoomsComplete()
            ? "Every memory explored. The bedroom remembers."
            : nextTitle ? `Next: ${nextTitle}` : "Choose a memory to step into")
          : (roomTasksDone() ? "Room complete — press Q for the bedroom (or keep exploring)" : "Interact with anything that glows — revisit it any time");
      const state: GameHudState = {
        // No "press E" prompt — interactions are a surprise. The only on-screen
        // cue is the gentle wobble of whatever you're looking at.
        prompt: null,
        room: room.title,
        objective,
        detail,
        completedSteps: room.steps.filter((step) => completed.has(step.id)).length,
        totalSteps: room.steps.length,
        chapterIndex: completedRooms.size,
        chapterCount: destinationChapters.length,
        locked: document.pointerLockElement !== renderer.domElement,
        wakePhase,
        mode,
        canReturn: mode === "room" && !transition,
        companionNear: openingComplete && !transition && dog.isNear(camera.position.x, camera.position.z),
      };
      const signature = JSON.stringify(state);
      if (signature !== lastHud) {
        lastHud = signature;
        onHudChange(state);
      }
    };

    const startTransition = (to: ChapterId, divePos: THREE.Vector3 | null = null) => {
      if (transition) return;
      sfxPortal();
      document.exitPointerLock?.();
      diveTarget = divePos ? divePos.clone() : null;
      // Climbing out into the open fades to warm daylight, not black — so it
      // reads as stepping outside rather than a teleport.
      fade.style.background = to === "rooftop" ? "#fbe6b0" : "#050505";
      caption.textContent =
        to === HUB_ID && allRoomsComplete() ? HOMECOMING : roomStory[to].arrival;
      transition = { phase: "out", t: 0, to };
      publishHud();
    };

    const handleTravel = (event: Event) => {
      const target = (event as CustomEvent<ChapterId>).detail;
      if (!chapters.some((chapter) => chapter.id === target) || target === currentRoom) return;
      startTransition(target);
    };
    window.addEventListener("portfolio-travel", handleTravel);

    const loadRoom = (to: ChapterId) => {
      stopMusic();
      springObject = null;
      interactPulse = null;
      disposeRoom(scene, room.group);
      room = buildRoom(scene, to, completedRooms);
      currentRoom = to;
      bounds = room.bounds;
      applyMood(to);
      camera.position.fromArray(room.entry);
      dog.setHome(room.entry[0] + 0.9, room.entry[2] + 0.5);
      jumpVel = 0;
      airborne = false;
      yaw = 0;
      pitch = -0.05;
      velocity.set(0, 0, 0);
      focusedStep = null;
      focusedPortal = null;
      focusedProp = null;
      carried = null;
      activeVehicle = null;
      vehicleSpeed = 0;
      propOn.clear();
      detail = null;
      camera.fov = 66;
      camera.updateProjectionMatrix();
      saveProgress(completed, completedRooms, openingComplete);
      if (to === HUB_ID && allRoomsComplete()) onFinish();
      publishHud();
    };

    const interact = () => {
      if (transition) return;
      if (activeVehicle) {
        const vehicle = activeVehicle.vehicle;
        if (vehicle) {
          const exit = new THREE.Vector3(1.4, 0, 0.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), vehicle.object.rotation.y);
          camera.position.set(
            THREE.MathUtils.clamp(vehicle.object.position.x + exit.x, bounds.minX, bounds.maxX),
            GROUND_Y,
            THREE.MathUtils.clamp(vehicle.object.position.z + exit.z, bounds.minZ, bounds.maxZ),
          );
        }
        activeVehicle = null;
        vehicleSpeed = 0;
        detail = "Parked. Press E near the car to get back in.";
        sfxInteract();
        publishHud();
        return;
      }
      // Carrying something? Set it down where you're looking.
      if (carried) {
        const fx = -Math.sin(yaw);
        const fz = -Math.cos(yaw);
        carried.object.position.set(
          THREE.MathUtils.clamp(camera.position.x + fx * 1.4, bounds.minX, bounds.maxX),
          0,
          THREE.MathUtils.clamp(camera.position.z + fz * 1.4, bounds.minZ, bounds.maxZ),
        );
        carried.object.rotation.set(0, yaw + Math.PI, 0);
        detail = "Set it down.";
        carried = null;
        sfxInteract();
        publishHud();
        return;
      }
      const pulseObject = focusedProp?.object ?? focusedPortal?.object ?? focusedStep?.object ?? null;
      if (pulseObject && !focusedProp?.quiet) interactPulse = { object: pulseObject, t: 0 };
      // Plain room props: grab / toggle / activate — no markers, just look + use.
      if (focusedProp) {
        const prop = focusedProp;
        sfxInteract();
        if (prop.vehicle) {
          activeVehicle = prop;
          vehicleSpeed = 0;
          carried = null;
          const vehicle = prop.vehicle.object;
          const forwardYaw = vehicle.rotation.y - Math.PI / 2;
          yaw = forwardYaw;
          pitch = -0.18;
          camera.position.set(vehicle.position.x, 2.15, vehicle.position.z);
          detail = "Driving. W/S gas and brake, A/D steer, E exits.";
        } else if (prop.grabbable) {
          carried = prop;
          detail = "Picked it up — walk somewhere and press E to set it down.";
        } else if (prop.toggle) {
          const next = !propOn.get(prop.id);
          propOn.set(prop.id, next);
          prop.toggle(next);
          detail = prop.detail ?? (next ? "On." : "Off.");
        } else {
          prop.activate?.();
          detail = prop.detail ?? prop.prompt;
        }
        publishHud();
        return;
      }
      if (focusedPortal) {
        if (!canUsePortal(focusedPortal)) {
          detail = "You need to climb up to it first.";
          publishHud();
          return;
        }
        startTransition(focusedPortal.target, focusedPortal.position);
        return;
      }
      if (!focusedStep) return;
      const step = focusedStep;
      sfxInteract();
      if (step.mission) {
        document.exitPointerLock?.();
        onOpenMission(step.mission, step.id);
        return;
      }
      // Hidden minigames — replayable.
      if (step.minigame) {
        step.activate?.();
        window.dispatchEvent(new CustomEvent("portfolio-minigame", { detail: step.minigame }));
        return;
      }
      // Music — a replayable toggle; each start cues a different record.
      if (step.playsMusic) {
        step.activate?.();
        const on = toggleMusic();
        detail = on ? "Now playing — drop the needle again for another record." : "Music off.";
        publishHud();
        return;
      }
      // Everything is replayable: re-run the effect every time you interact.
      step.activate?.();
      if (step.link) window.open(step.link, "_blank", "noopener");
      if (step.dossier) {
        const project = portfolioProjects.find((item) => item.id === step.dossier);
        if (project) onOpenProject(project);
      }
      detail = `${step.title}. ${step.detail}`;
      // The first interaction counts toward progress; the room is "complete" but you can stay.
      if (!completed.has(step.id)) {
        completed.add(step.id);
        window.dispatchEvent(new CustomEvent("portfolio-step-complete", {
          detail: { missionId: step.id, choice: `completed-${step.id}` },
        }));
        saveProgress(completed, completedRooms, true);
        if (roomTasksDone() && !completedRooms.has(currentRoom)) {
          completedRooms.add(currentRoom);
          saveProgress(completed, completedRooms, true);
          detail = `${roomStory[currentRoom].lesson}  ·  Press Q to return to the bedroom.`;
        }
      }
      publishHud();
    };

    const handleMissionComplete = (event: Event) => {
      const { stepId, choice, evidenceIds } = (event as CustomEvent<{
        stepId: string;
        choice: string;
        evidenceIds?: string[];
      }>).detail;
      const step = room.steps.find((item) => item.id === stepId);
      if (!step || completed.has(step.id)) return;
      step.activate?.();
      completed.add(step.id);
      window.dispatchEvent(new CustomEvent("portfolio-step-complete", {
        detail: { missionId: step.id, choice, evidenceIds },
      }));
      saveProgress(completed, completedRooms, true);
      detail = `${step.title}. ${step.detail}`;
      if (roomTasksDone() && !completedRooms.has(currentRoom)) {
        completedRooms.add(currentRoom);
        saveProgress(completed, completedRooms, true);
        detail = `${roomStory[currentRoom].lesson}  ·  Press Q to return to the bedroom.`;
      }
      publishHud();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== renderer.domElement || pausedRef.current || !openingComplete || transition) return;
      yaw -= event.movementX * 0.0018 * sensitivityRef.current;
      pitch -= event.movementY * 0.00155 * sensitivityRef.current * (invertYRef.current ? -1 : 1);
      pitch = THREE.MathUtils.clamp(pitch, -1.22, 1.22);
    };
    const petDog = () => {
      if (!dog.isNear(camera.position.x, camera.position.z)) return;
      dog.pet();
      sfxBark();
    };

    const treatDog = () => {
      // Toss a treat a couple of metres ahead of where you're looking.
      const fx = -Math.sin(yaw);
      const fz = -Math.cos(yaw);
      const dropX = THREE.MathUtils.clamp(camera.position.x + fx * 2.2, bounds.minX, bounds.maxX);
      const dropZ = THREE.MathUtils.clamp(camera.position.z + fz * 2.2, bounds.minZ, bounds.maxZ);
      dog.feed(dropX, dropZ);
      sfxBark();
    };

    const playerJump = () => {
      if (airborne || !openingComplete || transition || activeVehicle) return;
      airborne = true;
      // A higher jump so you can clear furniture and stand on top of things;
      // jumping off the bed still launches you sky-high.
      const onBed = standingPlatform()?.bounce ?? false;
      jumpVel = onBed ? 9.8 : 6.0;
      if (onBed) sfxBoing();
      // The pup hops with you when he's close.
      if (dog.isNear(camera.position.x, camera.position.z)) dog.pet();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (pausedRef.current || document.hidden) return;
      if (!openingComplete && event.code !== "Escape") {
        skipOpening();
        return;
      }
      if (event.code === "Space") event.preventDefault();
      keys.add(event.code);
      if (event.code === "KeyE") interact();
      if (event.code === "KeyF") petDog();
      if (event.code === "KeyT") treatDog();
      if (event.code === "Space") playerJump();
      if (event.code === "KeyQ" && currentRoom !== HUB_ID) startTransition(HUB_ID);
    };
    const handleKeyUp = (event: KeyboardEvent) => keys.delete(event.code);
    const handleVirtualInput = (event: Event) => {
      const custom = event as CustomEvent<{ code: string; active: boolean }>;
      if (pausedRef.current && custom.detail.active) return;
      if (custom.detail.code === "KeyE" && custom.detail.active) {
        interact();
        return;
      }
      if (custom.detail.code === "KeyQ" && custom.detail.active) {
        if (currentRoom !== HUB_ID) startTransition(HUB_ID);
        return;
      }
      if (custom.detail.active) keys.add(custom.detail.code);
      else keys.delete(custom.detail.code);
    };
    const handleCanvasClick = () => {
      if (!pausedRef.current && !openingComplete) {
        skipOpening();
        return;
      }
      if (!pausedRef.current && openingComplete && !transition) renderer.domElement.requestPointerLock?.();
    };
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const capturePostcard = () => {
      try {
        renderer.render(scene, camera);
        window.dispatchEvent(new CustomEvent("portfolio-postcard-ready", { detail: renderer.domElement.toDataURL("image/png") }));
      } catch {
        window.dispatchEvent(new CustomEvent("portfolio-postcard-ready", { detail: null }));
      }
    };
    const clearInput = () => keys.clear();
    window.addEventListener("portfolio-take-postcard", capturePostcard);
    window.addEventListener("blur", clearInput);
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("portfolio-game-input", handleVirtualInput);
    window.addEventListener("portfolio-mission-complete", handleMissionComplete);
    window.addEventListener("resize", handleResize);
    renderer.domElement.addEventListener("click", handleCanvasClick);

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 1 / 30);
      const elapsed = clock.elapsedTime;
      if (document.hidden) { keys.clear(); return; }
      if (pausedRef.current) keys.clear();

      // Layout-review cameras (?cam=plan top-down, ?cam=iso angled) — temporary
      // interior-design aid; renders the room from a fixed overview and stops here.
      if (debugCam) {
        const cz = room.entry[2] - 4.2;
        dog.group.visible = false;
        // Lift the roof off for the top-down blueprint.
        scene.traverse((node) => {
          if (node.userData.debugHide) node.visible = debugCam !== "plan";
        });
        if (debugCam === "plan") {
          camera.up.set(0, 0, -1);
          camera.position.set(0, 21, cz);
          camera.lookAt(0, 0, cz);
        } else {
          camera.up.set(0, 1, 0);
          camera.position.set(0, 15, cz + 12);
          camera.lookAt(0, 1, cz - 1);
        }
        camera.updateProjectionMatrix();
        room.animated.forEach((update) => update(elapsed, delta));
        renderer.render(scene, camera);
        return;
      }

      // The cinematic fade freezes input while one room is swapped for the next.
      if (transition) {
        transition.t += delta;
        if (transition.phase === "out") {
          const k = Math.min(1, transition.t / FADE_OUT);
          fade.style.opacity = String(k);
          caption.style.opacity = String(k);
          // Lean the camera toward the portal so it feels like stepping through it.
          if (diveTarget) {
            camera.position.lerp(diveTarget, Math.min(1, delta * 2.4));
            camera.lookAt(diveTarget.x, camera.position.y, diveTarget.z);
          }
          if (transition.t >= FADE_OUT) {
            const to = transition.to;
            loadRoom(to);
            transition = { phase: "in", t: 0, to };
          }
        } else {
          const k = Math.max(0, 1 - transition.t / FADE_IN);
          fade.style.opacity = String(k);
          caption.style.opacity = String(k);
          if (transition.t >= FADE_IN) {
            transition = null;
            diveTarget = null;
            fade.style.opacity = "0";
            caption.style.opacity = "0";
            caption.textContent = "";
            publishHud();
          }
        }
        renderer.render(scene, camera);
        return;
      }

      room.animated.forEach((update) => update(elapsed, delta));

      // Drift the dust so it shimmers through the light.
      dust.rotation.y = elapsed * 0.015;
      dust.position.y = Math.sin(elapsed * 0.18) * 0.25;

      // The companion only joins once you're up and about.
      dog.group.visible = openingComplete;
      if (openingComplete) {
        dog.update(delta, elapsed, {
          x: camera.position.x,
          z: camera.position.z,
          moving: Math.hypot(velocity.x, velocity.z) > 0.4,
        });
      }

      if (!pausedRef.current && !openingComplete) {
        if (openingStartedAt === null) openingStartedAt = elapsed;
        const t = elapsed - openingStartedAt;
        const ease = (value: number) => {
          const clamped = THREE.MathUtils.clamp(value, 0, 1);
          return clamped * clamped * (3 - 2 * clamped);
        };
        if (t < 2.4) {
          setWakePhase("sleeping");
          camera.position.set(4.65, 1.74 + Math.sin(t * 1.8) * 0.012, 6.45);
          camera.rotation.set(-0.02, 0.04, -1.42 + Math.sin(t * 0.7) * 0.015);
        } else if (t < 4.9) {
          setWakePhase("stirring");
          const p = ease((t - 2.4) / 2.5);
          camera.position.set(
            THREE.MathUtils.lerp(4.65, 4.55, p),
            THREE.MathUtils.lerp(1.74, 1.96, p),
            THREE.MathUtils.lerp(6.45, 6.05, p),
          );
          camera.rotation.set(
            THREE.MathUtils.lerp(-0.02, -0.12, p),
            THREE.MathUtils.lerp(0.04, -0.16, p),
            THREE.MathUtils.lerp(-1.42, -0.28, p),
          );
        } else if (t < 7.4) {
          setWakePhase("sitting");
          const p = ease((t - 4.9) / 2.5);
          camera.position.set(
            THREE.MathUtils.lerp(4.55, 4.15, p),
            THREE.MathUtils.lerp(1.96, 2.08, p),
            THREE.MathUtils.lerp(6.05, 5.2, p),
          );
          camera.rotation.set(
            THREE.MathUtils.lerp(-0.12, -0.08, p),
            THREE.MathUtils.lerp(-0.16, -0.38, p),
            THREE.MathUtils.lerp(-0.28, 0, p),
          );
        } else if (t < 9.2) {
          setWakePhase("standing");
          const p = ease((t - 7.4) / 1.8);
          camera.position.set(
            THREE.MathUtils.lerp(4.15, 1.6, p),
            THREE.MathUtils.lerp(2.08, 1.72, p),
            THREE.MathUtils.lerp(5.1, 4.75, p),
          );
          camera.rotation.set(-0.07, THREE.MathUtils.lerp(-0.38, -0.12, p), 0);
        } else {
          openingComplete = true;
          yaw = -0.12;
          pitch = -0.07;
          camera.position.fromArray(room.entry);
          setWakePhase("awake");
        }
      } else if (!pausedRef.current) {
        // Optional gamepad: left stick moves, right stick looks, A interacts, LB/L3 runs, B returns.
        let padX = 0;
        let padZ = 0;
        let padRun = false;
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const pad = pads ? Array.from(pads).find((entry) => entry) : undefined;
        if (pad) {
          const deadzone = (value: number) => (Math.abs(value) > 0.18 ? value : 0);
          padX = deadzone(pad.axes[0] ?? 0);
          padZ = deadzone(pad.axes[1] ?? 0);
          yaw -= deadzone(pad.axes[2] ?? 0) * 0.04 * sensitivityRef.current;
          pitch -= deadzone(pad.axes[3] ?? 0) * 0.032 * sensitivityRef.current * (invertYRef.current ? -1 : 1);
          pitch = THREE.MathUtils.clamp(pitch, -1.22, 1.22);
          padRun = Boolean(pad.buttons[10]?.pressed || pad.buttons[6]?.pressed);
          const padInteract = Boolean(pad.buttons[0]?.pressed);
          if (padInteract && !padInteractPrev) interact();
          if (Boolean(pad.buttons[1]?.pressed) && currentRoom !== HUB_ID) startTransition(HUB_ID);
          padInteractPrev = padInteract;
        } else {
          padInteractPrev = false;
        }

        if (activeVehicle?.vehicle) {
          const vehicle = activeVehicle.vehicle.object;
          const throttle =
            Number(keys.has("KeyW") || keys.has("ArrowUp")) -
            Number(keys.has("KeyS") || keys.has("ArrowDown")) -
            padZ;
          const steer =
            Number(keys.has("KeyA") || keys.has("ArrowLeft")) -
            Number(keys.has("KeyD") || keys.has("ArrowRight")) -
            padX;
          const targetSpeed = THREE.MathUtils.clamp(throttle, -1, 1) * 6.2;
          vehicleSpeed = THREE.MathUtils.damp(vehicleSpeed, targetSpeed, throttle ? 2.8 : 1.8, delta);
          vehicle.rotation.y += steer * delta * (0.65 + Math.min(Math.abs(vehicleSpeed), 4.2) * 0.16) * Math.sign(vehicleSpeed || 1);
          const forward = new THREE.Vector3(
            -Math.sin(vehicle.rotation.y - Math.PI / 2),
            0,
            -Math.cos(vehicle.rotation.y - Math.PI / 2),
          );
          vehicle.position.x = THREE.MathUtils.clamp(vehicle.position.x + forward.x * vehicleSpeed * delta, bounds.minX + 1.6, bounds.maxX - 1.6);
          vehicle.position.z = THREE.MathUtils.clamp(vehicle.position.z + forward.z * vehicleSpeed * delta, bounds.minZ + 1.6, bounds.maxZ - 1.6);
          activeVehicle.position.copy(vehicle.position).add(new THREE.Vector3(0, 0.8, 0));
          activeVehicle.vehicle.wheels?.forEach((wheel) => {
            wheel.rotation.z -= vehicleSpeed * delta * 2.8;
          });
          const exhaust = activeVehicle.vehicle.exhaust;
          if (exhaust instanceof THREE.Mesh) {
            const mat = exhaust.material;
            if (mat instanceof THREE.MeshBasicMaterial) {
              mat.opacity = Math.min(0.45, Math.abs(vehicleSpeed) * 0.06);
            }
            exhaust.scale.setScalar(1 + Math.abs(vehicleSpeed) * 0.05);
          }
          const offset = (activeVehicle.vehicle.cameraOffset ?? new THREE.Vector3(0, 1.65, 3.6)).clone();
          offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), vehicle.rotation.y);
          camera.position.set(vehicle.position.x + offset.x, vehicle.position.y + offset.y, vehicle.position.z + offset.z);
          yaw = vehicle.rotation.y - Math.PI / 2;
          pitch = THREE.MathUtils.damp(pitch, -0.2, 5, delta);
          camera.rotation.set(pitch, yaw, 0);
          velocity.set(0, 0, 0);
          airborne = false;
          jumpVel = 0;
        } else {
        // Idle "breathing": a barely-there sway that gives the camera life when
        // you stop, and fades out as you pick up speed.
        const idleSway = THREE.MathUtils.clamp(1 - Math.hypot(velocity.x, velocity.z) / 2, 0, 1);
        camera.rotation.set(
          pitch + Math.sin(elapsed * 0.9) * 0.005 * idleSway,
          yaw + Math.cos(elapsed * 0.65) * 0.005 * idleSway,
          0,
        );
        const localX = THREE.MathUtils.clamp(Number(keys.has("KeyD")) - Number(keys.has("KeyA")) + padX, -1, 1);
        const localZ = THREE.MathUtils.clamp(Number(keys.has("KeyS")) - Number(keys.has("KeyW")) + padZ, -1, 1);
        const magnitude = Math.hypot(localX, localZ) || 1;
        const running = keys.has("ShiftLeft") || keys.has("ShiftRight") || padRun;
        const moving = Math.abs(localX) > 0.001 || Math.abs(localZ) > 0.001;
        const target = cameraRelativeVelocity(
          localX / magnitude,
          localZ / magnitude,
          yaw,
          moving ? (running ? 5.8 : 3.7) : 0,
        );
        // Quick to accelerate, softer to coast to a stop.
        const responsiveness = moving ? 16 : 9;
        velocity.x = THREE.MathUtils.damp(velocity.x, target.x, responsiveness, delta);
        velocity.z = THREE.MathUtils.damp(velocity.z, target.z, responsiveness, delta);
        camera.position.x += velocity.x * delta;
        camera.position.z += velocity.z * delta;
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.minZ, bounds.maxZ);
        resolveCollisions();
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.minZ, bounds.maxZ);

        // Subtle footstep impulse rather than a constant head-bob.
        if (moving) {
          bobPhase += delta * (running ? 13 : 9);
          // A footfall lands at each half-cycle of the bob — cue a step sound.
          const footstepIndex = Math.floor(bobPhase / Math.PI);
          if (footstepIndex !== lastFootstepIndex) {
            lastFootstepIndex = footstepIndex;
            sfxFootstep();
          }
        }
        // Stand on whatever furniture is under you; the bed bounces.
        const platform = standingPlatform();
        const groundHere = GROUND_Y + (platform ? topOf(platform) : 0);
        if (airborne) {
          // Ballistic hop: integrate gravity until we land back at standing height.
          jumpVel -= 15 * delta;
          camera.position.y += jumpVel * delta;
          if (camera.position.y <= groundHere) {
            camera.position.y = groundHere;
            const impact = -jumpVel;
            // Trampoline: landing on the bed re-launches you, decaying each bounce.
            if (platform?.bounce && impact > 2.6) {
              jumpVel = Math.min(impact * 0.82, 13);
              sfxBoing();
            } else {
              airborne = false;
              jumpVel = 0;
            }
          }
        } else {
          const bobAmount = moving ? (running ? 0.022 : 0.015) : 0;
          const targetY = groundHere + Math.abs(Math.sin(bobPhase)) * bobAmount;
          camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 14, delta);
        }

        // Widen the field of view slightly while running.
        const targetFov = running && moving ? 72 : 66;
        if (Math.abs(camera.fov - targetFov) > 0.01) {
          camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, delta);
          camera.updateProjectionMatrix();
        }
        }
      } else {
        if (openingComplete) camera.rotation.set(pitch, yaw, 0);
        velocity.multiplyScalar(0.8);
      }

      // Focus: crosshair aim first, then proximity, across both steps and portals.
      // Every step stays interactable, so completed ones remain focus targets.
      raycaster.setFromCamera(center, camera);
      const availableSteps = activeVehicle ? [] : room.steps;
      const availableProps = activeVehicle ? [] : room.props.filter((prop) => prop !== carried);
      const availablePortals = activeVehicle ? [] : room.portals.filter(canUsePortal);
      const targets: THREE.Object3D[] = [
        ...availableSteps.map((step) => step.object),
        ...availablePortals.map((portal) => portal.object),
        ...availableProps.map((prop) => prop.object),
      ];
      const intersections = raycaster.intersectObjects(targets, true);
      const nearest = intersections.find((hit) => hit.distance < 3.8);
      focusedStep = null;
      focusedPortal = null;
      focusedProp = null;
      if (nearest) {
        focusedStep = availableSteps.find((step) => ownsObject(step.object, nearest.object)) ?? null;
        if (!focusedStep) {
          focusedPortal = availablePortals.find((portal) => ownsObject(portal.object, nearest.object)) ?? null;
        }
        if (!focusedStep && !focusedPortal) {
          focusedProp = availableProps.find((prop) => ownsObject(prop.object, nearest.object)) ?? null;
        }
      }
      if (!focusedStep && !focusedPortal && !focusedProp) {
        let bestDistance = 3.2;
        for (const step of availableSteps) {
          const distance = Math.hypot(step.position.x - camera.position.x, step.position.z - camera.position.z);
          if (distance < bestDistance) {
            bestDistance = distance;
            focusedStep = step;
            focusedPortal = null;
            focusedProp = null;
          }
        }
        for (const portal of availablePortals) {
          const distance = Math.hypot(portal.position.x - camera.position.x, portal.position.z - camera.position.z);
          if (distance < bestDistance) {
            bestDistance = distance;
            focusedPortal = portal;
            focusedStep = null;
            focusedProp = null;
          }
        }
        for (const prop of availableProps) {
          const distance = Math.hypot(prop.position.x - camera.position.x, prop.position.z - camera.position.z);
          if (distance < bestDistance) {
            bestDistance = distance;
            focusedProp = prop;
            focusedStep = null;
            focusedPortal = null;
          }
        }
      }

      // A soft tick when a new interactable becomes the focus — tactile feedback
      // that you've lined something up, without nagging while you hold on it.
      const focusKey = focusedStep ? `s:${focusedStep.id}` : focusedPortal ? `p:${focusedPortal.id}` : focusedProp ? `r:${focusedProp.id}` : null;
      if (focusKey !== lastFocusKey) {
        lastFocusKey = focusKey;
        if (focusKey && openingComplete && !transition) sfxFocus();
      }

      // Carry the held prop in front of the camera, bobbing slightly as you walk.
      if (carried) {
        const fx = -Math.sin(yaw);
        const fz = -Math.cos(yaw);
        carried.object.position.set(
          camera.position.x + fx * 1.25,
          1.05 + Math.sin(elapsed * 6) * 0.03,
          camera.position.z + fz * 1.25,
        );
        carried.object.rotation.set(0.2, yaw + Math.PI, 0.35);
      }

      // Toylike springs: the object under your reticle gives a gentle hover-wobble,
      // and a satisfying squash-stretch pop the moment you use it.
      const focusObject = focusedStep?.object ?? focusedPortal?.object ?? focusedProp?.object ?? null;
      if (focusObject !== springObject) {
        if (springObject && springObject !== interactPulse?.object) restoreScale(springObject);
        springObject = focusObject;
      }
      if (interactPulse) {
        interactPulse.t += delta;
        const k = interactPulse.t / 0.4;
        if (k >= 1) {
          restoreScale(interactPulse.object);
          interactPulse = null;
        } else {
          const base = baseScaleOf(interactPulse.object);
          const swell = Math.sin(k * Math.PI);
          interactPulse.object.scale.set(base.x * (1 + swell * 0.26), base.y * (1 - swell * 0.12), base.z * (1 + swell * 0.26));
        }
      }
      if (focusObject && focusObject !== interactPulse?.object && !focusedProp?.quiet) {
        const base = baseScaleOf(focusObject);
        const wobble = 1.04 + Math.sin(elapsed * 7) * 0.035;
        focusObject.scale.set(base.x * wobble, base.y * wobble, base.z * wobble);
      }

      // No floating interaction markers: every object reacts on its own when you
      // look at it (the focus wobble above), so the cues stay hidden.
      for (const step of room.steps) if (step.cue) step.cue.visible = false;
      for (const portal of room.portals) if (portal.cue) portal.cue.visible = false;

      publishHud();
      renderer.render(scene, camera);
    };
    if (debugCam) publishHud();
    animate();

    const autosave = window.setInterval(() => saveProgress(completed, completedRooms, openingComplete), 4000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(autosave);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("portfolio-take-postcard", capturePostcard);
      window.removeEventListener("blur", clearInput);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("portfolio-game-input", handleVirtualInput);
      window.removeEventListener("portfolio-travel", handleTravel);
      window.removeEventListener("portfolio-mission-complete", handleMissionComplete);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      stopMusic();
      disposeRoom(scene, room.group);
      dog.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      mount.removeChild(caption);
      mount.removeChild(fade);
      mount.removeChild(renderer.domElement);
    };
  }, [onFinish, onHudChange, onOpenMission, onOpenProject]);

  return <div ref={mountRef} className="pq-game-canvas" aria-label="Playable three-dimensional portfolio" />;
}
