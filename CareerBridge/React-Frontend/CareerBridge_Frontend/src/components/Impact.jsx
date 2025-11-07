import { Link } from "react-router-dom";

const Impact = () => {







    return (
        <>




            

            <div className=" bg-gradient-to-r from-black/90 to-blue-700 flex justify-center items-center flex-col p-9">
                <h1 className="text-white text-shadow-2xs font-extrabold text-4xl pl-9 pr-9 pt-9 pb-4">Join Career Bridge Today</h1>
                <h2 className=" text-white pt-0 p-5">Whether you are a Student, Government, or Company — this is your platform to build a better future.</h2>

                <Link to="/loginform">
                    <button className=' border-0  p-3 w-52 rounded-full m-5 mb-9  bg-gradient-to-r  from-green-800 to-green-500  text-white font-bold cursor-pointer hover:-translate-y-1.5 transform transition duration-400'>Register Now</button>
                </Link>
            </div>



        </>
    )

}
export default Impact;