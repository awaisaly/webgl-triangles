const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var gl = canvas.getContext('webgl');

if (!gl) {
  console.log('WebGL not supported, falling back on experimental-webgl');
  gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
  alert('Your browser does not support WebGL');
}

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(1.0, 0.8, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertShaderSource = `
  attribute vec2 position;
  attribute vec3 vertColor;
  varying vec3 fragColor;

  void main() {
    fragColor = vertColor;
    gl_Position = vec4(position, 0, 1.0);
  }
`;

const fragShaderSource = `
  precision mediump float;

  varying vec3 fragColor;
  void main() {
    gl_FragColor = vec4(fragColor, 1);
  }
`;

const vertShader = gl.createShader(gl.VERTEX_SHADER);
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertShader, vertShaderSource);
gl.shaderSource(fragShader, fragShaderSource);

gl.compileShader(vertShader);
gl.compileShader(fragShader);

const program = gl.createProgram();
gl.attachShader(program, vertShader);
gl.attachShader(program, fragShader);

gl.linkProgram(program);

gl.useProgram(program);

const vertices = new Float32Array(
  [
    -1, -1,  1.0, 0.0, 0.0,
    -1, 1,   0.0, 1.0, 0.0,
    1, 1,    0.0, 0.0, 1.0,
    -1, -1,  0.1, 1.0, 0.6,
    1, 1,    0.7, 0.0, 1.0,
    1, -1,    1.0, 1.0, 0.0,
  ]
);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, "position");
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(positionAttribLocation);

const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(colorAttribLocation);

gl.drawArrays(gl.TRIANGLES, 0, 6);