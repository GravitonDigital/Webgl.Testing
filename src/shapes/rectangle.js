import vector4 from '../math/vector4';
import position from '../core/position';
import size from '../core/size';
import pipe from '../utils/pipe';
import hasParent from '../core/hasParent';
import canBeDirty from '../core/canBeDirty';
/**
 * @param {WebGLRenderingContext} renderingContext
 * @returns {GD.Shapes.Rectangle}
 */
export default function rectangle() {
    /**@type {GD.Shapes.Rectangle} */
    const state = {
        color: vector4(),
        colorUniform: undefined
    };

    function getBufferArray() {
        const position = state.getGlobalPosition();
        const size = state.getSize();
        const x1 = position.x;
        const x2 = position.x + size.width;
        const y1 = position.y;
        const y2 = position.y + size.height;

        return new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);
    }

    function addToBuffer(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, getBufferArray(), gl.STATIC_DRAW);
    }

    function render(gl) {
        console.log('draw');
        addToBuffer(gl);
        gl.uniform4f(state.colorUniform, state.color.x, state.color.y, state.color.z, state.color.w);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function setSize(size) {
        state.setDirty(true);
        return size;
    }

    function setPosition(position) {
        state.setDirty(true);
        return position;
    }

    const positionState = position();
    const sizeState = size();
    const hasParentState = hasParent(state);
    const canBeDirtyState = canBeDirty();

    return Object.assign(state, positionState, sizeState, hasParentState, canBeDirtyState, {
        render: pipe(render, canBeDirtyState.render),
        setSize: pipe(setSize, sizeState.setSize),
        setPosition: pipe(setPosition, positionState.setPosition)
    });
}
