/* eslint-disable */
const contact = () => {
  return (
      <div
          id="contact"
          className="min-h-440 sm:min-h-330 w-full px-6 bg py-20 flex items-center justify-center relative overflow-hidden"

      >
       
          {/* Rotated Background */}
          <div className="absolute sm:bottom-75 bottom-95 xl:bottom-30 2xl:bottom-0 lg:bottom-70 left-0 w-full h-full -z-10 rotate-180">
              <div className="w-full h-130 bg-black absolute  bottom-320 z-3">
              </div>
              <div className="w-full h-full bg-[url('/src/assets/h-3.svg')] bg-no-repeat bg-top bg-cover" />
          </div>

          {/* Contact Form */}
          <form className="w-full max-w-xl bg-transparent flex flex-col gap-10 text-white">
              <h2 className="text-3xl font-bold text-cyan-400 text-center md:text-left">Contact</h2>

              <div className="flex flex-col md:flex-row gap-8">
                  <input
                      type="text"
                      placeholder="First Name"
                      className="flex-1 bg-white px-4 py-3 rounded-md text-black focus:outline-none"
                  />
                  <input
                      type="text"
                      placeholder="Last Name"
                      className="flex-1 bg-white px-4 py-3 rounded-md text-black focus:outline-none"
                  />
              </div>

              <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="px-4 bg-white py-3 rounded-md text-black focus:outline-none resize-none"
              ></textarea>

              <div className="flex justify-end">
                  <button
                      type="submit"
                      className="bg-white text-black font-medium px-6 py-2 rounded-md hover:bg-cyan-500 hover:text-white transition duration-300"
                  >
                      Submit
                  </button>
              </div>
          </form>
      </div>
  
  
  )
}

export default contact