import { describe, expect, it } from "vitest";
import { cameraRelativeVelocity, pushOutOfColliders } from "./portfolio-game";
import type { Collider } from "./game-types";

describe("cameraRelativeVelocity", () => {
  it("moves forward along the camera view at zero yaw", () => {
    const velocity = cameraRelativeVelocity(0, -1, 0, 5);
    expect(velocity.x).toBeCloseTo(0);
    expect(velocity.z).toBeCloseTo(-5);
  });

  it("turns forward movement with the camera", () => {
    const velocity = cameraRelativeVelocity(0, -1, Math.PI / 2, 5);
    expect(velocity.x).toBeCloseTo(-5);
    expect(velocity.z).toBeCloseTo(0);
  });

  it("keeps strafing perpendicular to the view direction", () => {
    const velocity = cameraRelativeVelocity(1, 0, Math.PI / 2, 5);
    expect(velocity.x).toBeCloseTo(0);
    expect(velocity.z).toBeCloseTo(-5);
  });
});

describe("pushOutOfColliders", () => {
  const block: Collider = { minX: -1, maxX: 1, minZ: -1, maxZ: 1 };

  it("leaves a player outside every collider untouched", () => {
    const result = pushOutOfColliders(5, 5, [block], 0.4);
    expect(result).toEqual({ x: 5, z: 5 });
  });

  it("ejects along the shortest axis (nearest the +X face)", () => {
    // Just inside the +X edge: should be pushed out to maxX + radius.
    const result = pushOutOfColliders(1.2, 0, [block], 0.4);
    expect(result.x).toBeCloseTo(1.4);
    expect(result.z).toBeCloseTo(0);
  });

  it("ejects along the shortest axis (nearest the -Z face)", () => {
    const result = pushOutOfColliders(0, -1.2, [block], 0.4);
    expect(result.z).toBeCloseTo(-1.4);
    expect(result.x).toBeCloseTo(0);
  });

  it("inflates the collider by the player radius", () => {
    // 1.3 is outside the raw box (maxX 1) but inside once inflated by radius 0.4 (maxX 1.4).
    const result = pushOutOfColliders(1.3, 0, [block], 0.4);
    expect(result.x).toBeCloseTo(1.4);
  });
});
