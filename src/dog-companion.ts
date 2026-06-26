import * as THREE from "three";
import { box, colors, material } from "./game-kit";

/**
 * "Pablo" — a small low-poly schnauzer × poodle (schnoodle) companion with a
 * golden/apricot coat, schnauzer beard + eyebrows, floppy poodle ears, a curly
 * topknot, and a waggy docked tail. He trails the player room to room (keeping
 * his distance so he's not underfoot), trots when you move, idles/sits when you
 * stop, hops when petted, and chases a tossed treat.
 */
export interface DogCompanion {
  group: THREE.Group;
  /** Advance follow + animation. `moving` widens the gait and speeds the trot. */
  update(dt: number, elapsed: number, target: { x: number; z: number; moving: boolean }): void;
  /** Snap the dog near a point (used when a new room loads). */
  setHome(x: number, z: number): void;
  /** Is the player within petting/treat range of the dog? */
  isNear(x: number, z: number): boolean;
  /** Happy reaction: fast wag + a hop. */
  pet(): void;
  /** Toss a treat to (x,z); the dog trots over, eats it, and hops. */
  feed(x: number, z: number): void;
  dispose(): void;
}

const COAT = 0xcf9f56;      // golden / apricot body
const COAT_DARK = 0xa9783c; // ears + saddle (deeper gold)
const FUR_LIGHT = 0xf0dca6; // blonde beard, eyebrows, topknot, paws
const NOSE = colors.ink;

const FOLLOW_GAP = 2.7;     // resting distance the dog keeps behind you (stays out of the way)
const NEAR_RANGE = 2.4;     // pet / treat reach
const RUN_SPEED = 4.8;      // dog top speed (keeps up after trailing further)

function legPivot(parent: THREE.Object3D, x: number, z: number): THREE.Group {
  const pivot = new THREE.Group();
  pivot.position.set(x, 0.34, z);
  parent.add(pivot);
  // leg hangs down from the hip pivot so rotation.x swings it like a stride
  box(pivot, [0.13, 0.34, 0.13], [0, -0.17, 0], COAT);
  box(pivot, [0.15, 0.08, 0.16], [0, -0.32, 0.01], FUR_LIGHT); // paw
  return pivot;
}

export function createDogCompanion(parent: THREE.Object3D): DogCompanion {
  const group = new THREE.Group();
  group.castShadow = true;
  group.scale.setScalar(0.78); // a little dog

  // Body — a stocky little frame with a darker saddle and a curly poodle chest.
  const body = new THREE.Group();
  group.add(body);
  box(body, [0.52, 0.42, 0.98], [0, 0.58, 0], COAT, { roughness: 0.8 });
  box(body, [0.54, 0.2, 0.6], [0, 0.74, -0.05], COAT_DARK, { roughness: 0.85 }); // saddle
  box(body, [0.5, 0.42, 0.32], [0, 0.55, 0.5], FUR_LIGHT, { roughness: 0.95 });  // curly chest

  // Head — boxy schnauzer muzzle with beard, eyebrows, topknot, and a black nose.
  const head = new THREE.Group();
  head.position.set(0, 0.86, 0.62);
  body.add(head);
  box(head, [0.4, 0.4, 0.4], [0, 0, 0], COAT, { roughness: 0.8 });
  box(head, [0.34, 0.16, 0.26], [0, 0.26, 0.02], FUR_LIGHT, { roughness: 1 }); // topknot
  box(head, [0.26, 0.2, 0.26], [0, -0.06, 0.26], COAT);                        // muzzle
  box(head, [0.3, 0.18, 0.18], [0, -0.16, 0.32], FUR_LIGHT, { roughness: 1 }); // beard
  box(head, [0.09, 0.05, 0.04], [-0.1, 0.12, 0.2], FUR_LIGHT);                 // eyebrow L
  box(head, [0.09, 0.05, 0.04], [0.1, 0.12, 0.2], FUR_LIGHT);                  // eyebrow R
  box(head, [0.05, 0.05, 0.04], [-0.1, 0.04, 0.21], NOSE);                     // eye L
  box(head, [0.05, 0.05, 0.04], [0.1, 0.04, 0.21], NOSE);                      // eye R
  box(head, [0.1, 0.08, 0.08], [0, -0.04, 0.4], NOSE);                         // nose

  // Floppy poodle ears on pivots so they can sway.
  const earL = new THREE.Group();
  earL.position.set(-0.21, 0.1, 0.02);
  head.add(earL);
  box(earL, [0.08, 0.32, 0.2], [-0.02, -0.16, 0], COAT_DARK, { roughness: 1 });
  const earR = new THREE.Group();
  earR.position.set(0.21, 0.1, 0.02);
  head.add(earR);
  box(earR, [0.08, 0.32, 0.2], [0.02, -0.16, 0], COAT_DARK, { roughness: 1 });

  // Docked, perky tail on a pivot for the wag.
  const tail = new THREE.Group();
  tail.position.set(0, 0.8, -0.5);
  body.add(tail);
  box(tail, [0.1, 0.26, 0.1], [0, 0.1, -0.04], COAT_DARK);

  // Legs.
  const legFL = legPivot(body, -0.18, 0.34);
  const legFR = legPivot(body, 0.18, 0.34);
  const legBL = legPivot(body, -0.18, -0.34);
  const legBR = legPivot(body, 0.18, -0.34);

  parent.add(group);

  // Treat (a little bone), created lazily.
  let treat: THREE.Mesh | null = null;
  const treatPos = new THREE.Vector2();

  // State.
  let posX = 0;
  let posZ = 0;
  let yaw = 0;
  let speed = 0;          // smoothed planar speed, drives the gait
  let hopClock = 0;       // advances while mid-hop
  let hopLaunch = 0;      // launch height; >0 means a hop is in progress
  let happy = 0;          // >0 = excited wag/bounce window
  let idle = 0;           // seconds standing still (drives the sit)
  let eating = 0;         // >0 while head-down on a treat
  let mode: "follow" | "treat" = "follow";

  const startHop = (height = 0.5) => { if (hopLaunch <= 0) { hopLaunch = height; hopClock = 0; } };

  const removeTreat = () => {
    if (treat) {
      group.parent?.remove(treat);
      treat.geometry.dispose();
      (treat.material as THREE.Material).dispose();
      treat = null;
    }
  };

  return {
    group,

    setHome(x, z) {
      posX = x;
      posZ = z;
      group.position.set(x, 0, z);
      mode = "follow";
      removeTreat();
    },

    isNear(x, z) {
      return Math.hypot(posX - x, posZ - z) <= NEAR_RANGE;
    },

    pet() {
      happy = 1.6;
      startHop(0.62);
    },

    feed(x, z) {
      removeTreat();
      treat = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.32), material(FUR_LIGHT, { roughness: 1 }));
      treat.position.set(x, 0.12, z);
      group.parent?.add(treat);
      treatPos.set(x, z);
      mode = "treat";
    },

    update(dt, elapsed, target) {
      // ── Steering ──────────────────────────────────────────────────────────
      const goalX = mode === "treat" ? treatPos.x : target.x;
      const goalZ = mode === "treat" ? treatPos.y : target.z;
      const dx = goalX - posX;
      const dz = goalZ - posZ;
      const dist = Math.hypot(dx, dz);
      const stopGap = mode === "treat" ? 0.35 : FOLLOW_GAP;

      let stepSpeed = 0;
      if (dist > stopGap && eating <= 0) {
        const drive = Math.min(1, (dist - stopGap) / 1.4);
        stepSpeed = RUN_SPEED * drive;
        const nx = dx / dist;
        const nz = dz / dist;
        posX += nx * stepSpeed * dt;
        posZ += nz * stepSpeed * dt;
        const targetYaw = Math.atan2(nx, nz);
        // shortest-arc turn
        let delta = ((targetYaw - yaw + Math.PI) % (Math.PI * 2)) - Math.PI;
        yaw += delta * Math.min(1, dt * 9);
      } else if (mode === "treat") {
        // Reached the treat — eat it, then celebrate.
        if (eating <= 0 && treat) {
          eating = 0.7;
          startHop(0.45);
          happy = 1.4;
        }
      }
      speed = THREE.MathUtils.damp(speed, stepSpeed, 10, dt);

      if (eating > 0) {
        eating -= dt;
        if (eating <= 0) {
          removeTreat();
          mode = "follow";
        }
      }
      idle = stepSpeed < 0.2 && eating <= 0 ? idle + dt : 0;
      if (happy > 0) happy -= dt;

      group.position.set(posX, 0, posZ);
      group.rotation.y = yaw;

      // ── Hop arc + squash-stretch ─────────────────────────────────────────
      let hopY = 0;
      let squash = 1;
      if (hopLaunch > 0) {
        hopClock += dt;
        const k = hopClock / 0.5;
        if (k >= 1) {
          hopLaunch = 0;
          hopClock = 0;
        } else {
          hopY = Math.sin(k * Math.PI) * hopLaunch;
          squash = 1 - Math.sin(k * Math.PI) * 0.12;
        }
      }
      group.position.y = hopY;
      body.scale.set(1 + (1 - squash) * 0.6, squash, 1 + (1 - squash) * 0.6);

      // ── Gait + idle life ─────────────────────────────────────────────────
      const trot = Math.sin(elapsed * (8 + speed * 1.6));
      const stride = THREE.MathUtils.clamp(speed / RUN_SPEED, 0, 1) * 0.7;
      legFL.rotation.x = trot * stride;
      legBR.rotation.x = trot * stride;
      legFR.rotation.x = -trot * stride;
      legBL.rotation.x = -trot * stride;

      const sitting = idle > 3 && mode === "follow";
      const sit = THREE.MathUtils.damp(body.position.y, sitting ? -0.12 : 0, 8, dt);
      body.position.y = sit;
      body.rotation.x = THREE.MathUtils.damp(body.rotation.x, sitting ? 0.26 : 0, 8, dt);

      const wagSpeed = happy > 0 ? 22 : sitting ? 6 : 10 + speed;
      const wagAmt = happy > 0 ? 0.6 : 0.35;
      tail.rotation.y = Math.sin(elapsed * wagSpeed) * wagAmt;

      const earSway = Math.sin(elapsed * (6 + speed * 2)) * (0.12 + speed * 0.04);
      earL.rotation.x = earSway;
      earR.rotation.x = -earSway;

      // Look toward the player while idling so she "checks in" on you.
      const lookYaw = sitting ? Math.atan2(target.x - posX, target.z - posZ) - yaw : 0;
      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, THREE.MathUtils.clamp(lookYaw, -0.7, 0.7), 6, dt);
      head.position.y = 0.86 + (eating > 0 ? -0.18 : Math.sin(elapsed * 2) * 0.015);
    },

    dispose() {
      removeTreat();
      group.parent?.remove(group);
      group.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          (node.material as THREE.Material).dispose();
        }
      });
    },
  };
}
