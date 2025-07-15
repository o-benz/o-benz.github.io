import { Component, HostListener, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { collapseExpandAnimation } from 'src/assets/animations/CollapseExpand';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule],
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
}
