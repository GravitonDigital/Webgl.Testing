import vector4 from '../math/vector4';
/**
 * @param {WebGLRenderingContext} renderingContext
 * @returns {GD.Shapes.Rectangle}
 */
export default function rectangle(renderingContext) {
    /**@type {GD.Shapes.Rectangle} */
    const state = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: vector4(),
        colorUniform: undefined
    };

    let gl = renderingContext;

    function setRenderingContext(newRenderingContext) {
        gl = newRenderingContext;
    }

    function getRenderingContext() {
        return gl;
    }

    function getBufferArray() {
        const x1 = state.x;
        const x2 = state.x + state.width;
        const y1 = state.y;
        const y2 = state.y + state.height;

        return new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);
    }

    function addToBuffer() {
        gl.bufferData(gl.ARRAY_BUFFER, getBufferArray(), gl.STATIC_DRAW);
    }

    function draw() {
        state.addToBuffer();
        gl.uniform4f(state.colorUniform, state.color.x, state.color.y, state.color.z, state.color.w);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    return Object.assign(state, {
        addToBuffer,
        draw,
        setRenderingContext,
        getRenderingContext
    });
}
