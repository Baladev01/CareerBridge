import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const Contact = () => {
    return (
        <>
            <div className="bg-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-center m-4 sm:m-6 md:m-8 mt-6 sm:mt-8 md:mt-10 text-blue-900'>Get in Touch</h1>
                <h1 className="text-gray-700 text-lg sm:text-xl md:text-2xl m-4 sm:m-6 md:m-10 text-center px-4">Have questions? We'd love to hear from you.</h1>
                <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-6xl">
                    <div className="bg-white shadow-lg m-3 sm:m-4 md:m-5 flex items-center p-3 sm:p-4 rounded-2xl hover:-translate-y-1.5 transition duration-300 hover:shadow-2xl w-full sm:w-auto">
                        <IoMdMail className="text-2xl sm:text-3xl text-red-800 flex-shrink-0" />
                        <h1 className="p-2 text-center text-sm sm:text-base">careerbridge@gmail.com</h1>
                    </div>
                    <div className="bg-white shadow-lg m-3 sm:m-4 md:m-5 flex items-center p-3 sm:p-4 rounded-2xl hover:-translate-y-1.5 transition duration-300 hover:shadow-2xl w-full sm:w-auto">
                        <BsFillTelephoneFill className="text-2xl sm:text-3xl text-red-800 flex-shrink-0" />
                        <h1 className="p-2 text-center text-sm sm:text-base">+91 9886459391</h1>
                    </div>
                    <div className="bg-white shadow-lg m-3 sm:m-4 md:m-5 flex items-center p-3 sm:p-4 rounded-2xl hover:-translate-y-1.5 transition duration-300 hover:shadow-2xl w-full sm:w-auto">
                        <FaLocationDot className="text-2xl sm:text-3xl text-red-800 flex-shrink-0" />
                        <h1 className="p-2 text-center text-sm sm:text-base">123 Education St, Tech City, TC 12345</h1>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Contact;