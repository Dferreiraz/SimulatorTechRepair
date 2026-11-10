import { createId } from '@/utils/id';

const MAX_TOASTS = 3;

export const createUiSlice = (set) => ({
  ui: {
    activePanel: 'none',
    paused: false,
    dragPayload: null,
    toasts: [],
  },

  setActivePanel: (panel) =>
    set((state) => ({ ui: { ...state.ui, activePanel: panel } })),

  togglePause: () =>
    set((state) => ({ ui: { ...state.ui, paused: !state.ui.paused } })),

  beginDrag: (partId) =>
    set((state) => ({ ui: { ...state.ui, dragPayload: { partId } } })),

  endDrag: () =>
    set((state) => ({ ui: { ...state.ui, dragPayload: null } })),

  pushToast: (kind, message) =>
    set((state) => ({
      ui: {
        ...state.ui,
        toasts: [
          ...state.ui.toasts,
          { id: createId(), kind, message },
        ].slice(-MAX_TOASTS),
      },
    })),

  dismissToast: (id) =>
    set((state) => ({
      ui: {
        ...state.ui,
        toasts: state.ui.toasts.filter((toast) => toast.id !== id),
      },
    })),
});
