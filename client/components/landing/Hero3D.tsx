import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FloatingSpheres({ count = 40 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => [
    new THREE.Color("#10b981"),
    new THREE.Color("#34d399"),
    new THREE.Color("#14b8a6"),
  ], []);

  const offsets = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 6,
      s: 0.2 + Math.random() * 0.6,
      r: Math.random() * Math.PI * 2,
      c: colors[i % colors.length],
      sp: 0.2 + Math.random() * 0.6,
    })),
  [count, colors]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    offsets.forEach((o, i) => {
      const y = o.y + Math.sin(t * o.sp + i) * 0.3;
      dummy.position.set(o.x, y, o.z);
      dummy.scale.setScalar(o.s);
      dummy.rotation.set(Math.sin(t*0.3 + i), o.r + t*0.2, Math.cos(t*0.2 + i));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, o.c);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, count]}>
      <icosahedronGeometry args={[0.4, 1]} />
      <meshStandardMaterial roughness={0.6} metalness={0.15} vertexColors />
    </instancedMesh>
  );
}

export default function Hero3D() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <color attach="background" args={["#f0fdf4"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={0.7} />
        <directionalLight position={[-2, -3, -2]} intensity={0.3} />
        <FloatingSpheres count={42} />
      </Canvas>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
