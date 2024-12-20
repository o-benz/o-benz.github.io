import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collapseExpandAnimation } from 'src/assets/CollapseExpand';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule],
  animations: [collapseExpandAnimation]
})
export class MainPageComponent {
  cardStyles = {};
  isFlipped = false;
  isFlipping = false;
  isDarkMode = false;
  
  isEducationCollapsed = true;
  isExperienceCollapsed = true;
  isProjectsCollapsed = true;
  isSkillsCollapsed = true;
  isInterestsCollapsed = true;

  degrees = [
    {
      school: 'UNIVERSITÉ DE MONTRÉAL',
      facutlty: 'ÉCOLE POLYTECHNIQUE',
      major: 'Data Engineering and Analytics',
      minor: `-`,
      title: `MASTER OF ENGINEERING (M.Eng.)`,
      dates: `January 2026 - September 2026`,
      stamp: '../../../assets/stamp-master.png'
    },
    {
      school: 'UNIVERSITÉ DE MONTRÉAL',
      facutlty: 'ÉCOLE POLYTECHNIQUE',
      major: 'Computer Engineering',
      minor: `AI and Data Science`,
      title: `BACHELOR OF ENGINEERING (B.Eng.)`,
      dates: `September 2021 - December 2025`,
      stamp: '../../../assets/stamp-bachelor.png'
    }
  ];

  experiences = [
    {
      title: 'Data Engineering Analyst',
      company: 'National Bank of Canada',
      duration: 'May 2024 – Present',
      BP1: `• Manage real-time, near real-time or batch data ETL ingestion processes through MFT, AWS and Kafka, ensuring availability and governance of certified data across analytical platforms utilizing proficiency in Python and SQL.`,
      BP2: `• Lead Agile ceremonies as Scrum Master, drive efficient CI/CD practices through DevOps principles, and train a new team member to full operational capacity within two weeks. Resolve 93% of data flow incidents within SLA.`,
      BP3: `• Engineer innovative solutions to streamline data ingestion workflows using Snowflake and Databricks, reducing processing times, volumes, and associated costs by nearly 30% while upholding data quality standards.`
    },
    {
      title: 'Business Intelligence Intern',
      company: 'ADM Montreal Airports',
      duration: 'May 2023 - Sep 2023',
      BP1: `• Develop and implement various scripts and programs in diverse languages (Python, JS, VBA) to automate menial and repetitive tasks, resulting in a 20% increase in overall operational efficiency.`,
      BP2: `• Oversee projects, collaborate with various teams and clients, and deliver outcomes via reports and presentations.`,
      BP3: `• Perform data analysis and processing using platforms such as Power BI, Jupyter, or MySQL to extract insights, identify patterns, and make data-driven decisions.`
    },
    {
      title: 'Teacher Assistant',
      company: 'Polytechnique Montréal',
      duration: 'Jan 2023 - Dec 2023',
      BP1: `• Conduct weekly in-person lab sessions for over 40 students to reinforce key concepts in C++ and OOP.`,
      BP2: `• Grade assignments, quizzes and exams, providing detailed feedback to students on their performance.`,
      BP3: `• Provide code debugging and troubleshooting assistance to students during and outside of office hours.`
    },
    {
      title: 'Coding Instructor',
      company: 'Collège international Marie de France',
      duration: 'Sep 2020 - Present',
      BP1: `• Teach the basics of programming and computer science to a group of 30 young students.`,
      BP2: `• Design a fun and complete curriculum to foster curiosity and interest in a software-related career.`,
      BP3: `• Develop interactive coding projects and exercises tailored to enhance problem-solving skills and creativity.`
    }
  ];

  projects = [
    {
      title: 'Geppetto',
      logo: '../../../assets/Geppetto.png',
      link: 'https://github.com/o-benz/Geppetto'
    },
    {
      title: 'StepByStep',
      logo: '../../../assets/StepByStep.png',
      link: 'https://github.com/o-benz/StepByStep'
    },
    {
      title: 'ROBO-QUEST',
      logo: '../../../assets/ROBOQUEST.png',
      link: 'https://github.com/o-benz/ROBO-QUEST'
    },
    {
      title: 'Mealer',
      logo: '../../../assets/Mealer.png',
      link: 'https://github.com/o-benz/Mealer'
    },
    {
      title: 'SmartyShowdown',
      logo: '../../../assets/SmartyShowdown.png',
      link: 'https://github.com/o-benz/SmartyShowdown'
    },
    {
      title: 'The Polynator',
      logo: '../../../assets/Polynator.png',
      link: 'https://github.com/o-benz/The-Polynator'
    }
  ];

  skills = [
    { name: 'Java', level: 'Advanced' },
    { name: 'Python', level: 'Advanced' },
    { name: 'C/C++', level: 'Advanced' },
    { name: 'C#', level: 'Intermediate' },
    { name: 'SQL', level: 'Advanced' },
    { name: 'JS/TS', level: 'Advanced' },
    { name: 'Kotlin', level: 'Intermediate' },
    { name: 'VBA', level: 'Intermediate' },
    { name: 'R', level: 'Intermediate' },
    { name: 'HTML/CSS', level: 'Advanced' },
    { name: 'XML', level: 'Intermediate' },
    { name: 'Git', level: 'Advanced' },
    { name: 'Linux', level: 'Advanced' },
    { name: 'React', level: 'Intermediate' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'Angular', level: 'Advanced' },
    { name: 'MongoDB', level: 'Intermediate' },
    { name: 'Firebase', level: 'Intermediate' },
    { name: 'AWS', level: 'Advanced' },
    { name: '.NET', level: 'Intermediate' },
    { name: 'Snowflake', level: 'Advanced' },
    { name: 'Docker', level: 'Intermediate' },
    { name: 'Databricks', level: 'Intermediate' },
    { name: 'SAP', level: 'Intermediate' },
    { name: 'SharePoint', level: 'Intermediate' },
    { name: 'Power BI', level: 'Intermediate' },
    { name: 'Excel', level: 'Advanced' },
    { name: 'Powerpoint', level: 'Advanced' },
    { name: 'Jira', level: 'Intermediate' },
    { name: 'Power Apps', level: 'Intermediate' },
    { name: 'Power Automate', level: 'Intermediate' },
    { name: 'Tableau', level: 'Intermediate' }
  ];

  interests = [
    { name: 'Martial Arts', animation: '../../../assets/boxing.mp4', image: '../../../assets/boxing.png' },
    { name: 'Music', animation: '../../../assets/music.mp4', image: '../../../assets/music.png' },
    { name: 'Running', animation: '../../../assets/running.mp4', image: '../../../assets/running.png' },
    { name: 'Working Out', animation: '../../../assets/gym.mp4', image: '../../../assets/gym.png' },
    { name: 'Clean Eating', animation: '../../../assets/clean_eating.mp4', image: '../../../assets/eating.png' },
    { name: 'Friends & Family', animation: '../../../assets/friends_family.mp4', image: '../../../assets/love.png' },
    { name: 'TV Shows', animation: '../../../assets/tv_shows.mp4', image: '../../../assets/tv_shows.png' }
  ];

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
