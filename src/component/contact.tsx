import { useBomb } from '../Context/BombContext';
import './socialicons.css'
import { FaGithub, FaTwitter, FaCodepen } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
const Contact = () => {
    const {
        calculateHitElements,
        hitElementsTransforms,
        elementRefs,
    } = useBomb();



    // --- Helper Function: getStyle ---
    const getStyle = (id: string) => ({
        // Use optional chaining for hitElementsTransforms.get() here as well
        transform: hitElementsTransforms?.get(id) || 'none',
        transition: 'transform 0.4s ease-out',
    });

    return (
        <>
            <section
                id="contact"
                className="section-container p-5 sm:p-10 my-12 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
                onClick={calculateHitElements}
            >
                <h2 className="text-4xl font-bold mb-8" style={{ color: '#32cacd' }}>
                    {"Get in Touch".split(" ").map((word, i) => (
                        <span
                            key={`heading-word-${i}`}
                            ref={(el) => {
                                // Null check for elementRefs.current before assignment
                                if (elementRefs?.current) {
                                    elementRefs.current[`heading-word-${i}`] = el;
                                }
                            }}
                            style={getStyle(`heading-word-${i}`)}
                            className="inline-block mr-2"
                        >
                            {word}
                        </span>
                    ))}
                </h2>

                <p className="text-lg text-gray-700 mb-8 max-w-2xl flex flex-wrap justify-center">
                    {"Have a question or a project in mind? We'd love to hear from you! Reach out to us through the form below.".split(" ").map((word, i) => (
                        <span
                            key={`text-word-${i}`}
                            ref={(el) => {
                                // Null check for elementRefs.current before assignment
                                if (elementRefs?.current) {
                                    elementRefs.current[`text-word-${i}`] = el;
                                }
                            }}
                            style={getStyle(`text-word-${i}`)}
                            className="inline-block mr-1 mb-1"
                        >
                            {word}
                        </span>
                    ))}
                </p>

                <form
                    className="w-full max-w-lg bg-white p-4 sm:p-8 rounded-xl shadow-md"
                    ref={(el) => {
                        // Null check for elementRefs.current before assignment
                        if (elementRefs?.current) {
                            elementRefs.current['contact-form'] = el;
                        }
                    }}
                    style={getStyle('contact-form')}
                >
                    {['name', 'email', 'message'].map((field) => (
                        <div className="mb-6" key={field}>
                            {field === 'message' ? (
                                <textarea
                                    placeholder="Your Message"
                                    rows={6}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                    ref={(el) => {
                                        // Null check for elementRefs.current before assignment
                                        if (elementRefs?.current) {
                                            elementRefs.current[`input-${field}`] = el;
                                        }
                                    }}
                                    style={getStyle(`input-${field}`)}
                                ></textarea>
                            ) : (
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                    ref={(el) => {
                                        // Null check for elementRefs.current before assignment
                                        if (elementRefs?.current) {
                                            elementRefs.current[`input-${field}`] = el;
                                        }
                                    }}
                                    style={getStyle(`input-${field}`)}
                                />
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-indigo-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-cyan-600 transform hover:scale-105 transition duration-300 ease-in-out flex justify-center flex-wrap gap-1"
                        style={{ background: '#32cacd' }}
                    >
                        {"Send Message".split(" ").map((word, i) => (
                            <span
                                key={`button-word-${i}`}
                                ref={(el) => {
                                    // Null check for elementRefs.current before assignment
                                    if (elementRefs?.current) {
                                        elementRefs.current[`button-word-${i}`] = el;
                                    }
                                }}
                                style={getStyle(`button-word-${i}`)}
                                className="inline-block"
                            >
                                {word}
                            </span>
                        ))}
                    </button>
                </form>
            </section>

            <footer className="py-10 bg-gray-200 text-white">
                <div className="container mx-auto xs:px-8 px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center">

                    {/* Left Side: Avatar + Email */}
                    <div className="flex flex-col items-start space-y-4 mb-10 md:mb-0">
                        <img
                            src="src/assets/avatar/avatar.png"
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <a
                            href="mailto:imumairhamza@gmail.com"
                            className="text-black hover:text-peach transition underline text-sm"
                        >
                            imumairhamza@gmail.com
                        </a>
                    </div>

                    {/* Right Side: Links + Social */}
                    <div className="flex flex-col items-start md:items-end space-y-6 text-black gap-10">

                        {/* Navigation Links */}
                        <div className="flex flex-wrap justify-center gap-4 sm:space-x-8 text-sm sm:text-base">
                            <a href="#home" className="hover:text-peach transition">Home</a>
                            <a href="#about" className="hover:text-peach transition">About</a>
                            <a href="#achivement" className="hover:text-peach transition">Projects</a>
                            <a href="#resume" className="hover:text-peach transition">Skills</a>
                            <a href="#certificates" className="hover:text-peach transition">Certificates</a>
                            <a href="#contact" className="hover:text-peach transition">Contact</a>
                        </div>


                        {/* Social Icons */}
                        <ul className="social-list">
                            <li>
                                <a href="#" className="apple">
                                    <FaGithub className='fab' />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="instagram">
                                    <IoMdMail className='fab' />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="twitter">
                                    <FaTwitter className='fab' />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="facebook">
                                    <FaLinkedin className='fab' />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="apple">
                                    <FaCodepen className='fab' />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

        </>
    );
};

export default Contact;