import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { collapseExpandAnimation } from 'src/assets/CollapseExpand';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule],
  animations: [collapseExpandAnimation]
})
export class MainPageComponent implements OnInit {
  cardStyles = {};
  isFlipped = false;
  isFlipping = false;
  isDarkMode = false;

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData('degrees', 'assets/data/education.json');
    this.loadData('experiences', 'assets/data/experience.json');
    this.loadData('projects', 'assets/data/projects.json');
    this.loadData('skills', 'assets/data/skills.json');
    this.loadData('interests', 'assets/data/interests.json');
  }

  private loadData(key: string, url: string): void {
    this.http.get(url).subscribe((data) => {
      (this as any)[key] = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resetCardPosition();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isFlipping) return;
    const card = document.querySelector('.card') as HTMLElement;
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    const rotateX = -(event.clientY - centerY) / 20;
    const rotateY = (event.clientX - centerX) / 20;

    this.cardStyles = {
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (this.isFlipped ? 180 : 0)}deg)`
    };
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

  resetCardPosition(): void {
    this.cardStyles = {
      transform: `rotateX(0) rotateY(${this.isFlipped ? 180 : 0}deg)`
    };
  }

  async flipCard(): Promise<void> {
    this.isFlipped = !this.isFlipped;
    this.isFlipping = true;
    this.cardStyles = {
      transform: `rotateX(0) rotateY(${this.isFlipped ? 180 : 0}deg)`
    };

    if (this.isFlipped) {
      await navigator.clipboard.writeText('omar.benzekri.2003@gmail.com');
    }
    
    setTimeout(() => {
      this.isFlipping = false;
    }, 600);
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
