/* eslint-disable */
import { FaGithub, FaTwitter, FaCodepen } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { GoMoveToEnd } from "react-icons/go";

const header = () => {
  return (
    <div
      className="min-h-320 sm:min-h-330 md:min-h-330 lg:min-h-440 bg-cover bg-center flex px-[10%] pt-[7%]  bg-[url('/src/assets/h-3.svg')]
    sm:bg-[url('/src/assets/md-h-bg.svg')]
    
"
    >
      <div className="flex flex-col-reverse md:flex-row  w-full ">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-16 text-white">
          <div className="flex flex-col gap-8">

            <h1 className="mt-6 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-tight" style={{ color: '#32cacd' }}>
              Hello, World! <br /> I am Umair Hamza.
            </h1>

            <h3 className="text-lg sm:text-xl">
              I'm an optimist 🤓 <br /> who enjoys spreading positivity 🤪 wherever I go.
            </h3>
          </div>
          <a
            href="#"
            className="relative inline-flex items-center justify-center px-4 py-2 w-fit overflow-hidden font-medium tracking-tight text-black bg-white border-2 border-[#32cacd] rounded-full group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500 rounded-full group-hover:w-40 group-hover:h-40"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-20 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition duration-300">
              Contact me <GoMoveToEnd />
            </span>
          </a>
          <div className="flex gap-8 md:text-2xl lg:text-3xl">
            <FaGithub className="hover:text-[#32cacd] transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer duration-300" />
            <FaLinkedin className="hover:text-[#32cacd] transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer duration-300" />
            <IoMdMail className="hover:text-[#32cacd] transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer duration-300" />
            <FaTwitter className="hover:text-[#32cacd] transition-transform transform hover:-translate-y-1 hover:shadow-xl cursor-pointer duration-300" />
            <FaCodepen className="hover:text-[#32cacd] transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Right image */}
        <div className="flex justify-center">
          <img
            src="src/assets/avatar.png"
            alt="avatar"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default header