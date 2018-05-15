import resizeCanvasToDisplaySize from '../utils/resizeCanvasToDisplaySize';
import createShader from '../shaders/createShader';
import vertexShaderFile from '../shaders/vertex/2d-vertex-shader.glsl';
import fragmentShaderFile from '../shaders/fragment/2d-fragment-shader.glsl';

/**
 * @returns {GD.Core.Renderer}
 */
export default function renderer(canvas) {
    /**@type {GD.Core.Renderer} */
    const state = {};

    let scene = undefined;
    let program = undefined;
    let gl = undefined;

    function createProgram(vertexShader, fragmentShader) {
        if (program) {
            gl.deleteProgram(program);
        }
        program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (!success) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function render() {
        if (scene && scene.isDirty()) {
            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            scene.draw(gl);
        }
    }

    function setScene(newScene) {
        scene = newScene;
    }

    function getScene() {
        return scene;
    }

    function getRenderingContext() {
        return gl;
    }

    function getAttribLocation(attr) {
        return gl.getAttribLocation(program, attr);
    }

    function getUniformLocation(uni) {
        return gl.getUniformLocation(program, uni);
    }

    function init() {
        gl = canvas.getContext('webgl');
        if (!gl) {
            throw 'You need webgl to run the content on this page';
        } else {
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderFile);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderFile);
            createProgram(vertexShader, fragmentShader);

            // look up where the vertex data needs to go.
            const positionAttributeLocation = getAttribLocation('a_position');

            // look up uniform locations
            const resolutionUniformLocation = getUniformLocation('u_resolution');

            // Create a buffer to put three 2d clip space points in
            const positionBuffer = gl.createBuffer();

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            resizeCanvasToDisplaySize(gl.canvas);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            // // Turn on the attribute
            gl.enableVertexAttribArray(positionAttributeLocation);

            // // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            const size = 2; // 2 components per iteration
            const type = gl.FLOAT; // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            let offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

            // set the resolution
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        }
    }

    init();

    return Object.assign(state, {
        render,
        getScene,
        setScene,
        getRenderingContext,
        getAttribLocation,
        getUniformLocation
    });
}
