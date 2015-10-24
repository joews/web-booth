import THREE from "three";

// fails with import - not yet sure why
// import glslify from "glslify";
/* eslint-disable */
const glslify = require("glslify");
/* eslint-enable */

// Credit: http://mrdoob.github.com/three.js/examples/webgl_postprocessing.html

const vertexShader = glslify("./dot-screen.vertex.glsl");
const fragmentShader = glslify("./dot-screen.fragment.glsl");

const DotScreenShader = {
  vertexShader,
  fragmentShader,
  uniforms: {
    tDiffuse: { type: "t", value: null },
    tSize: { type: "v2", value: new THREE.Vector2( 256, 256 ) },
    center: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
    angle: { type: "f", value: 1.57 },
    scale: { type: "f", value: 1.0 }
  }
};

export default DotScreenShader;
