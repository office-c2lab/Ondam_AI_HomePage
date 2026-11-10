import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  motion as Motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import overhaulBackgroundFrames from './overhaulBackgroundFrames.json';

const PORTFOLIO_CAMERA_START = [-30.52, 0.97, 37.15];
const PORTFOLIO_LOOK_AT_START = [14, 3, 0];
const DISPLAY_WORLD_CENTER = [0, 8.72, -10.2];
const FOCUSED_CAMERA_DESKTOP = [0, 8.72, 14];
const FOCUSED_CAMERA_MOBILE = [0, 8.72, 26];
const LAPTOP_FOCUS_END = 0.24;
const LAPTOP_DEMO_END = 0.58;
const LAPTOP_RETREAT_DURATION = 0.14;
const SOLUTION_MENU_EXIT_END = 0.64;
const LAPTOP_STAGE_END = 0.76;
const ORIGINAL_SCROLL_VH = 620;
const AI_RESPONSE_HOLD_SCROLL_VH = 80;
const LAPTOP_SCROLL_VH = ORIGINAL_SCROLL_VH * LAPTOP_STAGE_END + AI_RESPONSE_HOLD_SCROLL_VH;
const VIDEO_LEAD_IN_SCROLL_VH = 24.8;
const VIDEO_SCRUB_SCROLL_VH = 360;
const VIDEO_END_HOLD_SCROLL_VH = 24;
const OVERHAUL_START_TIME = 0;
const OVERHAUL_VIDEO_FPS = 60;
const VIDEO_FRAME_DURATION = 1 / OVERHAUL_VIDEO_FPS;
// Fitted to the six outer corners in overhaul-scroll.mp4's first frame.
const OVERHAUL_CAMERA = [-36.51703, -0.75835, 48.66409];
const OVERHAUL_LOOK_AT = [2.15498, 2.50677, -3];
const OVERHAUL_CAMERA_UP = [0.1245575, 0.9922124, 0];
const OVERHAUL_FOV = 29.046434;
const OVERHAUL_LID_ANGLE = 0.0912476;
const DEPLOYMENT_VIDEO_SCALE = 0.88;

function getOverhaulFrame(width, height) {
  const mobile = width < 640;
  const frameWidth = width * (mobile ? 0.92 : 0.61);
  return {
    width: frameWidth,
    height: (frameWidth * 9) / 16,
    centerX: width * (mobile ? 0.5 : 0.37),
    centerY: height * (mobile ? 0.5 : 0.51),
  };
}

function getDeploymentVideoFrame(width, height) {
  if (width >= 1024) {
    const contentWidth = Math.min(width, 1920);
    const frameWidth = contentWidth * 0.61 * DEPLOYMENT_VIDEO_SCALE;
    return {
      width: frameWidth,
      height: (frameWidth * 9) / 16,
      centerX: width * 0.5 - contentWidth * 0.13,
      centerY: height * 0.51,
    };
  }

  const frameWidth = Math.min(width * 0.92, height * (height < 600 ? 0.3 : 0.4) * (16 / 9));
  const frameHeight = (frameWidth * 9) / 16;
  return {
    width: frameWidth * DEPLOYMENT_VIDEO_SCALE,
    height: frameHeight * DEPLOYMENT_VIDEO_SCALE,
    centerX: width * 0.5,
    centerY: Math.max(height * 0.32, frameHeight / 2 + 80),
  };
}

function applyStudioColors(element, time = 0) {
  if (!element) return;
  // Edge samples obscured by exploded parts are replaced with interpolated
  // background-only colors in overhaulBackgroundFrames.json.
  const frameIndex = Math.min(
    Math.max(0, Math.round(time * overhaulBackgroundFrames.fps)),
    overhaulBackgroundFrames.frames.length - 1
  );
  if (element.dataset.studioFrame === String(frameIndex)) return;
  element.dataset.studioFrame = String(frameIndex);
  const stops = ['top', 'quarter', 'middle', 'floor', 'bottom'];
  const gradients = overhaulBackgroundFrames.frames[frameIndex].map(colors => {
    const colorStops = colors.map(
      (rgb, index) => `rgb(${rgb.join(',')}) var(--studio-${stops[index]})`
    );
    return `linear-gradient(to bottom, rgb(${colors[0].join(',')}) 0px, ${colorStops.join(',')})`;
  });
  element.style.background = gradients[0];
  if (element.firstElementChild) {
    element.firstElementChild.style.background = gradients[1];
  }
}

const solutionLinks = [
  ['Discover', '#discover'],
  ['Control Internal', '#control-internal'],
  ['Control External', '#control-external'],
  ['Manage', '#manage'],
];

export function SolutionMenu({ compact = false }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <Motion.h2
        className={`leading-[1.12] font-semibold tracking-[-0.055em] text-slate-950 ${
          compact ? 'text-[clamp(2rem,6vw,3rem)]' : 'text-[clamp(2rem,2.5vw,3rem)]'
        }`}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
      >
        솔루션 &amp; 서비스
      </Motion.h2>

      <nav className="mt-8" aria-label="솔루션 바로가기">
        {solutionLinks.map(([label, href], index) => (
          <Motion.a
            key={href}
            href={href}
            className={`group flex items-center justify-between py-[18px] text-left font-semibold tracking-[-0.025em] transition-[color,padding] duration-300 hover:pl-2 hover:text-[#0b5cff] ${
              compact ? 'text-[clamp(0.95rem,2.4vw,1.1rem)]' : 'text-[clamp(0.95rem,0.95vw,1.1rem)]'
            } text-slate-700`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.52, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{label}</span>
            <span
              aria-hidden="true"
              className="translate-x-1 text-lg opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </Motion.a>
        ))}
      </nav>
    </div>
  );
}

function AnimatedSolutionLink({ label, href, index, scrollProgress, motionEnabled }) {
  const exitStart = 0.16 + index * 0.1;
  const opacity = useTransform(scrollProgress, [exitStart, exitStart + 0.18], [1, 0]);
  const x = useTransform(scrollProgress, [exitStart, exitStart + 0.18], [0, 32]);
  const visibility = useTransform(opacity, value => (value <= 0.01 ? 'hidden' : 'visible'));

  return (
    <Motion.div
      initial={motionEnabled ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.58, delay: 0.18 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
    >
      <Motion.a
        href={href}
        className="group flex items-center justify-between py-[18px] text-left text-[clamp(0.95rem,0.95vw,1.1rem)] font-semibold tracking-[-0.025em] text-slate-700 transition-[color,padding] duration-300 hover:pl-2 hover:text-[#0b5cff]"
        style={{ opacity, visibility, x: motionEnabled ? x : 0 }}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="translate-x-1 text-lg opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        >
          →
        </span>
      </Motion.a>
    </Motion.div>
  );
}

function DesktopSolutionMenu({ scrollProgress, motionEnabled }) {
  const titleOpacity = useTransform(scrollProgress, [0.06, 0.2], [1, 0]);
  const titleX = useTransform(scrollProgress, [0.06, 0.2], [0, 32]);

  return (
    <div>
      <Motion.div
        initial={motionEnabled ? { opacity: 0, y: 22 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      >
        <Motion.h2
          className="text-[clamp(2rem,2.5vw,3rem)] leading-[1.12] font-semibold tracking-[-0.055em] text-slate-950"
          style={{ opacity: titleOpacity, x: motionEnabled ? titleX : 0 }}
        >
          솔루션 &amp; 서비스
        </Motion.h2>
      </Motion.div>

      <nav className="mt-8" aria-label="솔루션 바로가기">
        {solutionLinks.map(([label, href], index) => (
          <AnimatedSolutionLink
            key={href}
            label={label}
            href={href}
            index={index}
            scrollProgress={scrollProgress}
            motionEnabled={motionEnabled}
          />
        ))}
      </nav>
    </div>
  );
}

function useSolutionCopyReveal(progress, motionEnabled, start, end) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [24, 0]);
  const visibility = useTransform(opacity, value => (value <= 0.01 ? 'hidden' : 'visible'));
  return { opacity, visibility, x: motionEnabled ? x : 0 };
}

function LaptopRetreatCopy({ retreatProgress, motionEnabled }) {
  const revealStyle = useSolutionCopyReveal(retreatProgress, motionEnabled, 0.84, 1);

  return (
    <Motion.aside
      aria-labelledby="laptop-retreat-title"
      className="solution-stage-copy pointer-events-none absolute z-20 hidden xl:block"
      style={revealStyle}
    >
      <h3
        id="laptop-retreat-title"
        className="text-[clamp(1.5rem,1.75vw,2rem)] leading-[1.45] font-bold tracking-[-0.04em] break-keep text-slate-950"
      >
        <span className="block">서비스의 발견과 분석부터,</span>
        <span className="block">내부·외부 사용 통제,</span>
        <span className="block">
          <span className="text-[#0b5cff]">App·Agent</span> 운영까지.
        </span>
        <span className="mt-[0.65em] block">
          기업의 모든 <span className="text-[#0b5cff]">AI</span>를
        </span>
        <span className="block">한곳에서 관리합니다.</span>
      </h3>
    </Motion.aside>
  );
}

function makeUnlitMaterial(material) {
  const unlitMaterial = new THREE.MeshBasicMaterial({
    color: material?.color ?? 0xffffff,
    map: material?.map ?? null,
    alphaMap: material?.alphaMap ?? null,
    alphaTest: material?.alphaTest ?? 0,
    opacity: material?.opacity ?? 1,
    transparent: material?.transparent ?? false,
    side: material?.side ?? THREE.FrontSide,
    vertexColors: material?.vertexColors ?? false,
  });
  unlitMaterial.name = `${material?.name ?? 'material'}-unlit`;
  return unlitMaterial;
}

function makeLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const context = canvas.getContext('2d');
  context.fillStyle = '#020204';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;

  const logo = new Image();
  logo.onload = () => {
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = logo.naturalWidth;
    logoCanvas.height = logo.naturalHeight;
    const logoContext = logoCanvas.getContext('2d');
    logoContext.drawImage(logo, 0, 0);

    const logoPixels = logoContext.getImageData(0, 0, logoCanvas.width, logoCanvas.height);
    for (let index = 0; index < logoPixels.data.length; index += 4) {
      const red = logoPixels.data[index];
      const green = logoPixels.data[index + 1];
      const blue = logoPixels.data[index + 2];
      if (logoPixels.data[index + 3] > 0 && Math.max(red, green, blue) < 90) {
        logoPixels.data[index] = 255;
        logoPixels.data[index + 1] = 255;
        logoPixels.data[index + 2] = 255;
      }
    }
    logoContext.putImageData(logoPixels, 0, 0);

    const logoWidth = 920;
    const logoHeight = logoWidth * (logo.naturalHeight / logo.naturalWidth);
    context.drawImage(
      logoCanvas,
      (canvas.width - logoWidth) / 2,
      (canvas.height - logoHeight) / 2,
      logoWidth,
      logoHeight
    );
    texture.needsUpdate = true;
  };
  logo.src = '/ondam_logo_simbol.png';

  return texture;
}

function EmbeddedOndamScreen({ screenRef, iframeRef, onIframeLoad }) {
  return (
    <Html
      transform
      pointerEvents="none"
      distanceFactor={6}
      rotation={[-0.33, 0, 0]}
      position={[0, 9.62, -14.08]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={screenRef}
        inert={true}
        aria-hidden="true"
        className="h-[1195px] w-[1900px] overflow-hidden bg-white"
        style={{
          opacity: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'opacity 120ms linear',
        }}
      >
        <iframe
          ref={iframeRef}
          src="/embedded/ondam-screen"
          title=""
          onLoad={onIframeLoad}
          tabIndex={-1}
          width="1280"
          height="805"
          className="block border-0"
          style={{
            pointerEvents: 'none',
            transform: 'scale(1.484375)',
            transformOrigin: 'top left',
          }}
        />
      </div>
    </Html>
  );
}

function LaptopModel({
  motionEnabled,
  scrollProgress,
  entryProgress,
  demoProgress,
  retreatProgress,
}) {
  const group = useRef(null);
  const screen = useRef(null);
  const iframe = useRef(null);
  const logoMaterial = useRef(null);
  const animatedRig = useRef(null);
  const lastDemoProgress = useRef(-1);
  const cameraLookAt = useRef(new THREE.Vector3(...PORTFOLIO_LOOK_AT_START));
  const cameraDestination = useRef(new THREE.Vector3());
  const lookAtDestination = useRef(new THREE.Vector3());
  const upDestination = useRef(new THREE.Vector3());
  const focusProgress = useRef(0);
  const entryMotion = useRef(0);
  const gltf = useLoader(GLTFLoader, '/models/macbook.glb');
  const texture = useMemo(() => makeLogoTexture(), []);
  const rig = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const lidMeshes = [];

    clonedScene.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.material = Array.isArray(object.material)
        ? object.material.map(makeUnlitMaterial)
        : makeUnlitMaterial(object.material);

      // The source model includes both lid and deck vertices in some meshes.
      // A morph rotates only lid vertices around the real hinge, preserving the deck.
      object.geometry.computeBoundingBox();
      if (object.geometry.boundingBox.max.y > 1) {
        object.geometry = object.geometry.clone();
        const original = object.geometry.attributes.position;
        const tilted = original.clone();
        const vertex = new THREE.Vector3();
        for (let index = 0; index < original.count; index += 1) {
          vertex.fromBufferAttribute(original, index);
          if (vertex.y <= 0.6) continue;
          vertex.z += 10.7;
          vertex.applyAxisAngle(new THREE.Vector3(1, 0, 0), OVERHAUL_LID_ANGLE);
          vertex.z -= 10.7;
          tilted.setXYZ(index, vertex.x, vertex.y, vertex.z);
        }
        object.geometry.morphAttributes.position = [tilted];
        object.updateMorphTargets();
        lidMeshes.push(object);
      }
    });

    const trackingNode = clonedScene.getObjectByName('tracking_node_placeholder');
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      transparent: true,
      depthWrite: false,
    });
    const display = new THREE.Mesh(new THREE.PlaneGeometry(28.1, 16.7), logoMaterial);
    display.name = 'ondam-dashboard-display';
    display.position.set(0, 9.62, -14.12);
    display.rotation.x = -0.33;
    display.renderOrder = 10;
    const displayHinge = new THREE.Group();
    displayHinge.position.z = -10.7;
    display.position.z += 10.7;
    displayHinge.add(display);
    trackingNode.add(displayHinge);

    return { scene: clonedScene, logoMaterial, lidMeshes, displayHinge };
  }, [gltf.scene, texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    logoMaterial.current = rig.logoMaterial;
    animatedRig.current = rig;
    return () => {
      logoMaterial.current = null;
      animatedRig.current = null;
    };
  }, [rig]);

  useFrame((state, delta) => {
    if (
      iframe.current?.contentWindow &&
      Math.abs(demoProgress.current - lastDemoProgress.current) > 0.002
    ) {
      iframe.current.contentWindow.postMessage(
        { type: 'ondam-scroll-demo', progress: demoProgress.current },
        window.location.origin
      );
      lastDemoProgress.current = demoProgress.current;
    }

    entryMotion.current = motionEnabled
      ? THREE.MathUtils.damp(entryMotion.current, entryProgress.current, 5, delta)
      : entryProgress.current > 0
        ? 1
        : 0;
    const entrance = THREE.MathUtils.smootherstep(entryMotion.current, 0, 1);
    const retreat = THREE.MathUtils.smootherstep(retreatProgress.current, 0, 1);
    animatedRig.current?.lidMeshes.forEach(mesh => {
      mesh.morphTargetInfluences[0] = retreat;
    });
    if (animatedRig.current) {
      animatedRig.current.displayHinge.rotation.x = OVERHAUL_LID_ANGLE * retreat;
    }

    if (group.current) {
      group.current.position.set(
        0,
        THREE.MathUtils.lerp(-13.5, -5, entrance),
        THREE.MathUtils.lerp(5, 0, entrance)
      );
      group.current.rotation.set(THREE.MathUtils.lerp(0.38, 0.335, entrance), 0, 0);
      group.current.scale.setScalar(THREE.MathUtils.lerp(70, 100, entrance));
    }

    focusProgress.current = motionEnabled
      ? THREE.MathUtils.damp(focusProgress.current, scrollProgress.current, 5, delta)
      : scrollProgress.current;
    const progress = THREE.MathUtils.smoothstep(focusProgress.current, 0, 1);
    const dashboardReveal = THREE.MathUtils.smoothstep(focusProgress.current, 0.88, 0.99);
    const dashboardExit = THREE.MathUtils.smootherstep(retreatProgress.current, 0, 0.32);
    const screenReveal = dashboardReveal * (1 - dashboardExit);
    if (logoMaterial.current) {
      logoMaterial.current.opacity = 1 - screenReveal;
    }
    if (screen.current) {
      screen.current.style.opacity = String(screenReveal);
    }
    const isMobile = state.size.width < 640;
    const focusedCamera = isMobile ? FOCUSED_CAMERA_MOBILE : FOCUSED_CAMERA_DESKTOP;
    const retreatedCamera = OVERHAUL_CAMERA;
    const retreatedLookAt = OVERHAUL_LOOK_AT;
    const cameraPosition = cameraDestination.current.set(
      THREE.MathUtils.lerp(
        isMobile ? -22 : PORTFOLIO_CAMERA_START[0],
        THREE.MathUtils.lerp(focusedCamera[0], retreatedCamera[0], retreat),
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 1 : PORTFOLIO_CAMERA_START[1],
        THREE.MathUtils.lerp(focusedCamera[1], retreatedCamera[1], retreat),
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 42 : PORTFOLIO_CAMERA_START[2],
        THREE.MathUtils.lerp(focusedCamera[2], retreatedCamera[2], retreat),
        progress
      )
    );
    const lookAtPosition = lookAtDestination.current.set(
      THREE.MathUtils.lerp(
        isMobile ? 8 : PORTFOLIO_LOOK_AT_START[0],
        THREE.MathUtils.lerp(DISPLAY_WORLD_CENTER[0], retreatedLookAt[0], retreat),
        progress
      ),
      THREE.MathUtils.lerp(
        3,
        THREE.MathUtils.lerp(DISPLAY_WORLD_CENTER[1], retreatedLookAt[1], retreat),
        progress
      ),
      THREE.MathUtils.lerp(
        0,
        THREE.MathUtils.lerp(DISPLAY_WORLD_CENTER[2], retreatedLookAt[2], retreat),
        progress
      )
    );

    if (motionEnabled && retreat === 0) {
      state.camera.position.x = THREE.MathUtils.damp(
        state.camera.position.x,
        cameraPosition.x,
        4.2,
        delta
      );
      state.camera.position.y = THREE.MathUtils.damp(
        state.camera.position.y,
        cameraPosition.y,
        4.2,
        delta
      );
      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z,
        cameraPosition.z,
        4.2,
        delta
      );
      cameraLookAt.current.lerp(lookAtPosition, 1 - Math.exp(-4.2 * delta));
    } else {
      state.camera.position.copy(cameraPosition);
      cameraLookAt.current.copy(lookAtPosition);
    }

    state.camera.up.copy(
      upDestination.current.set(
        OVERHAUL_CAMERA_UP[0] * retreat,
        THREE.MathUtils.lerp(1, OVERHAUL_CAMERA_UP[1], retreat),
        0
      )
    );
    state.camera.lookAt(cameraLookAt.current);
    const frame = getOverhaulFrame(state.size.width, state.size.height);
    state.camera.fov = THREE.MathUtils.lerp(55, OVERHAUL_FOV, retreat);
    state.camera.aspect = THREE.MathUtils.lerp(
      state.size.width / state.size.height,
      16 / 9,
      retreat
    );
    state.camera.updateProjectionMatrix();
    const projection = state.camera.projectionMatrix.elements;
    projection[0] *= THREE.MathUtils.lerp(1, frame.width / state.size.width, retreat);
    projection[5] *= THREE.MathUtils.lerp(1, frame.height / state.size.height, retreat);
    projection[8] -= ((2 * frame.centerX) / state.size.width - 1) * retreat;
    projection[9] -= (1 - (2 * frame.centerY) / state.size.height) * retreat;
    state.camera.projectionMatrixInverse.copy(state.camera.projectionMatrix).invert();
  });

  return (
    <group ref={group} rotation={[0.38, 0, 0]} position={[0, -13.5, 5]} scale={70}>
      <primitive object={rig.scene} />
      <group scale={0.01}>
        <EmbeddedOndamScreen
          screenRef={screen}
          iframeRef={iframe}
          onIframeLoad={() => {
            lastDemoProgress.current = -1;
          }}
        />
      </group>
    </group>
  );
}

function StudioBackground({ backgroundRef }) {
  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        '--studio-top': '24vh',
        '--studio-quarter': '38vh',
        '--studio-middle': '52vh',
        '--studio-floor': '66vh',
        '--studio-bottom': '79vh',
        '--studio-left': '6.5vw',
        '--studio-right': '67.5vw',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
        background:
          'linear-gradient(to bottom, #fdfdfd 0px, #fdfdfd var(--studio-quarter), #f7fafc var(--studio-middle), #eff6f9 var(--studio-floor), #f0f7fa var(--studio-bottom))',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fdfdfd 0px, #fdfdfd var(--studio-top), #f5fbfc var(--studio-quarter), #eef5fa var(--studio-middle), #e2edf9 var(--studio-floor), #e2ecfb var(--studio-bottom))',
          maskImage:
            'linear-gradient(to right, transparent var(--studio-left), black var(--studio-right))',
          WebkitMaskImage:
            'linear-gradient(to right, transparent var(--studio-left), black var(--studio-right))',
        }}
      />
    </div>
  );
}

export default function SolutionLaptop() {
  const shouldReduceMotion = useReducedMotion();
  const section = useRef(null);
  const videoSection = useRef(null);
  const studioBackground = useRef(null);
  const videoStudioBackground = useRef(null);
  const groundShadow = useRef(null);
  const videoLayer = useRef(null);
  const overhaulVideo = useRef(null);
  const scrollProgress = useRef(0);
  const demoProgress = useRef(0);
  const entryProgress = useRef(0);
  const retreatProgress = useRef(0);
  const videoProgress = useRef(0);
  const desiredVideoTime = useRef(0);
  const lastVideoTime = useRef(-1);
  const videoHasFrame = useRef(false);
  const videoStageActive = useRef(false);
  const [isVideoStage, setIsVideoStage] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const isLaptopVisible = useInView(section, { margin: '120px' });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: videoEntranceProgress } = useScroll({
    target: videoSection,
    offset: ['start end', 'start start'],
  });
  const videoCopyRevealStyle = useSolutionCopyReveal(
    videoEntranceProgress,
    motionEnabled,
    0.45,
    0.8
  );
  const laptopFocusProgress = useTransform(
    scrollYProgress,
    [0, (ORIGINAL_SCROLL_VH * LAPTOP_FOCUS_END) / LAPTOP_SCROLL_VH],
    [0, 1]
  );
  const laptopRetreatProgress = useTransform(
    scrollYProgress,
    [
      (ORIGINAL_SCROLL_VH * LAPTOP_DEMO_END + AI_RESPONSE_HOLD_SCROLL_VH) / LAPTOP_SCROLL_VH,
      (ORIGINAL_SCROLL_VH * (LAPTOP_DEMO_END + LAPTOP_RETREAT_DURATION) +
        AI_RESPONSE_HOLD_SCROLL_VH) /
        LAPTOP_SCROLL_VH,
    ],
    [0, 1]
  );
  const menuPointerEvents = useTransform(laptopFocusProgress, value =>
    value >= SOLUTION_MENU_EXIT_END ? 'none' : 'auto'
  );
  const introductionLineVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: '0%', filter: 'blur(0px)' }
      : { opacity: 0, y: '110%', filter: 'blur(8px)' },
    visible: order => ({
      opacity: 1,
      y: '0%',
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0 : order < 2 ? 0.95 : 0.75,
        delay: shouldReduceMotion ? 0 : order < 2 ? order * 0.14 : 0.42 + (order - 2) * 0.14,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setMotionEnabled(!media.matches);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    return () => media.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let videoAnimationFrame = 0;
    let previousVideoTick = 0;
    let scrubbedTime = 0;
    let layoutWidth = 0;
    let layoutHeight = 0;

    const updateSceneLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const video = overhaulVideo.current;
      if (!video || (width === layoutWidth && height === layoutHeight)) return;
      layoutWidth = width;
      layoutHeight = height;
      const frame = getOverhaulFrame(width, height);
      const videoFrame = getDeploymentVideoFrame(width, height);
      for (const [background, backgroundFrame] of [
        [studioBackground.current, frame],
        [videoStudioBackground.current, videoFrame],
      ]) {
        if (!background) continue;
        const frameTop = backgroundFrame.centerY - backgroundFrame.height / 2;
        background.style.setProperty('--studio-top', `${frameTop}px`);
        background.style.setProperty(
          '--studio-quarter',
          `${frameTop + backgroundFrame.height * 0.25}px`
        );
        background.style.setProperty(
          '--studio-middle',
          `${frameTop + backgroundFrame.height * 0.5}px`
        );
        background.style.setProperty(
          '--studio-floor',
          `${frameTop + backgroundFrame.height * 0.75}px`
        );
        background.style.setProperty('--studio-bottom', `${frameTop + backgroundFrame.height}px`);
        background.style.setProperty(
          '--studio-left',
          `${backgroundFrame.centerX - backgroundFrame.width / 2}px`
        );
        background.style.setProperty(
          '--studio-right',
          `${backgroundFrame.centerX + backgroundFrame.width / 2}px`
        );
      }
      video.style.width = `${videoFrame.width}px`;
      video.style.height = `${videoFrame.height}px`;
      video.style.left = `${videoFrame.centerX}px`;
      video.style.top = `${videoFrame.centerY}px`;
    };

    const syncVideoFrame = timestamp => {
      videoAnimationFrame = 0;
      const video = overhaulVideo.current;
      if (!video || !videoHasFrame.current || !Number.isFinite(video.duration)) return;
      const elapsed = previousVideoTick
        ? Math.min((timestamp - previousVideoTick) / 1000, 0.05)
        : 1 / 60;
      previousVideoTick = timestamp;
      scrubbedTime = THREE.MathUtils.damp(scrubbedTime, desiredVideoTime.current, 12, elapsed);
      const targetTime = Math.min(
        Math.round(scrubbedTime / VIDEO_FRAME_DURATION) * VIDEO_FRAME_DURATION,
        Math.max(video.duration - VIDEO_FRAME_DURATION, 0)
      );
      if (
        !video.seeking &&
        Math.abs(targetTime - lastVideoTime.current) > VIDEO_FRAME_DURATION / 2
      ) {
        video.currentTime = targetTime;
        lastVideoTime.current = targetTime;
      }
      if (
        video.seeking ||
        Math.abs(scrubbedTime - desiredVideoTime.current) > VIDEO_FRAME_DURATION / 8
      ) {
        videoAnimationFrame = window.requestAnimationFrame(syncVideoFrame);
      } else {
        previousVideoTick = 0;
      }
    };

    const updateScrollProgress = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        if (!section.current) return;
        updateSceneLayout();
        const bounds = section.current.getBoundingClientRect();
        const scrollVH = THREE.MathUtils.clamp(
          (-bounds.top / window.innerHeight) * 100,
          0,
          LAPTOP_SCROLL_VH
        );
        const responseHoldVH = THREE.MathUtils.clamp(
          scrollVH - ORIGINAL_SCROLL_VH * LAPTOP_DEMO_END,
          0,
          AI_RESPONSE_HOLD_SCROLL_VH
        );
        const progress = THREE.MathUtils.clamp(
          (scrollVH - responseHoldVH) / ORIGINAL_SCROLL_VH,
          0,
          LAPTOP_STAGE_END
        );
        const entrance = THREE.MathUtils.clamp(
          (window.innerHeight - bounds.top) / Math.max(window.innerHeight * 0.72, 1),
          0,
          1
        );
        const laptopProgress = THREE.MathUtils.clamp(progress / LAPTOP_FOCUS_END, 0, 1);
        const retreat = THREE.MathUtils.clamp(
          (progress - LAPTOP_DEMO_END) / LAPTOP_RETREAT_DURATION,
          0,
          1
        );
        const videoBounds = videoSection.current?.getBoundingClientRect();
        const videoScrollVH = videoBounds ? (-videoBounds.top / window.innerHeight) * 100 : 0;
        const scrubProgress = THREE.MathUtils.clamp(
          (videoScrollVH - VIDEO_LEAD_IN_SCROLL_VH) / VIDEO_SCRUB_SCROLL_VH,
          0,
          1
        );
        const videoActive = Boolean(
          videoBounds &&
          videoBounds.top < window.innerHeight - 1 &&
          videoBounds.bottom > 1 &&
          videoHasFrame.current
        );
        scrollProgress.current = laptopProgress;
        demoProgress.current = THREE.MathUtils.clamp(
          (progress - LAPTOP_FOCUS_END) / (LAPTOP_DEMO_END - LAPTOP_FOCUS_END),
          0,
          1
        );
        entryProgress.current = entrance;
        retreatProgress.current = retreat;
        videoProgress.current = scrubProgress;

        if (videoLayer.current) {
          videoLayer.current.style.visibility = videoActive ? 'visible' : 'hidden';
        }
        if (videoStageActive.current !== videoActive) {
          videoStageActive.current = videoActive;
          setIsVideoStage(videoActive);
          if (videoActive) {
            applyStudioColors(videoStudioBackground.current, overhaulVideo.current.currentTime);
          }
        }
        applyStudioColors(studioBackground.current);
        if (!videoActive) applyStudioColors(videoStudioBackground.current);

        const video = overhaulVideo.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          const availableDuration = Math.max(
            video.duration - OVERHAUL_START_TIME - VIDEO_FRAME_DURATION,
            0
          );
          desiredVideoTime.current = OVERHAUL_START_TIME + scrubProgress * availableDuration;
          if (!videoAnimationFrame && videoHasFrame.current) {
            videoAnimationFrame = window.requestAnimationFrame(syncVideoFrame);
          }
        }

        if (groundShadow.current && bounds.top < window.innerHeight && bounds.bottom > 0) {
          groundShadow.current.style.opacity = String(
            Math.max(0, 0.28 * entrance * (1 - laptopProgress * 2.2) * (1 - retreat))
          );
          groundShadow.current.style.transform = `translateX(-50%) scale(${(0.58 + entrance * 0.42) * (1 - laptopProgress * 0.12)})`;
        }
      });
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(videoAnimationFrame);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <>
      <div
        ref={section}
        className="relative w-full bg-white"
        style={{ height: `${100 + LAPTOP_SCROLL_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          <StudioBackground backgroundRef={studioBackground} />
          <div
            ref={groundShadow}
            aria-hidden="true"
            className="pointer-events-none absolute top-[79%] left-[38%] z-[5] h-[7%] w-[38%] max-w-[760px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(5,16,38,0.5)_0%,rgba(20,56,110,0.2)_42%,transparent_74%)] blur-[10px] max-sm:top-[74%] max-sm:left-1/2 max-sm:w-[72%]"
            style={{ opacity: 0, transform: 'translateX(-50%) scale(0.78)' }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{ visibility: isVideoStage ? 'hidden' : 'visible' }}
          >
            <Canvas
              aria-hidden="true"
              frameloop={isVideoStage || !isLaptopVisible ? 'never' : 'always'}
              camera={{ position: PORTFOLIO_CAMERA_START, fov: 55, near: 0.1, far: 200 }}
              dpr={[1, 1.65]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <LaptopModel
                  motionEnabled={motionEnabled}
                  scrollProgress={scrollProgress}
                  entryProgress={entryProgress}
                  demoProgress={demoProgress}
                  retreatProgress={retreatProgress}
                />
              </Suspense>
            </Canvas>
          </div>

          <Motion.aside
            aria-label="ONDAM AI 솔루션"
            className="absolute top-1/2 right-8 z-20 hidden w-[clamp(20rem,28vw,30rem)] -translate-y-1/2 xl:block min-[1600px]:right-[calc((100vw-1600px)/2)]"
            style={{ pointerEvents: menuPointerEvents }}
          >
            <DesktopSolutionMenu
              scrollProgress={laptopFocusProgress}
              motionEnabled={motionEnabled}
            />
          </Motion.aside>
          <LaptopRetreatCopy
            retreatProgress={laptopRetreatProgress}
            motionEnabled={motionEnabled}
          />
        </div>
      </div>

      <section
        id="solution-transition"
        aria-labelledby="on-premise-title"
        className="relative flex min-h-svh w-full items-center justify-center bg-white px-6 pt-[var(--site-header-height)] pb-16 text-center sm:px-8"
      >
        <Motion.div
          className="mx-auto w-full max-w-[1280px]"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.55 }}
        >
          <h2
            id="on-premise-title"
            className="text-[clamp(2.5rem,5.8vw,6.6rem)] leading-[1.12] font-semibold tracking-[-0.06em] text-slate-950 [text-wrap:balance]"
          >
            <span className="block overflow-hidden">
              <Motion.span className="block" variants={introductionLineVariants} custom={0}>
                기업의 <span className="text-[#0b5cff]">AI</span>를,
              </Motion.span>
            </span>
            <span className="mt-[0.08em] block overflow-hidden">
              <Motion.span className="block" variants={introductionLineVariants} custom={1}>
                기업의 환경 안에.
              </Motion.span>
            </span>
          </h2>
          <p className="mt-8 text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.02em] text-slate-600">
            <span className="block overflow-hidden">
              <Motion.span className="block" variants={introductionLineVariants} custom={2}>
                기업 환경에 맞춘 온프레미스 구축.
              </Motion.span>
            </span>
            <span className="block overflow-hidden">
              <Motion.span className="block" variants={introductionLineVariants} custom={3}>
                필요한 모듈 도입부터 운영·업데이트까지.
              </Motion.span>
            </span>
          </p>
        </Motion.div>
      </section>

      <section
        ref={videoSection}
        aria-label="ONDAM AI 인프라 영상"
        className="relative w-full bg-white"
        style={{
          height: `${100 + VIDEO_LEAD_IN_SCROLL_VH + VIDEO_SCRUB_SCROLL_VH + VIDEO_END_HOLD_SCROLL_VH}vh`,
        }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          <StudioBackground backgroundRef={videoStudioBackground} />
          <div
            ref={videoLayer}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15]"
            style={{ visibility: 'hidden' }}
          >
            <video
              ref={overhaulVideo}
              muted
              playsInline
              preload="auto"
              src="/videos/overhaul-scroll-smooth.mp4"
              className="absolute top-[51%] left-[37%] aspect-video w-[53.68vw] -translate-x-1/2 -translate-y-1/2 object-contain max-sm:top-1/2 max-sm:left-1/2 max-sm:w-[80.96vw]"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent), linear-gradient(to bottom, transparent, black 2px, black calc(100% - 14px), transparent)',
                maskComposite: 'intersect',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent), linear-gradient(to bottom, transparent, black 2px, black calc(100% - 14px), transparent)',
                WebkitMaskComposite: 'source-in',
              }}
              onLoadedData={() => {
                if (videoHasFrame.current) return;
                videoHasFrame.current = true;
                window.dispatchEvent(new Event('scroll'));
              }}
              onSeeked={event => {
                if (videoStageActive.current) {
                  applyStudioColors(videoStudioBackground.current, event.currentTarget.currentTime);
                }
              }}
              onLoadedMetadata={event => {
                const video = event.currentTarget;
                video.pause();
                const availableDuration = Math.max(
                  video.duration - OVERHAUL_START_TIME - VIDEO_FRAME_DURATION,
                  0
                );
                const targetTime = OVERHAUL_START_TIME + videoProgress.current * availableDuration;
                desiredVideoTime.current = targetTime;
                video.currentTime = targetTime;
                lastVideoTime.current = targetTime;
              }}
            />
          </div>

          <Motion.aside
            aria-labelledby="on-premise-deployment-title"
            className="solution-stage-copy pointer-events-none absolute top-[55%] right-6 left-6 z-20"
            style={videoCopyRevealStyle}
          >
            <div className="mx-auto max-w-[560px] lg:max-w-none">
              <h3
                id="on-premise-deployment-title"
                className="text-[clamp(1.5rem,1.75vw,2rem)] leading-[1.45] font-bold tracking-[-0.04em] text-balance break-keep text-slate-950 max-lg:text-xl [@media(max-height:640px)]:text-lg"
              >
                <span className="block">
                  온담 AI는 <span className="text-[#0b5cff]">온프레미스</span>
                  <span className="ml-1 text-[0.7em] font-medium tracking-[-0.02em] text-slate-500">
                    (On-Premise)
                  </span>{' '}
                  방식으로
                </span>
                <span className="block">기업 내부에 직접 구축됩니다.</span>
              </h3>
              <p className="mt-6 text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.02em] break-keep text-slate-600 max-lg:text-base [@media(max-height:640px)]:mt-3 [@media(max-height:640px)]:text-sm [@media(max-height:640px)]:leading-[1.65]">
                <span className="block">기존 보안 체계에 맞춰 독립적으로 운영하며,</span>
                <span className="block">서비스 접근 통제와 사용 이력을 통합 관리합니다.</span>
              </p>
            </div>
          </Motion.aside>
        </div>
      </section>
    </>
  );
}

useLoader.preload(GLTFLoader, '/models/macbook.glb');
