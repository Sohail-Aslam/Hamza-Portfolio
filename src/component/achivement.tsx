/* eslint-disable */
const achivement = () => {
    const projects = [
        {
            name: 'Spa-Booking App',
            image: 'src/assets/spa-booking.jpg',
            live: 'https://emhamza.github.io/portfolio/#',
            github: 'https://github.com/emhamza/spa-booking-backend',
            tools: [
                'React',
                'Bootstrap',
                'Mobile Responsive',
                'Ruby on Rails',
                'CSS Modules',
                'PostgreSQL'
            ]
        },
        {
            name: 'Capstone Project 1',
            image: 'src/assets/NES.jpg',
            live: 'https://emhamza.github.io/Capstone-1/index.html',
            github: 'https://github.com/emhamza/Capstone-1',
            tools: [
                'HTML',
                'CSS',
                'Javascript',
                'Bootstrap',
                'Fully Responsive',

            ]
        },
        {
            name: 'House Budget App',
            image: 'src/assets/HB-app.jpg',
            live: 'https://house-budget-app.onrender.com/',
            github: 'https://github.com/emhamza/house-budget-app',
            tools: [
                'Ruby',
                'Rails',
                'RSpec',
                'PostgreSQL',
            ]
        },
        {
            name: 'Space X Missions',
            image: 'src/assets/space-x.jpg',
            live: 'https://space-x-jln2.onrender.com/',
            github: 'https://github.com/emhamza/Space-X',
            tools: [
                'Vite + React',
                'Unit Testing',
                'Mobile Responsive',
            ]
        },
        {
            name: 'Washwood Heath PCN',
            image: 'src/assets/washwoodheath.jpg',
            live: 'https://washwoodheathpcn.co.uk/',
            github: 'https://github.com/emhamza/washwood-heath-pcn',
            tools: [
                'WordPress',
                'CSS',
                'Mobile Responsive',
                'Live Data Feedback Form',
            ]
        },
        {
            name: 'Pak Health Centre',
            image: 'src/assets/pakhealth.jpg',
            live: 'https://pakhealthcentre.nhs.uk/',
            github: 'https://github.com/emhamza/Pak-Health-Centre',
            tools: [
                'WordPress',
                'Mobile Responsive',
                'CSS',
                'Friends & Family Test'
            ]
        },
    ];

    return (
        <div className="">
            <div>
                <h2 className="text-3xl font-bold text-cyan-500 mb-6">Achievements</h2>
                <div className="flex flex-col items-center justify-center gap-10 p-[12%]">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className={`flex flex-col sm:flex-row ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''
                                } w-full max-w-3xl bg-white rounded-2xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl`}
                        >
                            {/* Image Section with Hover Overlay */}
                            <div className="group relative sm:w-1/2 w-full">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="h-48 sm:h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-white text-black text-sm font-semibold rounded hover:bg-cyan-500 hover:text-white transition"
                                    >
                                        Live View
                                    </a>
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-white text-black text-sm font-semibold rounded hover:bg-cyan-500 hover:text-white transition"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </div>

                            {/* Text + Tools Section */}
                            <div className="sm:w-1/2 p-4 flex flex-col justify-center gap-2">
                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                <div className="tools flex flex-wrap gap-2 mt-2">
                                    {project.tools.map((tool, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-200 text-cyan-800 text-sm font-medium px-2 py-1 rounded-md"
                                        >
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      
      
    )
}

export default achivement