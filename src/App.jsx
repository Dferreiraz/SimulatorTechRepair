import { WorkshopScene } from '@/components/3d';
import { HUD } from '@/components/ui';

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-base">
      {/* Camada 3D — fundo */}
      <div className="absolute inset-0">
        <WorkshopScene />
      </div>

      {/* Camada de HUD — frente, sem capturar eventos fora dos controles */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <HUD />
      </div>
    </div>
  );
}
