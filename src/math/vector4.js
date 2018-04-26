/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 * @returns {GD.Math.Vector4} A Vector4 object
 */
export default function vector4(x, y, z, w) {
    /**@type {GD.Math.Vector4} */
    const state = {
        x: x || 0,
        y: y || 0,
        z: z || 0,
        w: w || 1
    };
    return state;
}
