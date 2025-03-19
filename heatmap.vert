#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uModelViewMatrix;    // Provided by p5.js
uniform mat4 uProjectionMatrix;   // Provided by p5.js
attribute vec3 aPosition;         // Vertex position from geometry
varying vec3 vPos;                // Pass position to fragment shader

void main() {
  vPos = aPosition;               // Pass object-space position
  vec4 pos = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * pos; // Transform to clip space
}