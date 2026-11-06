import { useEffect, useRef } from 'react';
import './BlueShaderBackground.css';

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_speed;
  uniform float u_intensity;

  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;

    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.0);
      sine_acc = rotate(sine_acc, 1.0);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.15 * p;
      res += (0.5 + 0.5 * cos(layer)) / scale;
      scale *= 1.2;
    }

    return res.x + res.y;
  }

  void main() {
    vec2 uv = 0.42 * v_uv;
    uv.x *= u_ratio;

    vec2 pointer = v_uv - u_pointer_position;
    pointer.x *= u_ratio;

    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.5 * pow(1.0 - p, 2.0);

    float noise = neuro_shape(uv, u_speed * u_time, p);
    noise = 1.12 * pow(noise, 2.9);
    noise += pow(noise, 7.4);
    noise = max(0.0, noise - 0.39);

    float centerFade = 1.0 - smoothstep(0.06, 1.16, length(v_uv - 0.5));
    float surfaceLight = smoothstep(0.15, 1.0, v_uv.y);
    float pointerGlow = p * 0.24;
    float glow = noise * (0.99 + pointerGlow) * centerFade;
    float pulse = 0.88 + 0.12 * sin(u_time * 0.00032);

    vec3 deepNavy = vec3(0.002, 0.012, 0.045);
    vec3 oceanBlue = vec3(0.008, 0.090, 0.270);
    vec3 brandBlue = vec3(0.027, 0.365, 0.965);
    vec3 surfaceCyan = vec3(0.090, 0.675, 1.000);

    vec3 color = mix(deepNavy, oceanBlue, surfaceLight * 0.72);
    color = mix(color, brandBlue, clamp(glow * 1.42 + pointerGlow, 0.0, 1.0));
    color += surfaceCyan * pow(surfaceLight, 3.0) * 0.04;

    vec3 finalColor = color * glow * pulse * u_intensity;
    finalColor += brandBlue * pow(glow, 2.0) * 0.28 * u_intensity;

    gl_FragColor = vec4(finalColor, clamp(glow, 0.0, 0.94));
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function BlueShaderBackground({ speed = 0.00072, intensity = 1 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return undefined;

    const program = createProgram(gl);
    if (!program) return undefined;

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer_position');
    const speedLocation = gl.getUniformLocation(program, 'u_speed');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const vertexBuffer = gl.createBuffer();

    if (
      positionLocation < 0 ||
      !timeLocation ||
      !ratioLocation ||
      !pointerLocation ||
      !speedLocation ||
      !intensityLocation ||
      !vertexBuffer
    ) {
      gl.deleteProgram(program);
      return undefined;
    }

    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(ratioLocation, canvas.width / canvas.height);
    };

    const updatePointer = (x, y) => {
      const rect = container.getBoundingClientRect();
      pointer.targetX = Math.max(0, Math.min(1, (x - rect.left) / Math.max(rect.width, 1)));
      pointer.targetY = Math.max(0, Math.min(1, 1 - (y - rect.top) / Math.max(rect.height, 1)));
    };

    const handlePointerMove = event => updatePointer(event.clientX, event.clientY);

    const render = now => {
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      gl.uniform1f(timeLocation, now);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(intensityLocation, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!prefersReducedMotion) frameId = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resize();
    resizeObserver.observe(container);
    window.addEventListener('pointermove', handlePointerMove);

    if (prefersReducedMotion) render(0);
    else frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteProgram(program);
    };
  }, [intensity, speed]);

  return (
    <div ref={containerRef} className="blue-shader-background" aria-hidden="true">
      <canvas ref={canvasRef} className="blue-shader-background__canvas" />
      <div className="blue-shader-background__veil" />
      <div className="blue-shader-background__grain" />
    </div>
  );
}
