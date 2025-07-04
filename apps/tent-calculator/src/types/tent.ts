// Types for tent calculation system
// Note: All values stored internally in meters, but UI displays in centimeters

export interface TarpDimensions {
  shortSide: number; // 1.5m (internal)
  longSide: number; // 2.15m (internal)
  diagonalSide: number; // ~2.175m (internal)
  usableLength: number; // 2.15m (internal)
}

export interface TentDimensions {
  length: number; // 2m (internal, fixed)
  footBaseWidth: number; // 0.75m (internal, fixed)
  headBaseWidth: number; // 1.075m (internal, fixed)
  footHeight?: number; // stored in meters, displayed as cm
  headHeight?: number; // stored in meters, displayed as cm
  floorWidth?: number; // stored in meters, displayed as cm
}

export interface PaddingParameters {
  verticalPadding: number; // stored in meters, displayed as cm
  horizontalPadding: number; // stored in meters, displayed as cm
  endPadding: number; // stored in meters, displayed as cm
}

export interface CalculationInputs {
  tarpDimensions: TarpDimensions;
  tentDimensions: TentDimensions;
  paddingParameters: PaddingParameters;
  calculationMode: CalculationMode;
}

export interface CalculationResult {
  footHeight: number;
  headHeight: number;
  floorWidth: number;
  isValid: boolean;
  warnings: string[];
  availableSpace: {
    footHeight: number;
    headHeight: number;
    footWidth: number;
    headWidth: number;
  };
}

export interface GeometricConstraints {
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  maxSlope: number;
}

export type CalculationMode = 
  | 'solve_height' // Given width and padding, solve for height
  | 'solve_width' // Given height and padding, solve for width
  | 'solve_padding' // Given dimensions, find minimum padding
  | 'validate'; // Check if given dimensions are valid

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  constraints: GeometricConstraints;
}

export interface CrossSectionData {
  position: number; // 0 to 1 (foot to head)
  baseWidth: number;
  availableHeight: number;
  availableWidth: number;
  maxTentHeight: number;
  maxTentWidth: number;
}

// Default constants
export const DEFAULT_TARP_DIMENSIONS: TarpDimensions = {
  shortSide: 1.5,
  longSide: 2.15,
  diagonalSide: 2.175,
  usableLength: 2.15
};

export const DEFAULT_TENT_DIMENSIONS: TentDimensions = {
  length: 2.0,
  footBaseWidth: 0.75,
  headBaseWidth: 1.075
};

export const DEFAULT_PADDING: PaddingParameters = {
  verticalPadding: 0.05, // 5cm (displayed as 5cm in UI)
  horizontalPadding: 0.03, // 3cm (displayed as 3cm in UI)
  endPadding: 0.05 // 5cm (displayed as 5cm in UI)
};