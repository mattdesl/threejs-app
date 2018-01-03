uniform vec3 colorA;
uniform vec3 colorB;
uniform float time;

varying vec3 vNormal;

void main () {
  vec3 norm = vNormal * 0.5 + 0.5;
  float t = norm.x;
  t *= sin(time * 5.0 + norm.x * 10.0) * 0.5 + 0.5;
  vec3 color = mix(colorA, colorB, t);
  gl_FragColor = vec4(color, 1.0);
}