import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

type Product3DViewerProps = {
  modelUrl: string;
  materialColor?: string;
  productName: string;
};

type GLTFurnitureProps = {
  modelUrl: string;
  materialColor: string;
};

const GLTFurniture = ({
  modelUrl,
  materialColor,
}: GLTFurnitureProps) => {
  const { scene } = useGLTF(modelUrl);

  const clonedScene = scene.clone(true);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => {
          const clonedMaterial = material.clone();

          if ("color" in clonedMaterial) {
            clonedMaterial.color.set(materialColor);
          }

          return clonedMaterial;
        });
      } else {
        const material = child.material.clone();

        if ("color" in material) {
          material.color.set(materialColor);
        }

        child.material = material;
      }
    });
  }, [clonedScene, materialColor]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
};

const Product3DViewer = ({
  modelUrl,
  materialColor = "#9a6a42",
  productName,
}: Product3DViewerProps) => {
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    controlsRef.current?.reset();
  };

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-black/[0.04] via-white to-black/[0.08]">
      <div className="absolute left-5 top-5 z-10">
        <div className="rounded-full border border-black/5 bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600 shadow-sm backdrop-blur">
          Interactive 3D
        </div>
      </div>

      <button
        type="button"
        onClick={resetCamera}
        className="absolute right-5 top-5 z-10 rounded-full border border-black/5 bg-white/85 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur transition hover:bg-white"
      >
        Reset view
      </button>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[4, 3, 5]}
          fov={40}
        />

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 7, 5]}
          intensity={3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <directionalLight
          position={[-4, 4, -3]}
          intensity={1.2}
        />

        <Environment preset="studio" />

        <Suspense fallback={null}>
          <GLTFurniture
            modelUrl={modelUrl}
            materialColor={materialColor}
          />
        </Suspense>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.14} />
        </mesh>

        <ContactShadows
          position={[0, -1.04, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={4}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={7}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-black/5 bg-white/85 px-4 py-2 text-xs text-gray-500 shadow-sm backdrop-blur">
        Drag to rotate · Scroll to zoom
      </div>

      <span className="sr-only">
        Interactive 3D view of {productName}. Drag to rotate and scroll to
        zoom.
      </span>
    </div>
  );
};

export default Product3DViewer;