import React from 'react';
import { FaLinkedin, FaGithub, FaFacebook, FaYoutube } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const linkedInUrl = "https://www.linkedin.com/in/nika-koghuashvili-4889991b4/";
  const githubUrl = "https://github.com/nikakogho/";
  const facebookUrl = "https://www.facebook.com/nikakogho/";
  const youtubeUrl = "https://www.youtube.com/@Playground_Of_Tomorrow/";
  const cvUrl = "https://drive.google.com/file/d/14EhHUF2NRuevu9MWco8qSB-vVd73Dzu2/view?usp=sharing";

  const projects = [
    { name: "Dreamscape Grove", url: "https://github.com/nikakogho/DreamscapeGrove" },
    { name: "Braitenberg Vehicles", url: "https://github.com/nikakogho/BraitenbergVehicles" },
    { name: "Multi-Dimensional Worlds", url: "https://github.com/nikakogho/MultiDimensionalWorlds" },
    { name: "Epic Battle Simulator", url: "https://github.com/nikakogho/EpicBattleSimulator" }
  ];

  const aboutMeText = 'I’m currently working as .NET developer at Microsoft and I’m interested in building superhuman utopia, so trying to learn a little bit about AI, bioengineering, brain-computer-interfaces, space, and robots.';

  return (
    <div>
      <h1>Nika Koghuashvili</h1>
      <p>
        {aboutMeText}
        <br />
        This is my personal website where I share my projects and interests about various topics.
      </p>
      <p>
        You can find my CV <a href={cvUrl} target="_blank" rel="noopener noreferrer">here</a>.
      </p>
      <h2>Some Fun Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.url}><a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a></li>
        ))}
      </ul>
      <h2>Links</h2>
      <div className="social-links">
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="icon-link">
              <FaLinkedin />
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="icon-link">
              <FaGithub />
          </a>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="icon-link">
              <FaFacebook />
          </a>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="icon-link">
              <FaYoutube />
          </a>
      </div>
    </div>
  );
};

export default AboutPage;