import { Component, HostListener, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { collapseExpandAnimation } from 'src/assets/animations/CollapseExpand';
import { GalaxyBackgroundComponent } from '../../components/galaxy-background/galaxy-background.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule, GalaxyBackgroundComponent],
  animations: [collapseExpandAnimation]
})
export class MainPageComponent implements OnInit, AfterViewInit {
  emailCopied = false;
  isDarkMode = false;
  mouseX = 0;
  mouseY = 0;

  isEducationCollapsed = true;
  isExperienceCollapsed = true;
  isProjectsCollapsed = true;
  isSkillsCollapsed = true;
  isInterestsCollapsed = true;

  degrees: any[] = [];
  experiences: any[] = [];
  projects: any[] = [];
  skills: any[] = [];
  interests: any[] = [];

  private observer!: IntersectionObserver;
  
  // Subtitle decrypt animation
  subtitleTexts = ['Web Designer', 'Computer Engineer', 'CSS King'];
  decryptedSubtitles: string[] = [];
  // private decryptInterval?: any;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadData('degrees', 'assets/data/education.json');
    this.loadData('experiences', 'assets/data/experience.json');
    this.loadData('projects', 'assets/data/projects.json');
    this.loadData('skills', 'assets/data/skills.json');
    this.loadData('interests', 'assets/data/interests.json');
    
    // Initialize decrypted subtitles
    this.decryptedSubtitles = this.subtitleTexts.map(() => '');
    this.startDecryptAnimation();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    // Observe all sections and elements with animate-on-scroll class
    const sections = this.elementRef.nativeElement.querySelectorAll('section');
    const animatedElements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    
    sections.forEach((section: Element) => this.observer.observe(section));
    animatedElements.forEach((element: Element) => this.observer.observe(element));
  }

  private loadData(key: string, url: string): void {
    this.http.get(url).subscribe((data) => {
      (this as any)[key] = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Handle any resize-specific logic
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    
    // Update CSS variables for mouse position
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText('omar.benzekri.2003@gmail.com');
      this.emailCopied = true;
      
      setTimeout(() => {
        this.emailCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.getCurrentTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  getCurrentTheme() {
    return this.isDarkMode ? 'dark-theme' : 'light-theme';
  }

  scrollToEducation(): void {
    const educationSection = document.getElementById('education-section');
    if (educationSection) {
      educationSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleCollapse(section: string) {
    switch (section) {
      case 'education':
        this.isEducationCollapsed = !this.isEducationCollapsed;
        break;
      case 'experience':
        this.isExperienceCollapsed = !this.isExperienceCollapsed;
        break;
      case 'projects':
        this.isProjectsCollapsed = !this.isProjectsCollapsed;
        break;
      case 'skills':
        this.isSkillsCollapsed = !this.isSkillsCollapsed;
        break;
      case 'interests':
        this.isInterestsCollapsed = !this.isInterestsCollapsed;
        break;
    }
  }

  playVideo(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.play();
  }

  pauseVideo(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.pause();
  }

  // Decrypt animation for subtitles
  private startDecryptAnimation(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}()';
    const isMobile = window.innerWidth <= 768;
    const speed = isMobile ? 50 : 40; // Slightly slower on mobile
    const iterations = isMobile ? 10 : 12; // Slightly fewer iterations on mobile
    
    // Use requestAnimationFrame for better performance
    let startTime: number;
    const animateDecrypt = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      this.subtitleTexts.forEach((text, index) => {
        const delay = 800 + (index * 400);
        if (elapsed < delay) return;
        
        const progress = Math.min((elapsed - delay) / (iterations * speed), 1);
        const revealPosition = Math.floor(text.length * progress);
        
        this.decryptedSubtitles[index] = text
          .split('')
          .map((char, charIndex) => {
            if (char === ' ') return ' ';
            if (charIndex < revealPosition) return text[charIndex];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });
      
      // Continue animation if not complete
      const lastDelay = 800 + ((this.subtitleTexts.length - 1) * 400);
      if (elapsed < lastDelay + (iterations * speed)) {
        requestAnimationFrame(animateDecrypt);
      }
    };
    
    // Start with scrambled text
    this.subtitleTexts.forEach((text, index) => {
      this.decryptedSubtitles[index] = text
        .split('')
        .map(char => char === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)])
        .join('');
    });
    
    // Start animation after a tiny delay to not block initial render
    setTimeout(() => {
      requestAnimationFrame(animateDecrypt);
    }, 50);
  }

  onSubtitleHover(index: number): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    const text = this.subtitleTexts[index];
    const speed = 30;
    let currentIteration = 0;
    const maxIterations = 8;
    
    // Use requestAnimationFrame for smoother animation
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= speed) {
        this.decryptedSubtitles[index] = text
          .split('')
          .map((char, charIndex) => {
            if (char === ' ') return ' ';
            
            const progress = currentIteration / maxIterations;
            if (charIndex < text.length * progress) {
              return text[charIndex];
            }
            
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
        
        currentIteration++;
        lastTime = timestamp;
      }
      
      if (currentIteration <= maxIterations) {
        requestAnimationFrame(animate);
      } else {
        this.decryptedSubtitles[index] = text;
      }
    };
    
    requestAnimationFrame(animate);
  }
}
