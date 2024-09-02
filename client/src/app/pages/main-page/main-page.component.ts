import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class MainPageComponent {
  cardStyles = {};
  isFlipped = false;
  experiences = [
    {
      title: 'Data Engineering Analyst',
      company: 'National Bank of Canada',
      duration: 'May 2024 – December 2024',
      BP1: `• Manage real-time, near real-time (NRT) or batch (MFT) data ingestion processes using Kafka or AWS, ensuring availability and governance of certified data across analytical platforms utilizing proficiency in Python and SQL.`,
      BP2: `• Lead Agile ceremonies as Scrum Master, drive efficient CI/CD practices through DevOps principles, and train a new team member to full operational capacity within two weeks. Resolve 93% of data flow incidents within SLA.`,
      BP3: `• Engineer innovative solutions to streamline data ingestion workflows using Snowflake and Databricks, reducing processing times, volumes, and associated costs by nearly 30% while upholding data quality standards.`
    },
    {
      title: 'Software Engineer Intern',
      company: 'ADM Montreal Airports',
      duration: 'May 2023 – September 2023',
      BP1: `• Develop and implement various scripts and programs in diverse languages (Python, JS, VBA) to automate menial and repetitive tasks, resulting in a 20% increase in overall operational efficiency.`,
      BP2: `• Perform data analysis and processing using platforms such as Power BI, Jupyter, or MySQL to extract insights, identify patterns, and present findings through clear reports to support data-driven decision-making.`,
      BP3: `• Lead software projects from inception to completion, ensure seamless integration of front-end and back-end components while delivering robust solutions increasing user satisfaction by over 15%.`
    },
    {
      title: 'Coding Instructor',
      company: 'Collège international Marie de France',
      duration: 'September 2020 – Present',
      BP1: `• Teach the basics of programming and computer science to a group of 30 young students.`,
      BP2: `• Design a fun and complete curriculum to foster curiosity and interest in a software-related career.`,
      BP3: `• Develop interactive coding projects and exercises tailored to enhance problem-solving skills and creativity.`
    }
  ];

  projects = [
    {
      title: 'StepByStep',
      logo: '../../../assets/StepByStep.png',
      link: 'https://github.com/o-benz/StepByStep'
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
      title: 'AstroBot',
      logo: '../../../assets/AstroBot.png',
      link: '#'
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
    { name: 'C/C++', level: 'Intermediate' },
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
    { name: 'Martial Arts', animation: '../../../assets/boxing.webm'},
    { name: 'Music', animation: '../../../assets/guitarist.webm'},
    { name: 'Running', animation: '../../../assets/running.webm'},
    { name: 'Teaching', animation: '../../../assets/teaching.webm'},
    { name: 'Working Out', animation: '../../../assets/gym.webm'},
    { name: 'Football', animation: '../../../assets/football.webm'}
  ];

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resetCardPosition();
  }

  onMouseMove(event: MouseEvent): void {
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

  resetCardPosition(): void {
    this.cardStyles = {
      transform: `rotateX(0) rotateY(${this.isFlipped ? 180 : 0}deg)`
    };
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
    this.cardStyles = {
      transform: `rotateX(0) rotateY(${this.isFlipped ? 180 : 0}deg)`
    };
  }
}
