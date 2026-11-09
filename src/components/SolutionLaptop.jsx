import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PORTFOLIO_CAMERA_START = [-35.7, 0.7, 41.9];
const DISPLAY_WORLD_CENTER = [0, 8.72, -10.2];
const FOCUSED_CAMERA_DESKTOP = [0, 8.72, 10];
const FOCUSED_CAMERA_MOBILE = [0, 8.72, 22];

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

function LaptopModel({ motionEnabled, scrollProgress }) {
  const group = useRef(null);
  const cameraLookAt = useRef(new THREE.Vector3(10, 3, 0));
  const cameraDestination = useRef(new THREE.Vector3());
  const lookAtDestination = useRef(new THREE.Vector3());
  const focusProgress = useRef(0);
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
    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(28.1, 16.7),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
    );
    display.name = 'ondam-dashboard-display';
    display.position.set(0, 9.62, -14.12);
    display.rotation.x = -0.33;
    display.renderOrder = 10;
    trackingNode.add(display);

    return { scene: clonedScene };
  }, [gltf.scene, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    focusProgress.current = motionEnabled
      ? THREE.MathUtils.damp(focusProgress.current, scrollProgress.current, 5, delta)
      : scrollProgress.current;
    const progress = THREE.MathUtils.smoothstep(focusProgress.current, 0, 1);
    const isMobile = state.size.width < 640;
    const focusedCamera = isMobile ? FOCUSED_CAMERA_MOBILE : FOCUSED_CAMERA_DESKTOP;
    const cameraPosition = cameraDestination.current.set(
      THREE.MathUtils.lerp(
        isMobile ? -25 : PORTFOLIO_CAMERA_START[0],
        focusedCamera[0],
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 1 : PORTFOLIO_CAMERA_START[1],
        focusedCamera[1],
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 48 : PORTFOLIO_CAMERA_START[2],
        focusedCamera[2],
        progress
      )
    );
    const lookAtPosition = lookAtDestination.current.set(
      THREE.MathUtils.lerp(isMobile ? 6 : 10, DISPLAY_WORLD_CENTER[0], progress),
      THREE.MathUtils.lerp(3, DISPLAY_WORLD_CENTER[1], progress),
      THREE.MathUtils.lerp(0, DISPLAY_WORLD_CENTER[2], progress)
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
    <group ref={group} rotation={[0.335, 0, 0]} position={[0, -5, 0]} scale={100}>
      <primitive object={rig.scene} />
    </group>
  );
}

export default function SolutionLaptop() {
  const section = useRef(null);
  const groundShadow = useRef(null);
  const message = useRef(null);
  const scrollProgress = useRef(0);
  const [motionEnabled, setMotionEnabled] = useState(true);

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
        scrollProgress.current = progress;

        if (groundShadow.current) {
          groundShadow.current.style.opacity = String(Math.max(0, 0.28 * (1 - progress * 2.2)));
          groundShadow.current.style.transform = `translateX(-50%) scale(${1 - progress * 0.12})`;
        }

        if (message.current) {
          message.current.style.opacity = String(Math.max(0, 1 - progress * 2.4));
          message.current.style.transform = `translateY(-50%) translateX(${progress * 44}px)`;
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
    <div ref={section} className="relative h-[200vh] w-full">
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
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 48%, black 100%)',
              transform: 'perspective(720px) rotateX(56deg) scale(1.18)',
            }}
          />
        </div>
        <div
          ref={groundShadow}
          aria-hidden="true"
          className="pointer-events-none absolute top-[79%] left-[38%] z-[5] h-[7%] w-[38%] max-w-[760px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(5,16,38,0.5)_0%,rgba(20,56,110,0.2)_42%,transparent_74%)] blur-[10px] max-sm:top-[74%] max-sm:left-1/2 max-sm:w-[72%]"
          style={{ opacity: 0.28, transform: 'translateX(-50%)' }}
        />
        <div
          ref={message}
          className="pointer-events-none absolute top-1/2 right-[8%] z-20 hidden w-[34%] max-w-[520px] -translate-y-1/2 sm:block"
        >
          <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-blue-600">
            ENTERPRISE AI CONTROL CENTER
          </p>
          <h1 className="text-[clamp(2.3rem,3.7vw,4.8rem)] leading-[1.08] font-semibold tracking-[-0.055em] text-slate-950">
            기업의 AI를
            <br />
            발견하고, 통제하고,
            <br />
            관리합니다.
          </h1>
          <p className="mt-7 max-w-[470px] text-[clamp(1rem,1.15vw,1.25rem)] leading-8 text-slate-600">
            Discover부터 Control, Manage까지.
            <br />
            신뢰할 수 있는 AI 활용 환경을 만듭니다.
          </p>
        </div>
        <Canvas
          aria-hidden="true"
          className="relative z-10"
          camera={{ position: PORTFOLIO_CAMERA_START, fov: 55, near: 0.1, far: 200 }}
          dpr={[1, 1.65]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <LaptopModel
              motionEnabled={motionEnabled}
              scrollProgress={scrollProgress}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

useLoader.preload(GLTFLoader, '/models/macbook.glb');
