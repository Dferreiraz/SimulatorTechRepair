const BENCH_TOP = 0.9;
const SLAB_THICKNESS = 0.08;
const LEG_HEIGHT = BENCH_TOP - SLAB_THICKNESS;

const LEGS = [
  [-1.05, -0.42],
  [1.05, -0.42],
  [-1.05, 0.42],
  [1.05, 0.42],
];

export default function Workbench() {
  return (
    <group>
      <mesh
        position={[0, BENCH_TOP - SLAB_THICKNESS / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.4, SLAB_THICKNESS, 1.1]} />
        <meshStandardMaterial
          color="#5a4130"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {LEGS.map(([x, z]) => (
        <mesh
          key={`${x}-${z}`}
          position={[x, LEG_HEIGHT / 2, z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.08, LEG_HEIGHT, 0.08]} />
          <meshStandardMaterial
            color="#1b2432"
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
