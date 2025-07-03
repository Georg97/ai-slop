// Common Zustand store utilities and types

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AsyncState, LoadingState } from './types';

// Base store interface for async operations
export interface BaseAsyncStore<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
  setLoading: (loading: LoadingState) => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Factory function to create async stores
export function createAsyncStore<T>(name: string) {
  return create<BaseAsyncStore<T>>()(
    devtools(
      (set) => ({
        data: null,
        loading: 'idle',
        error: null,
        setLoading: (loading) => set({ loading }),
        setData: (data) => set({ data, loading: 'success', error: null }),
        setError: (error) => set({ error, loading: 'error' }),
        reset: () => set({ data: null, loading: 'idle', error: null }),
      }),
      {
        name: `${name}-store`,
      }
    )
  );
}

// Common UI store for modals, sidebars, etc.
export interface UIStore {
  sidebarOpen: boolean;
  modalOpen: boolean;
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  toggleSidebar: () => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      sidebarOpen: false,
      modalOpen: false,
      activeModal: null,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setModalOpen: (open) => set({ modalOpen: open }),
      setActiveModal: (modal) => set({ activeModal: modal }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      openModal: (modal) => set({ modalOpen: true, activeModal: modal }),
      closeModal: () => set({ modalOpen: false, activeModal: null }),
    }),
    {
      name: 'ui-store',
    }
  )
);

// Theme store
export interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-store',
    }
  )
);