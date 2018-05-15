import resizeCanvasToDisplaySize from '../utils/resizeCanvasToDisplaySize';
import createShader from '../shaders/createShader';
import vertexShaderFile from '../shaders/vertex/2d-vertex-shader.glsl';
import fragmentShaderFile from '../shaders/fragment/2d-fragment-shader.glsl';
import { Signal } from 'signals';

/**
 * @returns {GD.Core.Renderer}
 */
export default function renderer(canvas) {
    /**@type {GD.Core.Renderer} */
    const state = {
        onSceneAdded: new Signal(),
        onSceneRemoved: new Signal()
    };

    /**@type {Array<GD.Core.Scene} */
    let scenes = [];
    let program = undefined;
    let gl = undefined;
    let _isDirty = true;

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
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function isDirty() {
        return scenes.some(scene => scene.isDirty()) || _isDirty;
    }

    function render() {
        if (isDirty()) {
            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            scenes.forEach(scene => {
                scene.render(gl);
            });

            _isDirty = false;
        }
    }

    function update(dt) {
        scenes.forEach(scene => {
            scene.update(dt);
        });

        render();
    }

    function addScene(scene) {
        state.removeScene(scene);
        scenes.push(scene);
        state.onSceneAdded.dispatch(scene);
        _isDirty = true;
    }

    function addSceneAt(scene, index) {
        state.removeScene(scene);
        scenes.splice(index, 0, scene);
        state.onSceneAdded.dispatch(scene);
        _isDirty = true;
    }

    function removeScene(sceneToRemove) {
        const index = scenes.indexOf(sceneToRemove);
        if (index !== -1) {
            scenes.splice(index, 1);
            state.onSceneRemoved.dispatch(sceneToRemove);
            _isDirty = true;
        }
    }

    function getScenes() {
        return scenes;
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
        update,
        getScenes,
        addScene,
        addSceneAt,
        removeScene,
        isDirty,
        getRenderingContext,
        getAttribLocation,
        getUniformLocation
    });
}
