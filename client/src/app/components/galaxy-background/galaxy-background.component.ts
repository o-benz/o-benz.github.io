import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// WebGL Shader Code
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0); // Center in UV space
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha); // Enhance contrast
    alpha = min(alpha, 1.0); // Clamp to maximum 1.0
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

@Component({
  selector: 'app-galaxy-background',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #galaxyCanvas class="galaxy-canvas"></canvas>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
    }
    .galaxy-canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class GalaxyBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('galaxyCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Input properties with defaults
  @Input() focal = [0.5, 0.5];
  @Input() rotation = [1.0, 0.0];
  @Input() starSpeed = 0.5;
  @Input() density = 1;
  @Input() hueShift = 140;
  @Input() disableAnimation = false;
  @Input() speed = 1.0;
  @Input() mouseInteraction = true;
  @Input() glowIntensity = 0.3;
  @Input() saturation = 0.0;
  @Input() mouseRepulsion = true;
  @Input() repulsionStrength = 2;
  @Input() twinkleIntensity = 0.3;
  @Input() rotationSpeed = 0.1;
  @Input() autoCenterRepulsion = 0;
  @Input() transparent = true;

  private gl!: WebGLRenderingContext;
  private program!: WebGLProgram;
  private animationId?: number;
  private targetMousePos = { x: 0.5, y: 0.5 };
  private smoothMousePos = { x: 0.5, y: 0.5 };
  private targetMouseActive = 0.0;
  private smoothMouseActive = 0.0;
  private startTime = Date.now();

  ngAfterViewInit(): void {
    this.initWebGL();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.cleanup();
  }

  private initWebGL(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl', { 
      alpha: this.transparent,
      premultipliedAlpha: false 
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    this.gl = gl;
    
    if (this.transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    // Create shaders
    const vs = this.createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = this.createShader(gl.FRAGMENT_SHADER, fragmentShader);
    
    if (!vs || !fs) return;
    
    // Create program
    this.program = this.createProgram(vs, fs);
    
    // Set up geometry (triangle covering the screen)
    const vertices = new Float32Array([
      -1, -1, 0, 0,
      3, -1, 2, 0,
      -1, 3, 0, 2
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set up attributes
    const positionLoc = gl.getAttribLocation(this.program, 'position');
    const uvLoc = gl.getAttribLocation(this.program, 'uv');
    
    gl.enableVertexAttribArray(positionLoc);
    gl.enableVertexAttribArray(uvLoc);
    
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);
    
    // Start render loop
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    if (this.mouseInteraction) {
      canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    
    this.render();
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  private createProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
    }
    
    return program;
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  private render = (): void => {
    this.animationId = requestAnimationFrame(this.render);
    
    const gl = this.gl;
    const currentTime = (Date.now() - this.startTime) * 0.001;
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    
    // Update uniforms
    const setUniform = (name: string, ...values: number[]) => {
      const loc = gl.getUniformLocation(this.program, name);
      if (!loc) return;
      
      if (values.length === 1) {
        gl.uniform1f(loc, values[0]);
      } else if (values.length === 2) {
        gl.uniform2f(loc, values[0], values[1]);
      } else if (values.length === 3) {
        gl.uniform3f(loc, values[0], values[1], values[2]);
      }
    };

    const setUniformBool = (name: string, value: boolean) => {
      const loc = gl.getUniformLocation(this.program, name);
      if (loc) gl.uniform1i(loc, value ? 1 : 0);
    };
    
    // Smooth mouse movement
    const lerpFactor = 0.05;
    this.smoothMousePos.x += (this.targetMousePos.x - this.smoothMousePos.x) * lerpFactor;
    this.smoothMousePos.y += (this.targetMousePos.y - this.smoothMousePos.y) * lerpFactor;
    this.smoothMouseActive += (this.targetMouseActive - this.smoothMouseActive) * lerpFactor;
    
    // Set all uniforms
    setUniform('uTime', this.disableAnimation ? 0 : currentTime);
    setUniform('uResolution', gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    setUniform('uFocal', this.focal[0], this.focal[1]);
    setUniform('uRotation', this.rotation[0], this.rotation[1]);
    setUniform('uStarSpeed', this.disableAnimation ? 0 : (currentTime * this.starSpeed) / 10.0);
    setUniform('uDensity', this.density);
    setUniform('uHueShift', this.hueShift);
    setUniform('uSpeed', this.speed);
    setUniform('uMouse', this.smoothMousePos.x, this.smoothMousePos.y);
    setUniform('uGlowIntensity', this.glowIntensity);
    setUniform('uSaturation', this.saturation);
    setUniformBool('uMouseRepulsion', this.mouseRepulsion);
    setUniform('uTwinkleIntensity', this.twinkleIntensity);
    setUniform('uRotationSpeed', this.rotationSpeed);
    setUniform('uRepulsionStrength', this.repulsionStrength);
    setUniform('uMouseActiveFactor', this.smoothMouseActive);
    setUniform('uAutoCenterRepulsion', this.autoCenterRepulsion);
    setUniformBool('uTransparent', this.transparent);
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    this.targetMousePos = { x, y };
    this.targetMouseActive = 1.0;
  }

  private handleMouseLeave(): void {
    this.targetMouseActive = 0.0;
  }

  private cleanup(): void {
    if (this.gl) {
      const loseContext = this.gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    }
  }
}