import vector4 from '../math/vector4';
import position from '../core/position';
import size from '../core/size';
import pipe from '../utils/pipe';
/**
 * @param {WebGLRenderingContext} renderingContext
 * @returns {GD.Shapes.Rectangle}
 */
export default function rectangle(renderingContext) {
    /**@type {GD.Shapes.Rectangle} */
    const state = {
        color: vector4(),
        colorUniform: undefined,
        isDirty: false
    };

    let gl = renderingContext;

    function setRenderingContext(newRenderingContext) {
        gl = newRenderingContext;
    }

    function getRenderingContext() {
        return gl;
    }

    function getBufferArray() {
        const position = state.getPosition();
        const size = state.getSize();
        const x1 = position.x;
        const x2 = position.x + size.width;
        const y1 = position.y;
        const y2 = position.y + size.height;

        return new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);
    }

    function addToBuffer() {
        gl.bufferData(gl.ARRAY_BUFFER, getBufferArray(), gl.STATIC_DRAW);
    }

    function draw() {
        state.addToBuffer();
        gl.uniform4f(state.colorUniform, state.color.x, state.color.y, state.color.z, state.color.w);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        state.isDirty = false;
    }

    function setSize(size) {
        state.isDirty = true;
        return size;
    }

    function setPosition(position) {
        state.isDirty = true;
        return position;
    }

    const myPosition = position();
    const mySize = size();

    return Object.assign(state, myPosition, mySize, {
        addToBuffer,
        draw,
        setRenderingContext,
        getRenderingContext,
        setSize: pipe(setSize, mySize.setSize),
        setPosition: pipe(setPosition, myPosition.setPosition)
    });
}
