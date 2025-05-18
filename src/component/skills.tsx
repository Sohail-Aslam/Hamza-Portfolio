/* eslint-disable */
import { useState } from 'react';

const skills = [
  {
    name: 'HTML5',
    src: 'src/assets/html.png',
    description:
      'HTML is the standard markup language for building web pages. It defines the structure of content on the web using elements and tags.'
  },
  {
    name: 'Bootstrap',
    src: 'src/assets/bootstrap.png',
    description:
      'Bootstrap is a popular CSS framework for responsive web design. It offers prebuilt components and utility classes to speed up UI development.'
  },
  {
    name: 'WordPress',
    src: 'src/assets/wordpress.png',
    description:
      'WordPress is a content management system (CMS) used to create websites. It is known for its ease of use and extensive plugin ecosystem.'
  },
  {
    name: 'Figma',
    src: 'src/assets/figma.png',
    description:
      'Figma is a collaborative interface design tool. It allows teams to design, prototype, and iterate on digital products in real-time.'
  },
  {
    name: 'GitHub',
    src: 'src/assets/github.png',
    description:
      'GitHub is a code hosting platform for version control using Git. It facilitates collaboration through features like pull requests and issues.'
  },
  {
    name: 'Vite',
    src: 'src/assets/vite.png',
    description:
      'Vite is a fast frontend build tool for modern web projects. It provides lightning-fast hot module replacement and optimized builds.'
  },
  {
    name: 'SEO',
    src: 'src/assets/seo.png',
    description:
      'SEO stands for Search Engine Optimization. It involves optimizing websites to rank higher in search engine results and increase visibility.'
  },
  {
    name: 'Git',
    src: 'src/assets/git.png',
    description:
      'Git is a distributed version control system. It helps track changes in source code and supports branching and collaboration.'
  },
  {
    name: 'React',
    src: 'src/assets/react2.png',
    description:
      'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient updates.'
  },

  {
    name: 'Redux Observable',
    src: 'src/assets/redux.png',
    description:
      'Redux Observable is a middleware for Redux using RxJS. It allows you to handle complex asynchronous logic like side effects using reactive programming with observables.'

  },
  {
    name: 'Node.js',
    src: 'src/assets/nodejs.png',
    description:
      'Node.js is a runtime for running JavaScript on the server. It enables building scalable, event-driven applications using non-blocking I/O.'
  },
  {
    name: 'VS Code',
    src: 'src/assets/vscode.png',
    description:
      'Visual Studio Code is a source code editor. It supports extensions, debugging, and Git integration, and is highly customizable.'
  },
  {
    name: 'TypeScript',
    src: 'src/assets/typescript.png',
    description:
      'TypeScript is a typed superset of JavaScript. It adds optional static typing to catch errors early and enhance developer tooling.'
  },
  {
    name: 'JavaScript',
    src: 'src/assets/javascript.png',
    description:
      'JavaScript is a programming language for web development. It allows you to create interactive and dynamic content on websites.'
  },
  {
    name: 'CSS3',
    src: 'src/assets/css.png',
    description:
      'CSS is used to style HTML documents. CSS3 introduced features like flexbox, animations, and media queries for responsive design.'
  }
];


export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  return (
    <div className="w-full max-w-screen px-4">
      <div>
        <h2 className="text-3xl font-bold text-cyan-500 mb-6 text-left">Skills</h2>
        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-100 sm:w-100 max-w-md">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="p-6 border-2 border-cyan-200 rounded-xl shadow-md cursor-pointer hover:scale-125 transition-transform"
                onClick={() => setSelectedSkill(skill)}
              >
                <img src={skill.src} alt={skill.name} className="w-12 h-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSkill && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedSkill(null)}
        >
          <div
            className="border-2 border-cyan-200 bg-white p-10 rounded-lg shadow-lg max-w-sm text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedSkill(null)}
            >
              ✕
            </button>
            <img src={selectedSkill.src} alt={selectedSkill.name} className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{selectedSkill.name}</h3>
            <p className="text-gray-600">{selectedSkill.description}</p>
          </div>
        </div>
      )}
    </div>
  
  );
}
