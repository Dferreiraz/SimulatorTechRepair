import { clamp } from '@/utils/math';

import type { BenchSlice, SliceCreator } from '../types';

const emptyBench = {
  device: null,
  stage: 'idle' as const,
  selectedPartId: null,
};

export const createBenchSlice: SliceCreator<BenchSlice> = (set) => ({
  bench: { ...emptyBench },

  loadDevice: (device) =>
    set({ bench: { device, stage: 'intake', selectedPartId: null } }),

  clearBench: () => set({ bench: { ...emptyBench } }),

  setStage: (stage) =>
    set((state) => ({ bench: { ...state.bench, stage } })),

  selectPart: (partId) =>
    set((state) => ({ bench: { ...state.bench, selectedPartId: partId } })),

  markScrewRemoved: (screwId) =>
    set((state) => {
      const { device } = state.bench;
      if (!device) return state;

      return {
        bench: {
          ...state.bench,
          device: {
            ...device,
            screws: device.screws.map((screw) =>
              screw.id === screwId ? { ...screw, removed: true } : screw,
            ),
          },
        },
      };
    }),

  setDust: (dust) =>
    set((state) => {
      if (!state.bench.device) return state;

      return {
        bench: {
          ...state.bench,
          device: { ...state.bench.device, dust: clamp(dust, 0, 100) },
        },
      };
    }),

  revealFault: (fault) =>
    set((state) => {
      const { device } = state.bench;
      if (!device || device.revealedFaults.includes(fault)) return state;

      return {
        bench: {
          ...state.bench,
          device: {
            ...device,
            revealedFaults: [...device.revealedFaults, fault],
          },
        },
      };
    }),
});
