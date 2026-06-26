import { describe, expect, it } from "vitest";
import { resolveDeskObstacle, robotVelocity } from "./little-machine-physics";

describe("robotVelocity", () => {
  it("moves forward along positive z", () => {
    expect(robotVelocity(5, 0)).toEqual({ x: 0, z: 5 });
  });

  it("rotates movement with the robot", () => {
    const velocity = robotVelocity(5, Math.PI / 2);
    expect(velocity.x).toBeCloseTo(5);
    expect(velocity.z).toBeCloseTo(0);
  });
});

describe("resolveDeskObstacle", () => {
  it("pushes the robot out of circular clutter", () => {
    const result = resolveDeskObstacle(1.2, 0, { x: 0, z: 0, radius: 1 }, 0.8);
    expect(result.x).toBeCloseTo(1.8);
    expect(result.collided).toBe(true);
  });
});

