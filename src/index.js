import './styles/base.scss';
import createShader from './shaders/createShader';
import resizeCanvasToDisplaySize from './utils/resizeCanvasToDisplaySize';
import vertexShaderFile from './shaders/vertex/2d-vertex-shader.glsl';
import fragmentShaderFile from './shaders/fragment/2d-fragment-shader.glsl';

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();

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

function main() {
    // Get A WebGL context
    const canvas = document.createElement('canvas');
    const app = document.getElementById('app');
    app.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('You need webgl to run the content on this page');
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderFile);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderFile);

    // shaders into a program
    const program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [0, 0, 0, 0.5, 0.7, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // code above this line is initialization code.
    // code below this line is rendering code.

    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();
