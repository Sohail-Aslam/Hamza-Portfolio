/* eslint-disable */
const certifications = [
    {
        stack: 'Full Stack Developer',
        link: 'https://www.credential.net/2bd7f2c3-a2a6-407f-b69b-f58b4e7db419',
        label: 'Certificate of completition Full Stack Development where I spent 2000+ hours in coding',
    },
    {
        stack: 'Ruby on Rails',
        link: 'https://www.credential.net/b91e20c8-2e61-4846-8617-a61d16aa8f23#gs.4prjr0',
        label: 'Certificate of completition Ruby on Rails module',
    },
    {
        stack: 'React Redux',
        link: 'https://www.credential.net/eff8ab36-5dcb-4231-bde1-8fa9ac2c3595#gs.4pri7j',
        label: 'React Redux Certification',
    },
    {
        stack: 'React',
        link: 'https://www.credential.net/8d64cecf-76ff-4a62-b902-fb55044472da#gs.4prfg3',
        label: 'React Certification',
    },
    {
        stack: 'HTML/CSS',
        link: 'https://www.credential.net/7fabfbf0-5689-451d-96d4-2a7ebe05b27b#gs.4prdha',
        label: 'HTML/CSS Certification',
    },
    {
        stack: 'Ruby',
        link: 'https://www.credential.net/9591b33c-d624-4bb0-b825-fed5ad0015f4#gs.4pr7ny',
        label: 'Ruby Certification',
    },
];

const Certifications = () => {
    return (
        <div className="px-4 py-8 max-w-xl ">
            <h2 className="text-3xl font-bold text-cyan-500 mb-6">Certifications</h2>
            <div className="overflow-x-auto">
                <table className="min-w-ful bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        <tr>
                            <th className="p-4">Stack</th>
                            <th className="p-4">Link</th>
                            <th className="p-4">Organization</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {certifications.map((cert, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-4">{cert.stack}</td>
                                <td className="p-4 text-cyan-600 underline">
                                    <a href={cert.link} target="_blank" rel="noopener noreferrer">
                                        {cert.label}
                                    </a>
                                </td>
                                <td className="p-4">
                                    <a
                                        href="https://www.microverse.org/"
                                        className="text-blue-500 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Microverse
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Certifications;
