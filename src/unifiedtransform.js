/**
 * @license UnifiedTransform v0.4.1 8/13/2025
 * https://github.com/rawify/UnifiedTransform.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 **/

const TAU = Math.PI * 2;
const D2R = TAU / 360;

const RE_FN = /(matrix|translate|translateX|translateY|scale|rotate|skewX|skewY)\s*\(([^)]+)\)/g;
const RE_SPLIT = /[\s,]+/;

function parseNumber(v) {
    return typeof v === 'number' ? v : (parseFloat(v) || 0);
}

function isRotationMatrix([a, b, c, d, x, y]) {
    // Check if Det(R) = 1 and R^T * R = I

    if (Math.abs(a * x + b * y) > 1e-8) return false;
    if (Math.abs(a * d - b * c - 1) > 1e-8) return false;
    if (Math.abs(x * x + y * y) > 1e-8) return false;
    if (Math.abs(a * a + b * b - 1) > 1e-8) return false;
    if (Math.abs(a * c + b * d) > 1e-8) return false;
    if (Math.abs(c * c + d * d - 1) > 1e-8) return false;
    if (Math.abs(c * x + d * y) > 1e-8) return false;

    return true;
}

function UnifiedTransform() {
    // Internal 3x3 (affine) in compact form: [a, b, c, d, tx, ty]
    this['matrix'] = [1, 0, 0, 1, 0, 0];
}

UnifiedTransform.prototype = {
    /**
     * Specifies a 2D translation by the vector (tx, ty)
     * 
     * @param {number|string} tx The number to be translated on the x-axis.
     * @param {number|string} ty The number to be translated on the x-axis.
     * @returns 
     */
    'translate': function (tx, ty) {
        return this['applyMatrix']([
            1, 0, 0,
            1, parseNumber(String(tx).replace('px', '')) || 0, parseNumber(String(ty).replace('px', '')) || 0]);
    },

    /**
     * Specifies a 2D scale operation by the (sx, sy) scaling vector described by the 2 parameters
     * 
     * @param {number|string} sx The number to be scaled on the x-axis.
     * @param {number|string|null} sy The number to be scaled on the y-axis.
     * @returns 
     */
    'scale': function (sx, sy = null) {

        if (sy === null) {
            sy = sx;
        }

        return this['applyMatrix']([
            parseNumber(sx) || 1, 0, 0,
            parseNumber(sy) || 1, 0, 0]);
    },

    /**
     * Specifies a 2D rotation by the angle specified in the parameter about the origin of the element or optionally the given point (x, y)
     * 
     * @param {number|string} angle The angle to rotate
     * @param {number|string} x The x-coordinate of the point to be rotated around
     * @param {number|string} y The y-coordinate of the point to be rotated around
     * @returns 
     */
    'rotate': function (angle, x, y) {

        if (typeof angle == 'string') {

            if (angle.indexOf('rad') !== -1) {
                angle = angle.replace('rad', '');
                angle = parseNumber(angle);
            } else {
                angle = angle.replace('deg', '');
                angle = parseNumber(angle) * D2R;
            }

        } else {
            angle = angle * D2R;
        }

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        if (x !== undefined) {
            this['translate'](x, y || 0);
        }

        this['applyMatrix']([cos, sin, -sin, cos, 0, 0]);

        if (x !== undefined) {
            return this['translate'](-x, -(y || 0));
        }
        return this;
    },

    /**
     * Specifies a 2D skew transformation along the X axis by the given angle.
     * 
     * @param {number|string} degrees The skew angle
     * @returns UnifiedTransform
     */
    'skewX': function (degrees) {
        let tan = Math.tan(parseNumber(degrees) * D2R);

        return this['applyMatrix']([1, 0, tan, 1, 0, 0]);
    },

    /**
     * Specifies a 2D skew transformation along the Y axis by the given angle.
     * 
     * @param {number|string} degrees The skew angle
     * @returns UnifiedTransform
     */
    'skewY': function (degrees) {

        let tan = Math.tan(parseNumber(degrees) * D2R);

        return this['applyMatrix']([1, tan, 0, 1, 0, 0]);
    },

    /**
     * Specifies a 2D transformation in the form of a transformation matrix
     * 
     * @param {Array<number> | Array<Array<number>>} B The matrix given as a one dimensional array
     * @param {string} order The order format of the matrix, CSS, flat or 2D
     * @returns UnifiedTransform
     */
    'applyMatrix': function (B, order = 'CSS') {

        let [Aa, Ab, Ac, Ad, Ax, Ay] = this['matrix'];
        let Ba, Bb, Bc, Bd, Bx, By;

        if (order === 'CSS') {
            // [a, b, c, d, tx, ty]
            Ba = parseNumber(B[0]); Bb = parseNumber(B[1]); Bc = parseNumber(B[2]); Bd = parseNumber(B[3]); Bx = parseNumber(B[4]); By = parseNumber(B[5]);
        } else if (order === '2D') {
            // [[a, c, tx], [b, d, ty], [0,0,1]]
            const r0 = B[0], r1 = B[1];
            Ba = parseNumber(r0[0]); Bc = parseNumber(r0[1]); Bx = parseNumber(r0[2]);
            Bb = parseNumber(r1[0]); Bd = parseNumber(r1[1]); By = parseNumber(r1[2]);
        } else {
            // 'flat' -> [a, c, tx, b, d, ty, 0, 0, 1]
            Ba = parseNumber(B[0]); Bc = parseNumber(B[1]); Bx = parseNumber(B[2]);
            Bb = parseNumber(B[3]); Bd = parseNumber(B[4]); By = parseNumber(B[5]);
        }

        this['matrix'] = [ // = A * B
            Aa * Ba + Ac * Bb,
            Ab * Ba + Ad * Bb,
            Aa * Bc + Ac * Bd,
            Ab * Bc + Ad * Bd,
            Aa * Bx + Ac * By + Ax,
            Ab * Bx + Ad * By + Ay]

        return this;
    },

    /**
     * Parses a transform string and applies each transformation one after the other
     * 
     * @param {string} str The CSS transform string
     * @returns UnifiedTransform
     */
    'transform': function (str) {

        RE_FN['lastIndex'] = 0;

        for (let m; (m = RE_FN.exec(str)) !== null;) {

            RE_SPLIT['lastIndex'] = 0;
            const params = m[2].trim().split(RE_SPLIT);

            switch (m[1]) {
                case 'matrix':
                    if (params.length === 6) {
                        this['applyMatrix'](params); // CSS order
                    }
                    break;

                case 'translate':
                    if (params.length === 1) {
                        this['translate'](params[0], 0);
                    } else if (params.length === 2) {
                        this['translate'](params[0], params[1]);
                    }
                    break;

                case 'translateX':
                    this['translate'](params[0], 0);
                    break;

                case 'translateY':
                    this['translate'](0, params[0]);
                    break;

                case 'scale':
                    if (params.length === 1) {
                        this['scale'](params[0], params[0]);
                    } else if (params.length === 2) {
                        this['scale'](params[0], params[1]);
                    }
                    break;

                case 'rotate':
                    if (params.length === 1) {
                        this['rotate'](params[0], 0, 0);
                    } else if (params.length === 3) {
                        this['rotate'](params[0], params[1], params[2]);
                    }
                    break;

                case 'skewX':
                    if (params.length === 1) {
                        this['skewX'](params[0]);
                    }
                    break;

                case 'skewY':
                    if (params.length === 1) {
                        this['skewY'](params[0]);
                    }
                    break;
            }
        }
        return this;
    },

    /**
     * Evaluates a point using the current transformation matrix
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns The transformed point
     */
    'eval': function (x, y) {
        const m = this['matrix'];
        return [
            x * m[0] + y * m[2] + m[4],
            x * m[1] + y * m[3] + m[5]];
    },

    /**
     * Gets the 3x3 transform matrix of the current homogeneous transformation
     * 
     * @param {string} order The order of the returned matrix, CSS, flat or 2D
     * @returns The current transform matrix
     */
    'toMatrix': function (order = 'flat') {
        const [a, b, c, d, tx, ty] = this['matrix'];

        if (order === 'CSS') {
            return [
                a, b, c,
                d, tx, ty];
        } else if (order === '2D') {
            return [
                [a, c, tx],
                [b, d, ty],
                [0, 0, 1]];
        } else {
            return [
                a, c, tx,
                b, d, ty,
                0, 0, 1];
        }
    },

    /**
     * Gets a CSS transform string to apply the current matrix
     * 
     * @returns The transform string
     */
    'toTransformString': function () {
        /*
        // Is it a pure rotation?
        if (isRotationMatrix(this['matrix'])) {
            return 'rotate(' + Number((Math.acos(Math.max(-1, Math.min(1, this['matrix'][0]))) / D2R).toFixed(3)) + ')';
        }
        */
        return 'matrix(' + this['matrix'].join(', ') + ')';
    }
}
