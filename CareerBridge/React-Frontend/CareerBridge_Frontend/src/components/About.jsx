import { FaBuildingColumns } from "react-icons/fa6";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { PiStudentBold } from "react-icons/pi";

const About = () => {
    return (
        <>
            <div className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-4">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="text-teal-700 text-sm font-semibold">Why Choose Us</span>
                        </div>
                        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4'>Why Choose Career Bridge?</h1>
                        <h2 className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Comprehensive platform connecting students, government, and companies for seamless career development and talent acquisition</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* For Students Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-teal-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <PiStudentBold /> 
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">For Students</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                        Upload your academics, projects, and placement information. Get government scholarships during your studies and bonus money when you secure placement in your final year.
                                    </p>
                                </div>
                                
                            </div>
                        </div>

                        {/* For Government Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <FaBuildingColumns />
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">For Government</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                        Monitor colleges, track quality of education, measure employment outcomes, and support deserving students financially with data-driven insights.
                                    </p>
                                </div>
                                
                            </div>
                        </div>

                        {/* For Companies Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-indigo-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <HiBuildingOffice2 />
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">For Companies</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                        Post job requirements, find skilled students from top institutions, and contribute to education growth by building strong campus partnerships.
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                  
                </div>
            </div>
        </>
    )
}

export default About;