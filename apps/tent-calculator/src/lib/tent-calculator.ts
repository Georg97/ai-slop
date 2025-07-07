// Mathematical calculation engine for tent geometry - CORRECTED

import type {
  TarpDimensions,
  TentDimensions,
  PaddingParameters,
  CalculationInputs,
  CalculationResult,
  ValidationResult,
  CrossSectionData,
  GeometricConstraints,
  CalculationMode
} from '~/types/tent';

export class TentCalculator {
  private tarpDimensions: TarpDimensions;
  private tentDimensions: TentDimensions;
  private paddingParameters: PaddingParameters;

  constructor(
    tarpDimensions: TarpDimensions,
    tentDimensions: TentDimensions,
    paddingParameters: PaddingParameters
  ) {
    this.tarpDimensions = tarpDimensions;
    this.tentDimensions = tentDimensions;
    this.paddingParameters = paddingParameters;
  }

  /**
   * Calculate tent dimensions based on the specified mode
   */
  calculate(mode: CalculationMode): CalculationResult {
    const warnings: string[] = [];
    let footHeight: number;
    let headHeight: number;
    let floorWidth: number;

    switch (mode) {
      case 'solve_height':
        if (!this.tentDimensions.floorWidth) {
          throw new Error('Floor width must be specified for solve_height mode');
        }
        floorWidth = this.tentDimensions.floorWidth;
        const heights = this.calculateHeightsForWidth(floorWidth);
        footHeight = heights.footHeight;
        headHeight = heights.headHeight;
        break;

      case 'solve_width':
        if (!this.tentDimensions.footHeight || !this.tentDimensions.headHeight) {
          throw new Error('Both foot and head heights must be specified for solve_width mode');
        }
        footHeight = this.tentDimensions.footHeight;
        headHeight = this.tentDimensions.headHeight;
        floorWidth = this.calculateWidthForHeights(footHeight, headHeight);
        break;

      case 'solve_padding':
        if (!this.tentDimensions.footHeight || !this.tentDimensions.headHeight || !this.tentDimensions.floorWidth) {
          throw new Error('All dimensions must be specified for solve_padding mode');
        }
        footHeight = this.tentDimensions.footHeight;
        headHeight = this.tentDimensions.headHeight;
        floorWidth = this.tentDimensions.floorWidth;
        break;

      case 'validate':
        if (!this.tentDimensions.footHeight || !this.tentDimensions.headHeight || !this.tentDimensions.floorWidth) {
          throw new Error('All dimensions must be specified for validate mode');
        }
        footHeight = this.tentDimensions.footHeight;
        headHeight = this.tentDimensions.headHeight;
        floorWidth = this.tentDimensions.floorWidth;
        break;

      default:
        throw new Error(`Unknown calculation mode: ${mode}`);
    }

    // Validate the result
    const validation = this.validateDimensions(footHeight, headHeight, floorWidth);
    warnings.push(...validation.warnings);

    const availableSpace = this.calculateAvailableSpace();

    return {
      footHeight,
      headHeight,
      floorWidth,
      isValid: validation.isValid,
      warnings,
      availableSpace
    };
  }

  /**
   * Calculate tent heights for a given floor width (rectangular floor)
   */
  private calculateHeightsForWidth(floorWidth: number): { footHeight: number; headHeight: number } {
    // For a RECTANGULAR floor, the tent width at floor level should be the same everywhere
    // The target floor width is the SAME at both foot and head
    const targetFloorWidth = floorWidth;
    
    // Calculate required outer width (inner width + horizontal padding on both sides)
    const requiredOuterWidth = targetFloorWidth + (2 * this.paddingParameters.horizontalPadding);
    
    // For a triangular tent cross-section with rectangular floor:
    // The tent slopes inward from the base to create the floor width
    // Floor width = base width - 2 * (height * tent_slope_factor)
    // Rearranging: height = (base_width - floor_width) / (2 * tent_slope_factor)
    
    const footHeight = this.calculateHeightForRectangularFloor(this.tentDimensions.footBaseWidth, requiredOuterWidth);
    const headHeight = this.calculateHeightForRectangularFloor(this.tentDimensions.headBaseWidth, requiredOuterWidth);
    
    // Subtract vertical padding to get inner tent height
    const innerFootHeight = footHeight - this.paddingParameters.verticalPadding;
    const innerHeadHeight = headHeight - this.paddingParameters.verticalPadding;
    
    return { 
      footHeight: Math.max(0, innerFootHeight), 
      headHeight: Math.max(0, innerHeadHeight) 
    };
  }

  /**
   * Calculate height needed for rectangular floor at given base width
   * This assumes the tent slopes OUTWARD from base to create wider floor
   */
  private calculateHeightForRectangularFloor(baseWidth: number, targetFloorWidth: number): number {
    // For a triangular tent with rectangular floor:
    // The tent base (75cm foot, 108cm head) is the NARROWEST part at ground level
    // The tent slopes OUTWARD as it goes up to create a wider floor at tent height
    // 
    // Geometry: The tent cross-section is an inverted triangle
    // - At ground level (base): narrow width (75cm foot, 108cm head)  
    // - At floor level (tent height): wider floor width (110cm + padding)
    // - The tent walls slope outward at an angle
    
    if (targetFloorWidth <= baseWidth) {
      // If target is narrower than base, no height needed (floor at ground level)
      return 0.1; // Minimum practical height
    }
    
    // Calculate how much the tent needs to expand outward
    const widthExpansion = targetFloorWidth - baseWidth;
    const halfWidthExpansion = widthExpansion / 2; // Each side expands outward by this amount
    
    // Using tent wall slope: for typical tent geometry, the slope is about 45-60 degrees
    // Using tan(60°) ≈ 1.73, meaning height = horizontal_distance / tan(angle)
    // For outward sloping walls: height = horizontal_expansion / tan(wall_angle)
    const tentWallSlope = 1.0; // horizontal expansion per unit height (45-degree walls)
    const requiredHeight = halfWidthExpansion / tentWallSlope;
    
    // Constrain by maximum practical height
    const maxTarpHeight = this.getTarpHeightAtPosition(0.5);
    
    return Math.min(requiredHeight, maxTarpHeight);
  }

  /**
   * Get tarp height at a specific position (0 = foot, 1 = head)
   */
  private getTarpHeightAtPosition(position: number): number {
    // Realistic tarp setup: A-frame or ridge-line setup
    // Both ends are elevated, with peak in the middle or slightly offset
    const footHeight = 0.8; // 80cm at foot (pole height)
    const peakHeight = 1.4; // 140cm at peak
    const headHeight = 1.0; // 100cm at head (pole height)
    
    // Quadratic interpolation for realistic tarp shape
    const t = position;
    return footHeight * (1 - t) * (1 - t) + peakHeight * 2 * t * (1 - t) + headHeight * t * t;
  }

  /**
   * Calculate floor width for given heights
   */
  private calculateWidthForHeights(footHeight: number, headHeight: number): number {
    // Add vertical padding to get total required height
    const totalFootHeight = footHeight + this.paddingParameters.verticalPadding;
    const totalHeadHeight = headHeight + this.paddingParameters.verticalPadding;
    
    // Calculate maximum width that can be achieved with these heights
    const footMaxWidth = this.calculateMaxWidthForHeight(this.tentDimensions.footBaseWidth, totalFootHeight);
    const headMaxWidth = this.calculateMaxWidthForHeight(this.tentDimensions.headBaseWidth, totalHeadHeight);
    
    // Use the more constraining width
    const maxOuterWidth = Math.min(footMaxWidth, headMaxWidth);
    
    // Subtract horizontal padding to get inner width
    const maxInnerWidth = maxOuterWidth - (2 * this.paddingParameters.horizontalPadding);
    
    return Math.max(0, maxInnerWidth);
  }

  /**
   * Calculate maximum width achievable for a given height and base width
   */
  private calculateMaxWidthForHeight(baseWidth: number, height: number): number {
    // Using the inverse of the triangle height calculation
    const tarpSlope = 0.8; // meters width per meter height (consistent with calculation)
    const maxWidth = baseWidth + (height * tarpSlope);
    
    // Constrain by tarp dimensions
    const maxTarpWidth = Math.max(this.tarpDimensions.shortSide, this.tarpDimensions.longSide);
    
    return Math.min(maxWidth, maxTarpWidth);
  }

  /**
   * Get cross-section data at a specific position along tent length
   */
  private getCrossSectionData(position: number): CrossSectionData {
    // Position: 0 = foot, 1 = head
    const baseWidth = this.interpolateBaseWidth(position);
    
    // Calculate available space at this position
    const tarpHeight = this.getTarpHeightAtPosition(position);
    const tarpWidth = this.interpolateTarpWidth(position);
    
    const availableHeight = tarpHeight - this.paddingParameters.verticalPadding;
    const availableWidth = tarpWidth - 2 * this.paddingParameters.horizontalPadding;
    
    // Maximum tent dimensions at this position
    const maxTentHeight = Math.max(0, availableHeight);
    const maxTentWidth = Math.max(0, availableWidth);

    return {
      position,
      baseWidth,
      availableHeight: maxTentHeight,
      availableWidth: maxTentWidth,
      maxTentHeight,
      maxTentWidth
    };
  }

  /**
   * Interpolate base width at position (foot to head)
   */
  private interpolateBaseWidth(position: number): number {
    return this.tentDimensions.footBaseWidth + 
           (this.tentDimensions.headBaseWidth - this.tentDimensions.footBaseWidth) * position;
  }

  /**
   * Interpolate tarp width at position
   */
  private interpolateTarpWidth(position: number): number {
    // Width varies linearly from short side to long side
    return this.tarpDimensions.shortSide + 
           (this.tarpDimensions.longSide - this.tarpDimensions.shortSide) * position;
  }

  /**
   * Calculate available space at foot and head positions
   */
  private calculateAvailableSpace() {
    const footData = this.getCrossSectionData(0);
    const headData = this.getCrossSectionData(1);

    return {
      footHeight: footData.availableHeight,
      headHeight: headData.availableHeight,
      footWidth: footData.availableWidth,
      headWidth: headData.availableWidth
    };
  }

  /**
   * Validate tent dimensions against geometric constraints
   */
  private validateDimensions(footHeight: number, headHeight: number, floorWidth: number): ValidationResult {
    const warnings: string[] = [];
    let isValid = true;

    // Check if dimensions fit within available space
    const footData = this.getCrossSectionData(0);
    const headData = this.getCrossSectionData(1);

    if (footHeight > footData.maxTentHeight) {
      warnings.push(`Foot height ${(footHeight * 100).toFixed(0)}cm exceeds maximum ${(footData.maxTentHeight * 100).toFixed(0)}cm`);
      isValid = false;
    }

    if (headHeight > headData.maxTentHeight) {
      warnings.push(`Head height ${(headHeight * 100).toFixed(0)}cm exceeds maximum ${(headData.maxTentHeight * 100).toFixed(0)}cm`);
      isValid = false;
    }

    if (floorWidth > Math.min(footData.maxTentWidth, headData.maxTentWidth)) {
      warnings.push(`Floor width ${(floorWidth * 100).toFixed(0)}cm exceeds maximum available space`);
      isValid = false;
    }

    // Check minimum practical dimensions
    if (footHeight < 0.3) {
      warnings.push('Foot height is very low, may not be practical');
    }

    if (headHeight < 0.5) {
      warnings.push('Head height is very low, may not be practical');
    }

    if (floorWidth < 0.4) {
      warnings.push('Floor width is very narrow, may not be practical');
    }

    // Check negative values
    if (footHeight < 0) {
      warnings.push('Foot height is negative - configuration impossible');
      isValid = false;
    }

    if (headHeight < 0) {
      warnings.push('Head height is negative - configuration impossible');
      isValid = false;
    }

    // Check slope constraints
    const slope = Math.abs(headHeight - footHeight) / this.tentDimensions.length;
    if (slope > 0.3) {
      warnings.push('Tent slope is very steep, may be unstable');
    }

    const constraints: GeometricConstraints = {
      minHeight: 0.3,
      maxHeight: Math.max(footData.maxTentHeight, headData.maxTentHeight),
      minWidth: 0.4,
      maxWidth: Math.min(footData.maxTentWidth, headData.maxTentWidth),
      maxSlope: 0.3
    };

    return {
      isValid,
      warnings,
      constraints
    };
  }
}

/**
 * Convenience function to create calculator and run calculation
 */
export function calculateTentDimensions(inputs: CalculationInputs): CalculationResult {
  const calculator = new TentCalculator(
    inputs.tarpDimensions,
    inputs.tentDimensions,
    inputs.paddingParameters
  );

  return calculator.calculate(inputs.calculationMode);
}

/**
 * Calculate minimum required padding for given tent dimensions
 */
export function calculateMinimumPadding(
  tarpDimensions: TarpDimensions,
  tentDimensions: Required<TentDimensions>
): PaddingParameters {
  // This would implement the reverse calculation
  // For now, return default minimums
  return {
    verticalPadding: 0.05, // 5cm minimum
    horizontalPadding: 0.025, // 2.5cm minimum  
    endPadding: 0.05 // 5cm minimum
  };
}