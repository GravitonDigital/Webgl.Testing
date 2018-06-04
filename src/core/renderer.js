import resizeCanvasToDisplaySize from '../utils/resizeCanvasToDisplaySize';
import createShader from '../shaders/createShader';
import vertexShaderFile from '../shaders/vertex/2d-vertex-shader.glsl';
import fragmentShaderFile from '../shaders/fragment/2d-fragment-shader.glsl';
import { Signal } from 'signals';
import { mat4 } from 'gl-matrix';
import { TYPE } from '../Const';

/**
 * @returns {GD.Core.Renderer}
 */
export default function renderer(canvas) {
    /**@type {GD.Core.Renderer} */
    const state = {
        onSceneAdded: new Signal(),
        onSceneRemoved: new Signal(),
        renderObjects: [],
        type: TYPE.RENDERER
    };

    /**@type {Array<GD.Core.Scene} */
    let scenes = [];
    let program = undefined;
    let gl = undefined;
    let _isDirty = true;
    const attribLocations = {};
    const uniformLocations = {};
    let positionBuffer = undefined;
    let colorBuffer = undefined;
    let indexBuffer = undefined;

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
        return _isDirty;
    }

    function hasDirtyScene() {
        return scenes.some(scene => scene.isDirty());
    }

    function render() {
        if (hasDirtyScene() || isDirty()) {
            scenes.forEach(s => {
                s.render(state);
            });

            let positions = [];
            let colors = [];
            let indices = [];

            let needClear = false;

            for (let roIndex = 0; roIndex < state.renderObjects.length; roIndex += 1) {
                const ro = state.renderObjects[roIndex];
                if (ro.isNew || ro.isDirty) {
                    positions = positions.concat(ro.positions);
                    for (let i = 0; i < ro.positions.length; i += 1) {
                        colors = colors.concat(ro.color);
                    }
                    indices = indices.concat(ro.indices.map(i => i + indices.length / 3 * 2));
                }
                if (ro.isDirty) {
                    needClear = true;
                }
                ro.isNew = false;
                ro.isDirty = false;
            }

            if (needClear) {
                clear();
            }

            const normalize = false;
            const stride = 0;
            const offset = 0;

            // positions
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.vertexAttribPointer(attribLocations.vertexPosition, 3, gl.FLOAT, normalize, stride, offset);
            gl.enableVertexAttribArray(attribLocations.vertexPosition);

            // colors
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            gl.vertexAttribPointer(attribLocations.vertexColor, 4, gl.FLOAT, normalize, stride, offset);
            gl.enableVertexAttribArray(attribLocations.vertexColor);

            //vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            //draw
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, offset);

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
            clear();
            _isDirty = true;
        }
    }

    function clear() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

    function initBuffers() {
        positionBuffer = gl.createBuffer();
        colorBuffer = gl.createBuffer();
        indexBuffer = gl.createBuffer();
    }

    function init() {
        gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
        if (!gl) {
            throw 'You need webgl to run the content on this page';
        } else {
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderFile);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderFile);
            createProgram(vertexShader, fragmentShader);

            attribLocations.vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            attribLocations.vertexColor = gl.getAttribLocation(program, 'aVertexColor');
            uniformLocations.projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
            uniformLocations.modelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

            resizeCanvasToDisplaySize(gl.canvas);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            initBuffers();

            const fieldOfView = 45 * Math.PI / 180; // in radians
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 1600;
            const projectionMatrix = mat4.create();

            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

            const modelViewMatrix = mat4.create();

            mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -1500]);
            gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix);
            gl.uniformMatrix4fv(uniformLocations.modelViewMatrix, false, modelViewMatrix);

            clear();
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
        hasDirtyScene,
        getRenderingContext,
        getAttribLocation,
        getUniformLocation,
        isDirty
    });
}
