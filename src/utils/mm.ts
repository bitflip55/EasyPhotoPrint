const CSS_PIXELS_PER_INCH = 96;
const MILLIMETERS_PER_INCH = 25.4;
const PDF_POINTS_PER_INCH = 72;

export function mmToCssPixels(mm: number): number {
  return (mm / MILLIMETERS_PER_INCH) * CSS_PIXELS_PER_INCH;
}

export function mmToPdfPoints(mm: number): number {
  return (mm / MILLIMETERS_PER_INCH) * PDF_POINTS_PER_INCH;
}
