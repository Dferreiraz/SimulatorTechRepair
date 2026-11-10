const CASE_WIDTH = 0.24;
const CASE_HEIGHT = 0.46;
const CASE_DEPTH = 0.46;

/**
 * Placeholder low-poly da torre. Será substituído por um modelo .glb na Fase 3.
 * A origem do grupo fica na base do gabinete (y = 0).
 */
export default function PcTower({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, CASE_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[CASE_WIDTH, CASE_HEIGHT, CASE_DEPTH]} />
        <meshStandardMaterial
          color="#2b3a52"
          roughness={0.5}
          metalness={0.35}
        />
      </mesh>

      {/* Painel frontal rebaixado */}
      <mesh position={[0, CASE_HEIGHT / 2, CASE_DEPTH / 2 + 0.004]} receiveShadow>
        <boxGeometry args={[CASE_WIDTH - 0.04, CASE_HEIGHT - 0.06, 0.006]} />
        <meshStandardMaterial
          color="#121a26"
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>

      {/* LED de power — único ponto de cor saturada na cena */}
      <mesh
        position={[
          CASE_WIDTH / 2 - 0.045,
          CASE_HEIGHT - 0.05,
          CASE_DEPTH / 2 + 0.009,
        ]}
      >
        <boxGeometry args={[0.018, 0.018, 0.004]} />
        <meshStandardMaterial
          color="#2e7bff"
          emissive="#2e7bff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
