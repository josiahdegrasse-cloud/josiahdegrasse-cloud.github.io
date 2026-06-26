export type DeskObstacle = { x: number; z: number; radius: number };

export function robotVelocity(speed: number, heading: number) {
  return {
    x: Math.sin(heading) * speed,
    z: Math.cos(heading) * speed,
  };
}

export function resolveDeskObstacle(
  x: number,
  z: number,
  obstacle: DeskObstacle,
  radius: number,
) {
  const dx = x - obstacle.x;
  const dz = z - obstacle.z;
  const distance = Math.hypot(dx, dz);
  const minimum = obstacle.radius + radius;
  if (distance === 0 || distance >= minimum) return { x, z, collided: false };
  const scale = minimum / distance;
  return {
    x: obstacle.x + dx * scale,
    z: obstacle.z + dz * scale,
    collided: true,
  };
}

