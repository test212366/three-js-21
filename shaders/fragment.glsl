uniform float time;
uniform vec2 aVertexPosition;
uniform mat3 porfectionMatrix;
uniform mat3 filterMatrix;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;


uniform float progress;
uniform float uDir;

uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.1415926;

uniform sampler2D udisplacement;
uniform sampler2D umap;
uniform float uPower;




void main() {
	vec2 uv = vFilterCoord;
	vec4 disp = texture2D(udisplacement, uv);
	vec4 color = texture2D(umap, vec2(uv.x, uv.y - 0.1 * disp.r * uDir * uPower));


 

	gl_FragColor = vec4(uv, 0., 1.);

		gl_FragColor = color;
}