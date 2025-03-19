#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vPos; // Position from vertex shader

void main() {
  // Normalize y-position (-300 to 300) to 0-1 range
  float value = (vPos.y + 300.0) / 600.0;
  value = clamp(value, 0.7, 1.0); // Ensure value stays between 0 and 1
  
  // Red to green gradient
  vec3 heatmap = vec3(value, 1.0 - value, 0.0);
  
  // Output color
  gl_FragColor = vec4(heatmap, 1.0);
}