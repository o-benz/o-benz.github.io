import { Directive, HostListener, Input, OnInit, OnDestroy } from '@angular/core';

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

@Directive({
  selector: '[appClickSpark]',
  standalone: true
})
export class ClickSparkDirective implements OnInit, OnDestroy {
  private static sharedCanvas?: HTMLCanvasElement;
  private static sharedCtx?: CanvasRenderingContext2D;
  private static instanceCount = 0;
  @Input() sparkColor = '#7B68EE'; // Using your accent color
  @Input() sparkSize = 12;
  @Input() sparkRadius = 20;
  @Input() sparkCount = 8;
  @Input() duration = 600;
  @Input() easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' = 'ease-out';
  @Input() extraScale = 1.2;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private sparks: Spark[] = [];
  private animationId?: number;
  private resizeObserver?: ResizeObserver;

//   constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    ClickSparkDirective.instanceCount++;
    
    if (!ClickSparkDirective.sharedCanvas) {
      this.createCanvas();
    } else {
      this.canvas = ClickSparkDirective.sharedCanvas;
      this.ctx = ClickSparkDirective.sharedCtx!;
    }
    
    if (ClickSparkDirective.instanceCount === 1) {
      this.startAnimation();
    }
  }

  ngOnDestroy() {
    ClickSparkDirective.instanceCount--;
    
    if (ClickSparkDirective.instanceCount === 0) {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (ClickSparkDirective.sharedCanvas && ClickSparkDirective.sharedCanvas.parentNode) {
        ClickSparkDirective.sharedCanvas.parentNode.removeChild(ClickSparkDirective.sharedCanvas);
        ClickSparkDirective.sharedCanvas = undefined;
        ClickSparkDirective.sharedCtx = undefined;
      }
    }
  }

  private createCanvas(): void {
    // Create a fixed canvas that covers the viewport
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10000';
    this.canvas.style.isolation = 'isolate'; // Prevent rendering issues
    this.canvas.style.transform = 'translateZ(0)'; // Force GPU layer
    // Removed mixBlendMode as it can cause blur on mobile
    
    // Append to body instead of the element
    document.body.appendChild(this.canvas);
    
    // Store references
    ClickSparkDirective.sharedCanvas = this.canvas;
    this.ctx = this.canvas.getContext('2d')!;
    ClickSparkDirective.sharedCtx = this.ctx;
    
    // Set up resize observer for window
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(document.body);
    
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private easeFunc(t: number): number {
    switch (this.easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'ease-out':
      default:
        return t * (2 - t);
    }
  }

  private startAnimation(): void {
    const draw = (timestamp: number) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.sparks = this.sparks.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= this.duration) {
          return false;
        }

        const progress = elapsed / this.duration;
        const eased = this.easeFunc(progress);

        const distance = eased * this.sparkRadius * this.extraScale;
        const lineLength = this.sparkSize * (1 - eased);
        const opacity = 1 - eased;

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        this.ctx.strokeStyle = this.sparkColor;
        this.ctx.globalAlpha = opacity;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;

        return true;
      });

      this.animationId = requestAnimationFrame(draw);
    };

    this.animationId = requestAnimationFrame(draw);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // Check if clicking on section titles to reduce spark count for performance
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest('h2, .wiggly-container, button');
    
    // Use viewport coordinates directly since canvas is fixed
    const x = event.clientX;
    const y = event.clientY;

    const now = performance.now();
    // Reduce sparks for interactive elements to prevent lag
    const sparkCount = isInteractiveElement ? Math.min(this.sparkCount, 6) : this.sparkCount;
    
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4, // Add slight randomness
      startTime: now,
    }));

    this.sparks.push(...newSparks);
  }
}