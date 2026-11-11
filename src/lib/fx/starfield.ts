import { animate } from "animejs";
import { FLOW, type SurgeDetail, SURGE } from "./bus";
import { fxGate } from "./reveal";

/**
 * 星尘层：一层远处冷色星点 + 一层近处茶色余烬，全部走单点着色器。
 * 入场时所有星点向外炸开再收回（LINK START），之后只剩很慢的漂移，
 * 相机跟着指针做一点点视差。
 *
 * 内容编排会往这一层推信号：某一幕进场或在某一行悬停时，星尘从那个点向外让开
 * （`fx:surge`）；滚动速度归一后顺带把星尘带一下（`fx:flow`）。
 *
 * 一切 DOM 之外的东西都在这里，React 只负责挂一块 canvas。
 */

export type Starfield = {
  dispose: () => void;
};

const STAR_COLOR: [number, number, number] = [0.87, 0.93, 1];
const EMBER_COLOR: [number, number, number] = [0.91, 0.63, 0.4];

const VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uWarp;
uniform float uDpr;
uniform float uDrift;
uniform vec2 uOrigin;
uniform float uSurge;
uniform float uFlow;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = position;

  // warp：星点向外炸开并靠近，余烬只轻微跟随。
  p.xy *= 1.0 + uWarp * (2.2 - uDrift * 1.7);
  p.z *= 1.0 - uWarp * 0.72;

  float t = uTime * (0.3 + uDrift * 0.45);
  float sway = 0.7 + uWarp * 5.0 + uDrift * 2.0;
  p.x += sin(t + aPhase * 6.283) * sway;
  p.y += cos(t * 0.8 + aPhase * 6.283) * sway * 0.7;

  // 余烬一直往上飘，飘出画面就从底部接回来。循环放在屏幕空间里做，
  // 远近星点都是同一种速度感，也不会被远处的大坐标挤到画面外。
  float invZ = 1.0 / max(-p.z, 1.0);
  float ndcY = p.y * invZ / 0.554;
  ndcY = mod(ndcY + uTime * mix(0.012, 0.02, aPhase) + uDrift * 0.05, 2.3) - 1.15;
  p.y = ndcY * 0.554 / invZ;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // 内容信号在屏幕空间里作用：激波从内容块的位置把星尘推开，
  // 滚动越快，整体顺着方向被带一点。
  vec2 ndc = gl_Position.xy / gl_Position.w;
  vec2 delta = ndc - uOrigin;
  float reach = smoothstep(1.7, 0.0, length(delta));
  ndc += normalize(delta + vec2(1e-4)) * reach * uSurge * 0.1;
  ndc.y += uFlow * 0.03 * (0.4 + aPhase * 0.6);
  gl_Position.xy = ndc * gl_Position.w;

  float twinkle = 0.5 + 0.5 * sin(uTime * 1.6 + aPhase * 12.0);
  // 700 ≈ 视口半高对应的像素数，让点大小跟着透视走；近处的封顶免得糊成一块。
  float px = clamp(aSize * uDpr * (700.0 / max(-mv.z, 1.0)), 1.0, 14.0);
  gl_PointSize = px * (1.0 + uWarp * 2.2) * mix(1.0, twinkle, 0.55);

  vColor = aColor;
  vAlpha = (0.45 + 0.55 * twinkle) * (1.0 - uWarp * 0.4) * (1.0 + reach * uSurge * 0.9);
}
`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
uniform float uOpacity;

void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(vColor, pow(a, 1.6) * vAlpha * uOpacity);
}
`;

type Colors = { star: [number, number, number]; ember: [number, number, number] };

function fill(
  count: number,
  colors: Colors,
  opts: { ember: boolean; aspect: number },
): {
  positions: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  color: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const [base, warm] = [colors.star, colors.ember];

  for (let i = 0; i < count; i += 1) {
    // 按视锥铺开（不是按球壳），远近都铺满整幅画面，才不会只剩中间一坨。
    const depth = opts.ember ? 14 + Math.random() * 150 : 8 + Math.random() ** 0.9 * 320;
    const halfH = 0.554 * depth * 1.12;
    const halfW = halfH * opts.aspect;
    positions[i * 3] = (Math.random() * 2 - 1) * halfW;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfH;
    positions[i * 3 + 2] = -depth;

    sizes[i] = opts.ember ? 1.1 + Math.random() * 1.9 : 0.35 + Math.random() * 1.15;
    phases[i] = Math.random();

    // 大部分是冷色星尘，少数混成茶色（#C68E5C），和站点强调色对上。
    const mix = opts.ember || Math.random() < 0.16 ? 1 : 0;
    color[i * 3] = base[0] + (warm[0] - base[0]) * mix;
    color[i * 3 + 1] = base[1] + (warm[1] - base[1]) * mix;
    color[i * 3 + 2] = base[2] + (warm[2] - base[2]) * mix;
  }

  return { positions, sizes, phases, color };
}

export async function createStarfield(
  canvas: HTMLCanvasElement,
  opts: { reduced: boolean },
): Promise<Starfield> {
  const THREE = await import("three");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 1, 900);
  camera.position.z = 0;

  const group = new THREE.Group();
  scene.add(group);

  const narrow = window.matchMedia("(max-width: 640px)").matches;
  const reduced = opts.reduced;

  const makeLayer = (count: number, ember: boolean, opacity: number) => {
    const aspect = Math.max(window.innerWidth / Math.max(window.innerHeight, 1), 0.45);
    const data = fill(count, { star: STAR_COLOR, ember: EMBER_COLOR }, { ember, aspect });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(data.phases, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));

    const uniforms = {
      uTime: { value: Math.random() * 40 },
      uWarp: { value: 1 },
      uDpr: { value: 1 },
      uDrift: { value: ember ? 1 : 0 },
      uOpacity: { value: opacity },
      uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uSurge: { value: 0 },
      uFlow: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);
    return { geometry, material, uniforms };
  };

  const layers = [makeLayer(narrow ? 620 : 1400, false, 0.95), makeLayer(narrow ? 90 : 220, true, 0.55)];

  const cap = 2_400_000;
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const pixels = rect.width * rect.height * scale * scale;
    const shrink = pixels > cap ? Math.sqrt(cap / pixels) : 1;
    width = Math.max(1, Math.round(rect.width * scale * shrink));
    height = Math.max(1, Math.round(rect.height * scale * shrink));
    if (canvas.width === width && canvas.height === height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const dpr = width / Math.max(rect.width, 1);
    for (const layer of layers) layer.uniforms.uDpr.value = dpr;
    if (reduced) render();
  };

  const pointer = { x: 0, y: 0 };
  const aim = { x: 0, y: 0 };

  const onPointer = (event: PointerEvent) => {
    aim.x = (event.clientX / window.innerWidth) * 2 - 1;
    aim.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  let raf = 0;
  let last = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last === 0 ? 0.016 : Math.min((now - last) / 1000, 0.05);
    last = now;

    pointer.x += (aim.x - pointer.x) * 0.045;
    pointer.y += (aim.y - pointer.y) * 0.045;
    group.rotation.y += (pointer.x * 0.07 - group.rotation.y) * 0.06;
    group.rotation.x += (pointer.y * 0.05 - group.rotation.x) * 0.06;

    for (const layer of layers) layer.uniforms.uTime.value += dt;
    render();
  };

  const play = () => {
    if (reduced) return;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };

  // 背景标签页别烧 GPU。
  const onVisibility = () => {
    if (document.hidden) stop();
    else if (!reduced && raf === 0) play();
  };

  // 减弱动效时不跑 rAF，warp 值要落到终点，否则会定格在炸开的那一帧。
  if (reduced) {
    for (const layer of layers) layer.uniforms.uWarp.value = 0;
  }

  resize();
  render();

  let warp: ReturnType<typeof animate> | null = null;
  const startWarp = () => {
    warp?.cancel();
    warp = animate(
      layers.map((layer) => layer.uniforms.uWarp),
      { value: 0, duration: 1150, ease: "out(2.4)" },
    );
  };

  if (fxGate.revealed) startWarp();
  else window.addEventListener("fx:reveal", startWarp, { once: true });

  // 激波：内容块进场 / 行悬停时从那个点推一下，然后衰减回去。
  const surgeProxy = { value: 0 };
  let surgeAnim: ReturnType<typeof animate> | null = null;
  const onSurge = (event: Event) => {
    if (reduced) return;
    const detail = (event as CustomEvent<SurgeDetail>).detail;
    if (!detail) return;
    for (const layer of layers) {
      layer.uniforms.uOrigin.value.set(detail.x * 2 - 1, 1 - detail.y * 2);
    }
    const power = Math.min(detail.power, 1.6);
    surgeAnim?.cancel();
    surgeProxy.value = power;
    for (const layer of layers) layer.uniforms.uSurge.value = power;
    surgeAnim = animate(surgeProxy, {
      value: 0,
      duration: 1100,
      ease: "out(2.2)",
      onUpdate: () => {
        for (const layer of layers) layer.uniforms.uSurge.value = surgeProxy.value;
      },
    });
  };

  const onFlow = (event: Event) => {
    const value = (event as CustomEvent<number>).detail;
    if (typeof value !== "number") return;
    for (const layer of layers) layer.uniforms.uFlow.value = Math.min(Math.max(value, 0), 1);
  };

  window.addEventListener(SURGE, onSurge);
  window.addEventListener(FLOW, onFlow);

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  play();

  return {
    dispose: () => {
      stop();
      warp?.cancel();
      surgeAnim?.cancel();
      window.removeEventListener("fx:reveal", startWarp);
      window.removeEventListener(SURGE, onSurge);
      window.removeEventListener(FLOW, onFlow);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const layer of layers) {
        layer.geometry.dispose();
        layer.material.dispose();
      }
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
