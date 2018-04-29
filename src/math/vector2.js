/**
 * @param {number} x
 * @param {number} y
 * @returns {GD.Math.Vector2} A Vector2 object
 */
export default function vector2(x, y) {
    /**@type {GD.Math.Vector2} */
    const state = {
        x: x || 0,
        y: y || 0
    };
    return state;
}
