import axios from 'axios';
function getShader(gl, type, shaderName) {
    return new Promise(resolve => {
        let uriType = '';
        if (type === gl.VERTEX_SHADER) {
            uriType = 'vertex';
        } else if (type === gl.FRAGMENT_SHADER) {
            uriType = 'fragment';
        }
        axios.get(`shaders/${uriType}/${shaderName}.glsl`).then(response => {
            resolve(createShader(gl, type, shaderName, response.data));
        });
    });
}

function createShader(gl, type, shaderName, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return { shader, type, shaderName };
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

export default getShader;
