"use client";

import { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Helper component to add edges to a mesh
function Edges({
  geometry,
  position,
  rotation,
}: {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const edges = new THREE.EdgesGeometry(geometry);
  return (
    <lineSegments geometry={edges} position={position} rotation={rotation}>
      <lineBasicMaterial color="#000000" linewidth={3} />
    </lineSegments>
  );
}

// Bullet train component - stays static while world moves
function BulletTrain() {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Train body - main section */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.8, 0.6]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.BoxGeometry(3, 0.8, 0.6)}
        position={[0, 0.5, 0]}
      />

      {/* Windows */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.7, 0.31]}>
            <boxGeometry args={[0.4, 0.3, 0.02]} />
            <meshStandardMaterial color="#E7E5E3" />
          </mesh>
          <Edges
            geometry={new THREE.BoxGeometry(0.4, 0.3, 0.02)}
            position={[x, 0.7, 0.31]}
          />
        </group>
      ))}

      {/* Wheels */}
      {[-1, 0, 1].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.2, 0.32]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial color="#E7E5E3" />
          </mesh>
          <Edges
            geometry={new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16)}
            position={[x, 0.2, 0.32]}
          />
          <mesh position={[x, 0.2, -0.32]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial color="#E7E5E3" />
          </mesh>
          <Edges
            geometry={new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16)}
            position={[x, 0.2, -0.32]}
          />
        </group>
      ))}

      {/* Stripe detail */}
      <mesh position={[0, 0.5, 0.31]}>
        <boxGeometry args={[3, 0.05, 0.01]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.BoxGeometry(3, 0.05, 0.01)}
        position={[0, 0.5, 0.31]}
      />
    </group>
  );
}

// Low poly mountain - using simple geometries
function Mountain({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const height = scale * 2;
  const width = scale * 1.5;

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, scale * 0.3, width]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.BoxGeometry(width, scale * 0.3, width)}
        position={[0, 0, 0]}
      />
      {/* Peak 1 */}
      <mesh position={[-width * 0.3, height * 0.4, 0]}>
        <coneGeometry args={[width * 0.4, height * 0.6, 4]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.ConeGeometry(width * 0.4, height * 0.6, 4)}
        position={[-width * 0.3, height * 0.4, 0]}
      />
      {/* Peak 2 */}
      <mesh position={[width * 0.2, height * 0.5, 0]}>
        <coneGeometry args={[width * 0.5, height * 0.8, 4]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.ConeGeometry(width * 0.5, height * 0.8, 4)}
        position={[width * 0.2, height * 0.5, 0]}
      />
      {/* Peak 3 */}
      <mesh position={[width * 0.1, height * 0.3, -width * 0.2]}>
        <coneGeometry args={[width * 0.3, height * 0.5, 4]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.ConeGeometry(width * 0.3, height * 0.5, 4)}
        position={[width * 0.1, height * 0.3, -width * 0.2]}
      />
    </group>
  );
}

// Low poly tree
function Tree({ position }: { position: [number, number, number] }) {
  const trunkHeight = 0.8 + Math.random() * 0.4;
  const crownSize = 0.6 + Math.random() * 0.3;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, trunkHeight, 8]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.CylinderGeometry(0.08, 0.1, trunkHeight, 8)}
        position={[0, trunkHeight / 2, 0]}
      />
      {/* Crown */}
      <mesh position={[0, trunkHeight + crownSize * 0.5, 0]}>
        <coneGeometry args={[crownSize, crownSize * 1.2, 6]} />
        <meshStandardMaterial color="#E7E5E3" />
      </mesh>
      <Edges
        geometry={new THREE.ConeGeometry(crownSize, crownSize * 1.2, 6)}
        position={[0, trunkHeight + crownSize * 0.5, 0]}
      />
    </group>
  );
}

// Scrolling mountains background
function ScrollingMountains() {
  const mountainsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mountainsRef.current) {
      // Move mountains from right to left
      mountainsRef.current.position.x = -state.clock.elapsedTime * 2;
      // Loop when they go too far left
      if (mountainsRef.current.position.x < -30) {
        mountainsRef.current.position.x += 60;
      }
    }
  });

  return (
    <group ref={mountainsRef}>
      {/* Create multiple mountains at different positions */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = i * 3 - 30;
        const z = -15 - Math.random() * 5;
        const scale = 0.8 + Math.random() * 0.6;
        return <Mountain key={i} position={[x, 0, z]} scale={scale} />;
      })}
    </group>
  );
}

// Trees around the scene
function Trees() {
  const treesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (treesRef.current) {
      // Move trees from right to left
      treesRef.current.position.x = -state.clock.elapsedTime * 2;
      // Loop when they go too far left
      if (treesRef.current.position.x < -20) {
        treesRef.current.position.x += 40;
      }
    }
  });

  return (
    <group ref={treesRef}>
      {/* Trees on both sides and behind */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = i * 1.5 - 22.5;
        // Distribute trees on both sides of tracks
        const side = Math.random() > 0.5 ? 1 : -1;
        const z = side * (2 + Math.random() * 3);
        return <Tree key={i} position={[x, 0, z]} />;
      })}

      {/* Trees further back */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = i * 2 - 20;
        const z = -8 - Math.random() * 4;
        return <Tree key={`back-${i}`} position={[x, 0, z]} />;
      })}
    </group>
  );
}

// Ground/tracks that scroll
function ScrollingGround() {
  const groundRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groundRef.current) {
      // Move ground from right to left
      groundRef.current.position.x = -state.clock.elapsedTime * 2;
      // Loop when it goes too far left
      if (groundRef.current.position.x < -20) {
        groundRef.current.position.x += 40;
      }
    }
  });

  return (
    <group ref={groundRef}>
      {/* Tracks - extended infinitely */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <mesh>
          <planeGeometry args={[100, 1]} />
          <meshStandardMaterial color="#E7E5E3" />
        </mesh>
        <Edges
          geometry={new THREE.PlaneGeometry(100, 1)}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
        />
      </group>
      {/* Track ties - extended infinitely */}
      {Array.from({ length: 200 }, (_, i) => {
        const tieX = i * 0.5 - 50;
        return (
          <group
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[tieX, 0.02, 0]}
          >
            <mesh>
              <boxGeometry args={[0.2, 0.05, 1]} />
              <meshStandardMaterial color="#E7E5E3" />
            </mesh>
            <Edges
              geometry={new THREE.BoxGeometry(0.2, 0.05, 1)}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[tieX, 0.02, 0]}
            />
          </group>
        );
      })}
    </group>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        target={[0, 0.5, 0]}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      <ScrollingGround />
      <ScrollingMountains />
      <Trees />
      <BulletTrain />
    </>
  );
}

export default function TrainScene() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        marginTop: "32px",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
