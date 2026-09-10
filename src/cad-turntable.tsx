import { useEffect, useRef, useState } from "react";

const vertexShader = `#version 300 es
in vec3 position;
in vec3 normal;
uniform mat3 rotation;
uniform float aspect;
out vec3 vNormal;
out vec3 vPosition;
void main() {
  vPosition = rotation * position;
  vNormal = rotation * normal;
  gl_Position = vec4(vPosition.x / (1.7 * aspect), vPosition.y / 1.7, -vPosition.z / 8.0, 1.0);
}`;
const fragmentShader = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vPosition;
out vec4 color;
void main() {
  vec3 n = normalize(vNormal);
  vec3 key = normalize(vec3(-0.8, 1.1, 1.5));
  vec3 fill = normalize(vec3(1.0, 0.3, -0.6));
  float diffuse = max(dot(n, key), 0.0);
  float bounce = max(dot(n, fill), 0.0);
  float spec = pow(max(dot(n, normalize(key + vec3(0.0, 0.0, 1.0))), 0.0), 38.0);
  float rim = pow(1.0 - abs(n.z), 3.0);
  // Saved Nylon 101 appearance from the supplied SolidWorks part.
  vec3 nylon = vec3(0.79607844, 0.8235294, 0.9372549);
  vec3 lit = nylon * (0.24 + 0.7 * diffuse + 0.18 * bounce) + vec3(0.16 * spec + 0.07 * rim);
  color = vec4(pow(lit, vec3(0.8)), 1.0);
}`;

export function CadTurntable({ compact = false }: { compact?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const draw = useRef<((angle: number) => void) | null>(null);
  const rotation = useRef(35);
  const pitch = useRef(-7);
  const [angle, setAngle] = useState(35);
  const [tilt, setTilt] = useState(-7);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const updateAngle = (value: number) => {
    rotation.current = value;
    setAngle(value);
    draw.current?.(value);
  };
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(query.matches);
      if (query.matches) setScrollEnabled(false);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const target = canvas.current!;
    const gl = target.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFailed(true);
      return;
    }
    let disposed = false;
    let observer: ResizeObserver | undefined;
    const abort = new AbortController();
    const buffers: WebGLBuffer[] = [];
    const shaders: WebGLShader[] = [];
    let program: WebGLProgram | null = null;
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
      setReady(false);
      draw.current = null;
    };
    target.addEventListener("webglcontextlost", onLost);
    const setup = async () => {
      const response = await fetch("/models/lacrosse-head.mesh", {
        signal: abort.signal,
      });
      if (!response.ok) throw new Error("Model unavailable");
      const data = await response.arrayBuffer();
      if (disposed) return;
      const header = new DataView(data);
      const vertices = header.getUint32(0, true),
        indexCount = header.getUint32(4, true);
      if (data.byteLength !== 8 + vertices * 24 + indexCount * 4)
        throw new Error("Invalid model");
      program = gl.createProgram();
      if (!program) throw new Error("Renderer unavailable");
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertexShader],
        [gl.FRAGMENT_SHADER, fragmentShader],
      ] as const) {
        const shader = gl.createShader(type)!;
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw new Error("Shader unavailable");
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("Renderer unavailable");
      gl.useProgram(program);
      for (const [name, offset] of [
        ["position", 8],
        ["normal", 8 + vertices * 12],
      ] as const) {
        const buffer = gl.createBuffer()!;
        buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(data, offset, vertices * 3),
          gl.STATIC_DRAW,
        );
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      }
      const indexBuffer = gl.createBuffer()!;
      buffers.push(indexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(data, 8 + vertices * 24, indexCount),
        gl.STATIC_DRAW,
      );
      const rotationLocation = gl.getUniformLocation(program, "rotation");
      const aspectLocation = gl.getUniformLocation(program, "aspect");
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
      draw.current = (degrees) => {
        if (disposed || gl.isContextLost()) return;
        const radians = (degrees * Math.PI) / 180,
          pitchRadians = (pitch.current * Math.PI) / 180;
        const cy = Math.cos(radians),
          sy = Math.sin(radians),
          cx = Math.cos(pitchRadians),
          sx = Math.sin(pitchRadians);
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(target.clientWidth * ratio),
          height = Math.round(target.clientHeight * ratio);
        if (!width || !height) return;
        if (target.width !== width || target.height !== height) {
          target.width = width;
          target.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform1f(aspectLocation, width / height);
        gl.uniformMatrix3fv(
          rotationLocation,
          false,
          new Float32Array([
            cy,
            sx * sy,
            -cx * sy,
            0,
            cx,
            sx,
            sy,
            -sx * cy,
            cx * cy,
          ]),
        );
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_INT, 0);
      };
      observer = new ResizeObserver(() => draw.current?.(rotation.current));
      observer.observe(target);
      draw.current(rotation.current);
      setReady(true);
    };
    // Load the model only when its display is approaching the viewport.
    const intersection = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          intersection.disconnect();
          setup().catch(() => {
            if (!disposed) setFailed(true);
          });
        }
      },
      { rootMargin: "400px" },
    );
    intersection.observe(target);
    return () => {
      disposed = true;
      abort.abort();
      intersection.disconnect();
      observer?.disconnect();
      target.removeEventListener("webglcontextlost", onLost);
      draw.current = null;
      buffers.forEach((b) => gl.deleteBuffer(b));
      shaders.forEach((s) => gl.deleteShader(s));
      if (program) gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    if (!ready || !scrollEnabled || reducedMotion) return;
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = section.current!.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const distance = compact
          ? rect.height + window.innerHeight
          : Math.max(1, rect.height - window.innerHeight * 0.78);
        const progress = Math.min(
          1,
          Math.max(
            0,
            ((compact ? window.innerHeight : 80) - rect.top) / distance,
          ),
        );
        updateAngle(35 + progress * 360);
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    scroll();
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
    };
  }, [ready, scrollEnabled, reducedMotion, compact]);

  const choose = (value: number) => {
    setScrollEnabled(false);
    updateAngle(value);
  };
  if (compact) {
    return (
      <section
        ref={section}
        className="cad-preview"
        aria-label="Lacrosse head in 3D"
      >
        <div className="cad-stage">
          <canvas
            ref={canvas}
            className={ready && !failed ? "is-ready" : ""}
            aria-label="Original lacrosse head model. Scroll the page to rotate it, or use the rotation slider."
            role="img"
          />
          {(!ready || failed) && (
            <img
              className="cad-poster"
              src="/images/objects/lacrosse-source.png"
              width={640}
              height={480}
              alt="Original saved SolidWorks preview of the lacrosse head."
            />
          )}
          {ready && !failed && (
            <div className="cad-preview-controls">
              <span>
                {scrollEnabled && !reducedMotion
                  ? "Scroll to rotate"
                  : "Explore the form"}
              </span>
              <input
                type="range"
                aria-label="Rotate lacrosse head"
                min="0"
                max="360"
                step="1"
                value={Math.round(angle % 360)}
                onChange={(event) => choose(Number(event.target.value))}
              />
              {!reducedMotion && (
                <button
                  type="button"
                  aria-label={
                    scrollEnabled
                      ? "Pause scroll rotation"
                      : "Resume scroll rotation"
                  }
                  onClick={() => setScrollEnabled(!scrollEnabled)}
                >
                  {scrollEnabled ? "Pause" : "Resume"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
    <section
      ref={section}
      className={`cad-scroll-section ${!reducedMotion && !failed ? "is-scroll-driven" : ""}`}
      aria-labelledby="geometry-title"
    >
      <div className="cad-sticky">
        <div className="cad-stage-heading">
          <div>
            <p className="eyebrow">The original geometry</p>
            <h2 id="geometry-title">Every angle.</h2>
          </div>
          <span className="folio">SolidWorks / CAD study</span>
        </div>
        <div className="cad-stage">
          <canvas
            ref={canvas}
            className={ready && !failed ? "is-ready" : ""}
            aria-label="Three-dimensional lacrosse head. Use the rotation slider or view buttons below to change its angle."
            role="img"
          />
          {(!ready || failed) && (
            <img
              className="cad-poster"
              src="/images/objects/lacrosse-source.png"
              width={640}
              height={480}
              alt="Original saved SolidWorks preview of the lacrosse head."
            />
          )}
          <span className="cad-corner-label">SH / 09</span>
          {ready && !failed && (
            <span className="cad-angle" aria-hidden="true">
              {Math.round(angle % 360)
                .toString()
                .padStart(3, "0")}
              °
            </span>
          )}
        </div>
        {ready && !failed && (
          <div className="cad-controls">
            <div
              className="cad-view-buttons"
              role="group"
              aria-label="Choose a view"
            >
              {[
                ["Front", 0],
                ["Side", 90],
                ["Back", 180],
                ["Three-quarter", 35],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => choose(Number(value))}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="cad-slider">
              Rotate{" "}
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={Math.round(angle % 360)}
                onChange={(e) => choose(Number(e.target.value))}
              />
            </label>
            <label className="cad-slider">
              Tilt{" "}
              <input
                type="range"
                min="-90"
                max="90"
                step="1"
                value={tilt}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setScrollEnabled(false);
                  pitch.current = value;
                  setTilt(value);
                  draw.current?.(rotation.current);
                }}
              />
            </label>
            {!reducedMotion && (
              <button
                className="cad-motion-toggle"
                type="button"
                aria-pressed={scrollEnabled}
                onClick={() => setScrollEnabled(!scrollEnabled)}
              >
                {scrollEnabled
                  ? "Pause scroll rotation"
                  : "Enable scroll rotation"}
              </button>
            )}
          </div>
        )}
        <p className="cad-caption">
          Saved display mesh extracted from my SolidWorks part.{" "}
          {failed
            ? "The original CAD preview is shown on this device."
            : "Scroll to rotate, or choose a view."}
        </p>
      </div>
    </section>
  );
}
