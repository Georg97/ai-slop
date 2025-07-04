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
   * Calculate tent heights for a given floor width
   */
  private calculateHeightsForWidth(floorWidth: number): { footHeight: number; headHeight: number } {
    // Calculate required outer width (inner width + horizontal padding on both sides)
    const requiredOuterWidth = floorWidth + (2 * this.paddingParameters.horizontalPadding);
    
    // Calculate heights using proper triangle geometry
    const footHeight = this.calculateTriangleHeight(this.tentDimensions.footBaseWidth, requiredOuterWidth);
    const headHeight = this.calculateTriangleHeight(this.tentDimensions.headBaseWidth, requiredOuterWidth);
    
    // Subtract vertical padding to get inner tent height
    const innerFootHeight = footHeight - this.paddingParameters.verticalPadding;
    const innerHeadHeight = headHeight - this.paddingParameters.verticalPadding;
    
    return { 
      footHeight: Math.max(0, innerFootHeight), 
      headHeight: Math.max(0, innerHeadHeight) 
    };
  }

  /**
   * Calculate triangle height given base width and required top width
   * This is the core geometric calculation for the triangular tent cross-section
   */
  private calculateTriangleHeight(baseWidth: number, topWidth: number): number {
    // For an isosceles triangle:
    // The tent cross-section is an isosceles triangle with:
    // - Base = baseWidth (tent base: 0.75m foot, 1.075m head)
    // - Top width = topWidth (width at tent peak including padding)
    // 
    // Using similar triangles and the constraint that the tent fits within tarp space:
    // height = (topWidth - baseWidth) / (2 * tan(tarp_angle))
    // 
    // For simplicity, we'll use the geometric relationship where:
    // The tent height creates a triangle where the width narrows linearly from base to peak
    // Maximum height occurs when topWidth approaches baseWidth
    
    if (topWidth <= baseWidth) {
      // If required width is less than base, tent can be very tall
      return 2.0; // Practical maximum height
    }
    
    // Calculate the height needed to achieve the required top width
    // Using the tarp slope geometry: for every unit of height, width increases by tarp slope
    const tarpSlope = 0.8; // meters width per meter height (more realistic for tent setup)
    const widthDifference = topWidth - baseWidth;
    const requiredHeight = widthDifference / tarpSlope;
    
    // The available tarp height at this position
    const maxTarpHeight = this.getTarpHeightAtPosition(0.5); // Use middle position as reference
    
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