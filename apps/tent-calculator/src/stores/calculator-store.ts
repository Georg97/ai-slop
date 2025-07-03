// Zustand store for tent calculator state

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  TarpDimensions,
  TentDimensions,
  PaddingParameters,
  CalculationResult,
  CalculationMode,
  DEFAULT_TARP_DIMENSIONS,
  DEFAULT_TENT_DIMENSIONS,
  DEFAULT_PADDING
} from '~/types/tent';
import { calculateTentDimensions } from '~/lib/tent-calculator';

interface CalculatorState {
  // Configuration
  tarpDimensions: TarpDimensions;
  tentDimensions: TentDimensions;
  paddingParameters: PaddingParameters;
  calculationMode: CalculationMode;
  
  // Results
  result: CalculationResult | null;
  isCalculating: boolean;
  error: string | null;
  
  // UI State
  activeTab: 'calculator' | 'results' | 'history';
  showAdvanced: boolean;
  
  // Actions
  setTarpDimensions: (dimensions: Partial<TarpDimensions>) => void;
  setTentDimensions: (dimensions: Partial<TentDimensions>) => void;
  setPaddingParameters: (padding: Partial<PaddingParameters>) => void;
  setCalculationMode: (mode: CalculationMode) => void;
  
  // Calculation actions
  calculateDimensions: () => void;
  clearResults: () => void;
  resetToDefaults: () => void;
  
  // UI actions
  setActiveTab: (tab: 'calculator' | 'results' | 'history') => void;
  setShowAdvanced: (show: boolean) => void;
  
  // Validation helpers
  canCalculate: () => boolean;
  getRequiredInputs: () => string[];
}

export const useCalculatorStore = create<CalculatorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      tarpDimensions: { ...DEFAULT_TARP_DIMENSIONS },
      tentDimensions: { ...DEFAULT_TENT_DIMENSIONS },
      paddingParameters: { ...DEFAULT_PADDING },
      calculationMode: 'solve_height',
      
      result: null,
      isCalculating: false,
      error: null,
      
      activeTab: 'calculator',
      showAdvanced: false,
      
      // Configuration actions
      setTarpDimensions: (dimensions) =>
        set((state) => ({
          tarpDimensions: { ...state.tarpDimensions, ...dimensions },
          result: null, // Clear results when inputs change
          error: null
        })),
      
      setTentDimensions: (dimensions) =>
        set((state) => ({
          tentDimensions: { ...state.tentDimensions, ...dimensions },
          result: null,
          error: null
        })),
      
      setPaddingParameters: (padding) =>
        set((state) => ({
          paddingParameters: { ...state.paddingParameters, ...padding },
          result: null,
          error: null
        })),
      
      setCalculationMode: (mode) =>
        set(() => ({
          calculationMode: mode,
          result: null,
          error: null
        })),
      
      // Calculation actions
      calculateDimensions: () => {
        const state = get();
        
        if (!state.canCalculate()) {
          set({ error: 'Missing required inputs for calculation' });
          return;
        }
        
        set({ isCalculating: true, error: null });
        
        try {
          const result = calculateTentDimensions({
            tarpDimensions: state.tarpDimensions,
            tentDimensions: state.tentDimensions,
            paddingParameters: state.paddingParameters,
            calculationMode: state.calculationMode
          });
          
          set({ 
            result,
            isCalculating: false,
            activeTab: 'results'
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Calculation failed',
            isCalculating: false
          });
        }
      },
      
      clearResults: () =>
        set({ result: null, error: null }),
      
      resetToDefaults: () =>
        set({
          tarpDimensions: { ...DEFAULT_TARP_DIMENSIONS },
          tentDimensions: { ...DEFAULT_TENT_DIMENSIONS },
          paddingParameters: { ...DEFAULT_PADDING },
          calculationMode: 'solve_height',
          result: null,
          error: null
        }),
      
      // UI actions
      setActiveTab: (tab) =>
        set({ activeTab: tab }),
      
      setShowAdvanced: (show) =>
        set({ showAdvanced: show }),
      
      // Validation helpers
      canCalculate: () => {
        const state = get();
        const required = state.getRequiredInputs();
        return required.length === 0;
      },
      
      getRequiredInputs: () => {
        const state = get();
        const required: string[] = [];
        
        switch (state.calculationMode) {
          case 'solve_height':
            if (!state.tentDimensions.floorWidth) {
              required.push('Floor Width');
            }
            break;
          
          case 'solve_width':
            if (!state.tentDimensions.footHeight) {
              required.push('Foot Height');
            }
            if (!state.tentDimensions.headHeight) {
              required.push('Head Height');
            }
            break;
          
          case 'solve_padding':
          case 'validate':
            if (!state.tentDimensions.floorWidth) {
              required.push('Floor Width');
            }
            if (!state.tentDimensions.footHeight) {
              required.push('Foot Height');
            }
            if (!state.tentDimensions.headHeight) {
              required.push('Head Height');
            }
            break;
        }
        
        return required;
      }
    }),
    {
      name: 'tent-calculator-store'
    }
  )
);

// Selector hooks for commonly used state
export const useCalculatorState = () => {
  const store = useCalculatorStore();
  return {
    tarpDimensions: store.tarpDimensions,
    tentDimensions: store.tentDimensions,
    paddingParameters: store.paddingParameters,
    calculationMode: store.calculationMode
  };
};

export const useCalculatorResults = () => {
  const store = useCalculatorStore();
  return {
    result: store.result,
    isCalculating: store.isCalculating,
    error: store.error,
    canCalculate: store.canCalculate(),
    requiredInputs: store.getRequiredInputs()
  };
};

export const useCalculatorActions = () => {
  const store = useCalculatorStore();
  return {
    setTarpDimensions: store.setTarpDimensions,
    setTentDimensions: store.setTentDimensions,
    setPaddingParameters: store.setPaddingParameters,
    setCalculationMode: store.setCalculationMode,
    calculateDimensions: store.calculateDimensions,
    clearResults: store.clearResults,
    resetToDefaults: store.resetToDefaults
  };
};