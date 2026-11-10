import { clamp } from '@/utils/math';

const emptyBench = { device: null, stage: 'idle', selectedPartId: null };

export const createBenchSlice = (set) => ({
  bench: { ...emptyBench },

  loadDevice: (device, stage = 'intake') =>
    set({ bench: { device, stage, selectedPartId: null } }),

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
