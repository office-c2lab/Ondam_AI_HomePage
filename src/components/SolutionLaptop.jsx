import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PORTFOLIO_CAMERA_START = [-30.52, 0.97, 37.15];
const PORTFOLIO_LOOK_AT_START = [14, 3, 0];
const DISPLAY_WORLD_CENTER = [0, 8.72, -10.2];
const FOCUSED_CAMERA_DESKTOP = [0, 8.72, 14];
const FOCUSED_CAMERA_MOBILE = [0, 8.72, 26];
const OVERHAUL_START_TIME = 0;
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
  const exitStart = 0.13 + index * 0.06;
  const opacity = useTransform(scrollProgress, [exitStart, exitStart + 0.08], [1, 0]);
  const x = useTransform(scrollProgress, [exitStart, exitStart + 0.08], [0, 42]);

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
        style={{ opacity, x: motionEnabled ? x : 0 }}
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
  const titleOpacity = useTransform(scrollProgress, [0.07, 0.15], [1, 0]);
  const titleX = useTransform(scrollProgress, [0.07, 0.15], [0, 42]);

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
  const lastDemoProgress = useRef(-1);
  const cameraLookAt = useRef(new THREE.Vector3(...PORTFOLIO_LOOK_AT_START));
  const cameraDestination = useRef(new THREE.Vector3());
  const lookAtDestination = useRef(new THREE.Vector3());
  const focusProgress = useRef(0);
  const entryMotion = useRef(0);
  const gltf = useLoader(GLTFLoader, '/models/macbook.glb');
  const texture = useMemo(() => makeLogoTexture(), []);
  const rig = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    clonedScene.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.material = Array.isArray(object.material)
        ? object.material.map(makeUnlitMaterial)
        : makeUnlitMaterial(object.material);
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
    trackingNode.add(display);

    return { scene: clonedScene, logoMaterial };
  }, [gltf.scene, texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    logoMaterial.current = rig.logoMaterial;
    return () => {
      logoMaterial.current = null;
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
    const retreatedCamera = isMobile ? [-22, 1, 42] : PORTFOLIO_CAMERA_START;
    const retreatedLookAt = isMobile ? [8, 3, 0] : PORTFOLIO_LOOK_AT_START;
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

    if (motionEnabled) {
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

    state.camera.lookAt(cameraLookAt.current);
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

export default function SolutionLaptop() {
  const section = useRef(null);
  const groundShadow = useRef(null);
  const canvasLayer = useRef(null);
  const videoLayer = useRef(null);
  const overhaulVideo = useRef(null);
  const scrollProgress = useRef(0);
  const demoProgress = useRef(0);
  const entryProgress = useRef(0);
  const retreatProgress = useRef(0);
  const videoProgress = useRef(0);
  const desiredVideoTime = useRef(0);
  const lastVideoTime = useRef(-1);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  });
  const menuPointerEvents = useTransform(scrollYProgress, value => (value > 0.4 ? 'none' : 'auto'));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setMotionEnabled(!media.matches);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    return () => media.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollProgress = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        if (!section.current) return;
        const bounds = section.current.getBoundingClientRect();
        const scrollDistance = section.current.offsetHeight - window.innerHeight;
        const progress = THREE.MathUtils.clamp(
          scrollDistance > 0 ? -bounds.top / scrollDistance : 0,
          0,
          1
        );
        const entrance = THREE.MathUtils.clamp(
          (window.innerHeight - bounds.top) / Math.max(window.innerHeight * 0.72, 1),
          0,
          1
        );
        const laptopProgress = THREE.MathUtils.clamp(progress / 0.24, 0, 1);
        const retreat = THREE.MathUtils.clamp((progress - 0.58) / 0.14, 0, 1);
        const canvasExit = THREE.MathUtils.smootherstep(
          THREE.MathUtils.clamp((progress - 0.7) / 0.035, 0, 1),
          0,
          1
        );
        const videoReveal = THREE.MathUtils.smootherstep(
          THREE.MathUtils.clamp((progress - 0.745) / 0.055, 0, 1),
          0,
          1
        );
        const scrubProgress = THREE.MathUtils.clamp((progress - 0.8) / 0.2, 0, 1);
        scrollProgress.current = laptopProgress;
        demoProgress.current = THREE.MathUtils.clamp((progress - 0.24) / 0.34, 0, 1);
        entryProgress.current = entrance;
        retreatProgress.current = retreat;
        videoProgress.current = scrubProgress;

        if (canvasLayer.current) {
          canvasLayer.current.style.opacity = String(1 - canvasExit);
        }
        if (videoLayer.current) {
          videoLayer.current.style.opacity = String(canvasExit);
        }

        if (overhaulVideo.current) {
          const video = overhaulVideo.current;
          video.style.opacity = String(videoReveal);
          video.style.scale = String(0.965 + videoReveal * 0.035);
          if (Number.isFinite(video.duration) && video.duration > 0) {
            const frameDuration = 1 / 24;
            const availableDuration = Math.max(
              video.duration - OVERHAUL_START_TIME - frameDuration,
              0
            );
            const targetTime = Math.min(
              Math.round(
                (OVERHAUL_START_TIME + scrubProgress * availableDuration) / frameDuration
              ) * frameDuration,
              Math.max(video.duration - frameDuration, 0)
            );
            desiredVideoTime.current = targetTime;
            if (!video.seeking && Math.abs(targetTime - lastVideoTime.current) >= frameDuration) {
              video.currentTime = targetTime;
              lastVideoTime.current = targetTime;
            }
          }
        }

        if (groundShadow.current) {
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
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div ref={section} className="relative h-[720vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_58%_at_50%_72%,rgba(37,99,235,0.16)_0%,rgba(96,165,250,0.07)_40%,transparent_72%)]" />
          <div
            className="absolute -bottom-[16%] -left-[10%] h-[58%] w-[120%] origin-bottom opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(59, 130, 246, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.14) 1px, transparent 1px)',
              backgroundSize: '64px 42px',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 48%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 48%, black 100%)',
              transform: 'perspective(720px) rotateX(56deg) scale(1.18)',
            }}
          />
        </div>
        <div
          ref={groundShadow}
          aria-hidden="true"
          className="pointer-events-none absolute top-[79%] left-[38%] z-[5] h-[7%] w-[38%] max-w-[760px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(5,16,38,0.5)_0%,rgba(20,56,110,0.2)_42%,transparent_74%)] blur-[10px] max-sm:top-[74%] max-sm:left-1/2 max-sm:w-[72%]"
          style={{ opacity: 0, transform: 'translateX(-50%) scale(0.78)' }}
        />
        <div
          ref={canvasLayer}
          className="absolute inset-0 z-10"
          style={{ opacity: 1, willChange: 'opacity' }}
        >
          <Canvas
            aria-hidden="true"
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

        <div
          ref={videoLayer}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] bg-[#f8fbff]"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          <video
            ref={overhaulVideo}
            muted
            playsInline
            preload="auto"
            src="/videos/overhaul-scroll.mp4"
            className="absolute top-[51%] left-[37%] aspect-video w-[61vw] -translate-x-1/2 -translate-y-1/2 object-contain max-sm:top-1/2 max-sm:left-1/2 max-sm:w-[92vw]"
            style={{ opacity: 0, scale: 0.965, willChange: 'opacity, scale' }}
            onLoadedMetadata={event => {
              const video = event.currentTarget;
              video.pause();
              const frameDuration = 1 / 24;
              const availableDuration = Math.max(
                video.duration - OVERHAUL_START_TIME - frameDuration,
                0
              );
              const targetTime = OVERHAUL_START_TIME + videoProgress.current * availableDuration;
              desiredVideoTime.current = targetTime;
              video.currentTime = targetTime;
              lastVideoTime.current = targetTime;
            }}
            onSeeked={event => {
              const video = event.currentTarget;
              const frameDuration = 1 / 24;
              if (Math.abs(video.currentTime - desiredVideoTime.current) >= frameDuration) {
                video.currentTime = desiredVideoTime.current;
                lastVideoTime.current = desiredVideoTime.current;
              }
            }}
          />
        </div>

        <Motion.aside
          aria-label="ONDAM AI 솔루션"
          className="absolute top-1/2 right-8 z-20 hidden w-[clamp(20rem,28vw,30rem)] -translate-y-1/2 xl:block min-[1600px]:right-[calc((100vw-1600px)/2)]"
          style={{ pointerEvents: menuPointerEvents }}
        >
          <DesktopSolutionMenu scrollProgress={scrollYProgress} motionEnabled={motionEnabled} />
        </Motion.aside>
      </div>
    </div>
  );
}

useLoader.preload(GLTFLoader, '/models/macbook.glb');
