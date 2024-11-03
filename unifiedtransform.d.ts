
declare module 'UnifiedTransform';

export class UnifiedTransform {

    /**
     * Specifies a 2D translation by the vector (tx, ty)
     * 
     * @param {number|string} tx The number to be translated on the x-axis.
     * @param {number|string} ty The number to be translated on the x-axis.
     * @returns 
     */
    translate(tx: string | number, ty: string | number): UnifiedTransform;

    /**
     * Specifies a 2D scale operation by the (sx, sy) scaling vector described by the 2 parameters
     * 
     * @param {number|string} sy The number to be scaled on the x-axis.
     * @param {number|string} sy The number to be scaled on the y-axis.
     * @returns 
     */
    scale(sx: string | number, sy?: string | number): UnifiedTransform;

    /**
     * Specifies a 2D rotation by the angle specified in the parameter about the origin of the element or optionally the given point (x, y)
     * 
     * @param {number|string} angle The angle to rotate
     * @param {number|string} x The x-coordinate of the point to be rotated around
     * @param {number|string} y The y-coordinate of the point to be rotated around
     * @returns 
     */
    rotate(angle: string | number, x: string | number, y: string | number): UnifiedTransform;

    /**
     * Specifies a 2D skew transformation along the X axis by the given angle.
     * 
     * @param {number|string} degrees The skew angle
     * @returns UnifiedTransform
     */
    skewX(degrees: string | number): UnifiedTransform;

    /**
     * Specifies a 2D skew transformation along the Y axis by the given angle.
     * 
     * @param {number|string} degrees The skew angle
     * @returns UnifiedTransform
     */
    skewY(degrees: string | number): UnifiedTransform;

    /**
     * Specifies a 2D transformation in the form of a transformation matrix
     * 
     * @param {Array} m The matrix given as a one dimensional array
     * @param {string} order The order format of the matrix, CSS, flat or 2D
     * @returns UnifiedTransform
     */
    applyMatrix(m: [number | string, number | string, number | string, number | string, number | string, number | string], order: "2D" | "flat" | "CSS" = "CSS"): UnifiedTransform;

    /**
     * Parses a transform string and applies each transformation one after the other
     * 
     * @param {string} str The CSS transform string
     * @returns UnifiedTransform
     */
    transform(str: string): UnifiedTransform;

    /**
     * Evaluates a point using the current transformation matrix
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns The transformed point
     */
    eval(x: number, y: number): Array;

    /**
     * Gets the 3x3 transform matrix of the current homogeneous transformation
     * 
     * @param {string} order The order of the returned matrix, CSS, flat or 2D
     * @returns The current transform matrix
     */
    toMatrix(order: "2D" | "flat" | "CSS" = "CSS"): Array;

    /**
     * Gets a CSS transform string to apply the current matrix
     * 
     * @returns The transform string
     */
    toTransformString(): string;
}

export default UnifiedTransform;