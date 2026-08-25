import { Suspense, useEffect, useMemo } from "react";
import {
  Canvas,
  useLoader,
} from "@react-three/fiber";
import {
  Center,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Product3DViewerProps = {
  modelUrl: string;
  productName: string;
  materialColor?: string;
};

type ProductModelProps = {
  url: string;
  materialColor?: string;
};

const ProductModel = ({
  url,
  materialColor,
}: ProductModelProps) => {
  const gltf = useLoader(GLTFLoader, url);

  const scene = useMemo(
    () => gltf.scene.clone(true),
    [gltf.scene],
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh
      ) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (materialColor) {
          const material = child.material;

          if (
            material instanceof
            THREE.MeshStandardMaterial
          ) {
            material.color.set(
              materialColor,
            );
          }
        }
      }
    });
  }, [scene, materialColor]);

  return (
    <Center
      top
      bottom
      left
      right
      front
      back
    >
      <primitive object={scene} />
    </Center>
  );
};

const Product3DViewer = ({
  modelUrl,
  productName,
  materialColor,
}: Product3DViewerProps) => {
  return (
    <div className="relative h-[480px] overflow-hidden rounded-3xl bg-gradient-to-br from-black/[0.04] via-white to-black/[0.08]">
      <Canvas
        shadows
        camera={{
          position: [3, 2, 4],
          fov: 35,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />

        <directionalLight
          position={[4, 6, 4]}
          intensity={2}
          castShadow
        />

        <directionalLight
          position={[-4, 3, -2]}
          intensity={0.8}
        />

        <Suspense fallback={null}>
          <Environment preset="studio" />

          <ProductModel
            url={modelUrl}
            materialColor={materialColor}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={8}
          target={[0, 0, 0]}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-black/5 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600 shadow-sm backdrop-blur">
        3D Preview
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs text-gray-500 shadow-sm backdrop-blur">
        Drag to rotate · Scroll to zoom
      </div>

      <span className="sr-only">
        Interactive 3D model of {productName}
      </span>
    </div>
  );
};

export default Product3DViewer;