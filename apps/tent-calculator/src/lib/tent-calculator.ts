// Mathematical calculation engine for tent geometry

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
    const footCrossSection = this.getCrossSectionData(0); // Position 0 = foot
    const headCrossSection = this.getCrossSectionData(1); // Position 1 = head

    // Calculate maximum height for given width using isosceles triangle formula
    // For an isosceles triangle: height = sqrt((base/2)² + h²) where h is the height we want
    // Rearranged: h = sqrt(height² - (base/2)²)
    // But we need to account for the available tarp space and padding

    const footHeight = this.calculateHeightForWidthAtPosition(floorWidth, footCrossSection);
    const headHeight = this.calculateHeightForWidthAtPosition(floorWidth, headCrossSection);

    return { footHeight, headHeight };
  }

  /**
   * Calculate floor width for given heights
   */
  private calculateWidthForHeights(footHeight: number, headHeight: number): number {
    // Calculate the minimum width that can accommodate both heights
    const footWidth = this.calculateWidthForHeightAtPosition(footHeight, this.getCrossSectionData(0));
    const headWidth = this.calculateWidthForHeightAtPosition(headHeight, this.getCrossSectionData(1));

    // Return the more constraining (smaller) width
    return Math.min(footWidth, headWidth);
  }

  /**
   * Calculate height at a specific position for given floor width
   */
  private calculateHeightForWidthAtPosition(floorWidth: number, crossSection: CrossSectionData): number {
    // Available height after padding
    const availableHeight = crossSection.availableHeight;
    
    // Check if width is achievable
    if (floorWidth > crossSection.availableWidth) {
      return 0; // Cannot achieve this width
    }

    // For isosceles triangle: height² = (hypotenuse)² - (base/2)²
    // The hypotenuse is from tent peak to ground edge
    // We need to find the height that creates the desired floor width
    
    // The tent creates a triangle where:
    // - Base = floor width
    // - Sides go from floor edges to tent peak
    // The available width constrains how wide we can make the floor
    
    const halfFloorWidth = floorWidth / 2;
    const halfBaseWidth = crossSection.baseWidth / 2;
    
    // The tent height creates similar triangles
    // ratio = tentHeight / (availableHeight - padding)
    // tentWidth / availableWidth = tentHeight / availableHeight
    
    // Using similar triangles and the constraint that the tent must fit within available space
    const maxPossibleHeight = availableHeight * (halfFloorWidth / (crossSection.availableWidth / 2));
    
    return Math.min(maxPossibleHeight, availableHeight - this.paddingParameters.verticalPadding);
  }

  /**
   * Calculate floor width for given height at specific position
   */
  private calculateWidthForHeightAtPosition(height: number, crossSection: CrossSectionData): number {
    if (height > crossSection.availableHeight - this.paddingParameters.verticalPadding) {
      return 0; // Height not achievable
    }

    // Using similar triangles: 
    // tentWidth / availableWidth = tentHeight / availableHeight
    const ratio = height / crossSection.availableHeight;
    const tentWidth = crossSection.availableWidth * ratio;
    
    return Math.min(tentWidth, crossSection.availableWidth - 2 * this.paddingParameters.horizontalPadding);
  }

  /**
   * Get cross-section data at a specific position along tent length
   */
  private getCrossSectionData(position: number): CrossSectionData {
    // Position: 0 = foot, 1 = head
    const baseWidth = this.interpolateBaseWidth(position);
    
    // Calculate available space at this position
    // The tarp forms a triangle, so height varies linearly
    const tarpHeight = this.interpolateTarpHeight(position);
    const tarpWidth = this.interpolateTarpWidth(position);
    
    const availableHeight = tarpHeight - this.paddingParameters.verticalPadding;
    const availableWidth = tarpWidth - 2 * this.paddingParameters.horizontalPadding;
    
    // Maximum tent dimensions at this position
    const maxTentHeight = availableHeight;
    const maxTentWidth = availableWidth;

    return {
      position,
      baseWidth,
      availableHeight,
      availableWidth,
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
   * Interpolate tarp height at position
   */
  private interpolateTarpHeight(position: number): number {
    // For a triangular tarp, height varies based on the geometry
    // This is a simplified model - you may need to adjust based on actual tarp shape
    const footHeight = 0; // Tarp touches ground at foot
    const peakHeight = 1.5; // Maximum tarp height (estimate)
    const headHeight = 0; // Tarp touches ground at head
    
    // Quadratic interpolation for tent-like shape
    const t = position;
    return footHeight * (1 - t) * (1 - t) + peakHeight * 2 * t * (1 - t) + headHeight * t * t;
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
      warnings.push(`Foot height ${footHeight.toFixed(2)}m exceeds maximum ${footData.maxTentHeight.toFixed(2)}m`);
      isValid = false;
    }

    if (headHeight > headData.maxTentHeight) {
      warnings.push(`Head height ${headHeight.toFixed(2)}m exceeds maximum ${headData.maxTentHeight.toFixed(2)}m`);
      isValid = false;
    }

    if (floorWidth > Math.min(footData.maxTentWidth, headData.maxTentWidth)) {
      warnings.push(`Floor width ${floorWidth.toFixed(2)}m exceeds maximum available space`);
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