import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const COMBINED_SHELL_NODE_NAME = 'HzLAtwpaEQrTUta';
const CLOSED_LID_ANGLE = 1.9;
const HINGE_Z = -10.7;
const PORTFOLIO_CAMERA_START = [-30.52, 0.97, 37.15];
const DISPLAY_WORLD_CENTER = [0, 8.72, -10.2];
const FOCUSED_CAMERA_DESKTOP = [0, 8.72, 10];
const FOCUSED_CAMERA_MOBILE = [0, 8.72, 22];

function filterGeometryTriangles(geometry, shouldInclude) {
  const position = geometry.attributes.position;
  const sourceIndices = geometry.index
    ? Array.from(geometry.index.array)
    : Array.from({ length: position.count }, (_, index) => index);
  const filteredIndices = [];

  for (let index = 0; index < sourceIndices.length; index += 3) {
    const a = sourceIndices[index];
    const b = sourceIndices[index + 1];
    const c = sourceIndices[index + 2];
    const averageY = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;

    if (shouldInclude(averageY)) filteredIndices.push(a, b, c);
  }

  const filteredGeometry = geometry.clone();
  filteredGeometry.setIndex(filteredIndices);
  filteredGeometry.computeBoundingBox();
  filteredGeometry.computeBoundingSphere();
  return filteredGeometry;
}

function PortfolioEnvironment() {
  const environment = useLoader(EXRLoader, '/interior/st_fagans_interior_1k.exr');
  const { scene } = useThree();

  useEffect(() => {
    const previousEnvironment = scene.environment;
    const previousBackground = scene.background;
    const previousBackgroundBlurriness = scene.backgroundBlurriness;

    environment.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = environment;
    scene.background = environment;
    scene.backgroundBlurriness = 1;

    return () => {
      scene.environment = previousEnvironment;
      scene.background = previousBackground;
      scene.backgroundBlurriness = previousBackgroundBlurriness;
    };
  }, [environment, scene]);

  return null;
}

function makeDashboardTexture(activeSolution) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const context = canvas.getContext('2d');

  const gradient = context.createLinearGradient(0, 0, 1600, 1000);
  gradient.addColorStop(0, '#06142e');
  gradient.addColorStop(0.54, '#0a2455');
  gradient.addColorStop(1, '#075df6');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1600, 1000);

  context.fillStyle = 'rgba(255, 255, 255, 0.06)';
  context.fillRect(0, 0, 232, 1000);
  context.fillStyle = '#ffffff';
  context.font = '700 46px Arial';
  context.fillText('ONDAM AI', 54, 80);
  context.font = '500 22px Arial';
  ['Overview', 'Discover', 'Control', 'Manage'].forEach((label, index) => {
    const y = 186 + index * 82;
    if (label === activeSolution || (activeSolution.startsWith('Control') && label === 'Control')) {
      context.fillStyle = 'rgba(61, 150, 255, 0.28)';
      context.beginPath();
      context.roundRect(28, y - 40, 176, 58, 15);
      context.fill();
    }
    context.fillStyle = 'rgba(255,255,255,0.82)';
    context.fillText(label, 54, y);
  });

  context.fillStyle = '#ffffff';
  context.font = '700 58px Arial';
  context.fillText(activeSolution, 302, 126);
  context.fillStyle = 'rgba(217, 232, 255, 0.72)';
  context.font = '400 25px Arial';
  context.fillText('Enterprise AI Control Center', 304, 170);
  context.fillStyle = 'rgba(98, 193, 255, 0.18)';
  context.beginPath();
  context.roundRect(1162, 92, 226, 54, 27);
  context.fill();
  context.fillStyle = '#8fd2ff';
  context.font = '700 19px Arial';
  context.fillText('ILLUSTRATIVE VIEW', 1192, 126);

  const cardPositions = [302, 682, 1062];
  cardPositions.forEach((x, index) => {
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.roundRect(x, 224, 326, 184, 24);
    context.fill();
    context.fillStyle = 'rgba(255,255,255,0.62)';
    context.font = '500 21px Arial';
    context.fillText(['Connected services', 'Policy status', 'Risk monitoring'][index], x + 30, 274);
    context.fillStyle = '#ffffff';
    context.font = '700 40px Arial';
    context.fillText(['Unified', 'Protected', 'Live'][index], x + 30, 342);
  });

  context.fillStyle = 'rgba(255, 255, 255, 0.1)';
  context.beginPath();
  context.roundRect(302, 452, 1086, 438, 24);
  context.fill();
  context.fillStyle = 'rgba(255,255,255,0.72)';
  context.font = '600 23px Arial';
  context.fillText('AI activity overview', 336, 504);

  context.strokeStyle = 'rgba(255,255,255,0.12)';
  context.lineWidth = 2;
  for (let index = 0; index < 4; index += 1) {
    const y = 582 + index * 78;
    context.beginPath();
    context.moveTo(336, y);
    context.lineTo(1346, y);
    context.stroke();
  }

  const points = [760, 708, 734, 648, 676, 584, 622, 548, 570, 512, 536];
  context.strokeStyle = '#62c1ff';
  context.lineWidth = 8;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  points.forEach((y, index) => {
    const x = 356 + index * 96;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;
  return texture;
}

function LaptopModel({ activeSolution, motionEnabled, isFocused, onFocus, onBlur }) {
  const group = useRef(null);
  const cameraLookAt = useRef(new THREE.Vector3(10, 3, 0));
  const cameraDestination = useRef(new THREE.Vector3());
  const lookAtDestination = useRef(new THREE.Vector3());
  const focusProgress = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const gltf = useLoader(GLTFLoader, '/models/macbook.glb');
  const texture = useMemo(() => makeDashboardTexture(activeSolution), [activeSolution]);
  const rig = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const lidMeshes = [];
    const combinedShell = clonedScene.getObjectByName(COMBINED_SHELL_NODE_NAME);

    if (combinedShell?.isMesh) {
      const baseGeometry = filterGeometryTriangles(combinedShell.geometry, y => y <= 2);
      const lidGeometry = filterGeometryTriangles(combinedShell.geometry, y => y > 2);
      combinedShell.geometry = baseGeometry;

      const lidShell = new THREE.Mesh(lidGeometry, combinedShell.material);
      lidShell.name = `${COMBINED_SHELL_NODE_NAME}-lid`;
      lidShell.castShadow = false;
      lidShell.receiveShadow = false;
      combinedShell.parent.add(lidShell);
      lidMeshes.push(lidShell);
    }

    clonedScene.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;

      if (object.name !== COMBINED_SHELL_NODE_NAME && object.name !== `${COMBINED_SHELL_NODE_NAME}-lid`) {
        object.geometry.computeBoundingBox();
        if (object.geometry.boundingBox.max.y > 5) lidMeshes.push(object);
      }
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
    lidMeshes.push(display);

    const lidPivot = new THREE.Group();
    lidPivot.name = 'laptop-lid-hinge';
    lidPivot.position.set(0, 0, HINGE_Z);
    trackingNode.add(lidPivot);
    clonedScene.updateMatrixWorld(true);
    lidMeshes.forEach(mesh => lidPivot.attach(mesh));
    lidPivot.rotation.x = CLOSED_LID_ANGLE;

    return { scene: clonedScene, lidPivot };
  }, [gltf.scene, texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    if (!motionEnabled) {
      setIsOpen(true);
      return undefined;
    }

    setIsOpen(false);
    const openTimer = window.setTimeout(() => setIsOpen(true), 320);
    return () => window.clearTimeout(openTimer);
  }, [motionEnabled, rig]);

  useFrame((state, delta) => {
    const targetAngle = isOpen ? 0 : CLOSED_LID_ANGLE;
    rig.lidPivot.rotation.x = motionEnabled
      ? THREE.MathUtils.damp(rig.lidPivot.rotation.x, targetAngle, 4.8, delta)
      : targetAngle;

    focusProgress.current = motionEnabled
      ? THREE.MathUtils.damp(focusProgress.current, isFocused ? 1 : 0, 3, delta)
      : isFocused
        ? 1
        : 0;
    const progress = THREE.MathUtils.smoothstep(focusProgress.current, 0, 1);
    const isMobile = state.size.width < 640;
    const focusedCamera = isMobile ? FOCUSED_CAMERA_MOBILE : FOCUSED_CAMERA_DESKTOP;
    const cameraPosition = cameraDestination.current.set(
      THREE.MathUtils.lerp(
        isMobile ? -22 : PORTFOLIO_CAMERA_START[0],
        focusedCamera[0],
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 1 : PORTFOLIO_CAMERA_START[1],
        focusedCamera[1],
        progress
      ),
      THREE.MathUtils.lerp(
        isMobile ? 42 : PORTFOLIO_CAMERA_START[2],
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
    <group
      ref={group}
      rotation={[0.335, 0, 0]}
      position={[0, -5, 0]}
      scale={100}
      onPointerDown={event => {
        event.stopPropagation();
        setIsOpen(true);
        onFocus();
      }}
      onPointerMissed={onBlur}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    >
      <primitive object={rig.scene} />
    </group>
  );
}

export default function SolutionLaptop({ activeSolution }) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setMotionEnabled(!media.matches);
    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    return () => media.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <p
        className={`pointer-events-none absolute top-1/2 right-[23%] z-10 hidden w-[250px] -translate-y-1/2 font-sans text-xl font-normal text-[#171717] transition-[opacity,transform] duration-500 sm:block ${
          isFocused ? 'translate-x-7 opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        Click to use the Macbook
      </p>
      <Canvas
        aria-hidden="true"
        camera={{ position: PORTFOLIO_CAMERA_START, fov: 55, near: 0.1, far: 200 }}
        dpr={[1, 1.65]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <PortfolioEnvironment />
          <LaptopModel
            activeSolution={activeSolution}
            motionEnabled={motionEnabled}
            isFocused={isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useLoader.preload(GLTFLoader, '/models/macbook.glb');
