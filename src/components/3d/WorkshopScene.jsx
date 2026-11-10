import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import PcTower from './PcTower';
import Workbench from './Workbench';

const CAMERA_TARGET = [0, 1, 0];

export default function WorkshopScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [2, 1.7, 2.6], fov: 42, near: 0.1, far: 30 }}
    >
      <color attach="background" args={['#070d17']} />
      <fog attach="fog" args={['#070d17', 6, 14]} />

      {/* Luz principal com sombras + preenchimento frio */}
      <ambientLight intensity={1.35} />
      <hemisphereLight args={['#8fb4ff', '#0a0f18', 0.5]} />
      <directionalLight
        castShadow
        position={[3.5, 5, 2.5]}
        intensity={2.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
      />

      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080e18" roughness={1} metalness={0} />
      </mesh>
      <gridHelper
        args={[12, 24, '#1e2e47', '#121b29']}
        position={[0, 0.002, 0]}
      />

      <Workbench />
      <PcTower position={[-0.45, 0.9, 0.05]} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={CAMERA_TARGET}
        enablePan={false}
        minDistance={1.6}
        maxDistance={4.2}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minAzimuthAngle={-1.2}
        maxAzimuthAngle={1.2}
      />
    </Canvas>
  );
}
