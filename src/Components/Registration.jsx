import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

import "./Dis.css";
// import Google from "./Google";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    if(!name || !email || !password){
      toast.error("Name, Email, Password are required.", {
        position: "top-right",
      });
    }
    // axios
    //   .post("http://localhost:3000/register", { name, email, password })
    //   .then((result) => {
    //     console.log(result);
    //     toast.success("Registration Successful!", {
    //       position: "top-right",
    //     });
    //     navigate("/login");
    //   })
    //   .catch((err) => console.log(err));


    try {
      const url = "https://doc-man.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({name, email, password})
      });
      const result = await response.json();
      // console.log(result);
      const {success, message, error} = result;
      if(success){
        toast.success("Registration Successful!", {
                position: "top-right",
              });
              setTimeout(()=>{

                navigate("/login");
              },1000)
      }else if(error){
        const details = error?.details[0].message;
        toast.error(details, {
          position: "top-right",
        });
      }else if(!success){
        toast.error(message, {
          position: "top-right",
        });
      }

    } catch (err) {
      console.log(err);
    }



  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="h">
        <>Document Manager</>
      </h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Create your account
        </h2>

        <form onSubmit={register} className="flex flex-col">
          <input
            type="text"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Enter your name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Enter your number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Register
          </button>
          <p className="text-gray-900 mt-4">
            Already have an account?{" "}
            <Link
              className="text-sm text-blue-500 hover:underline mt-4"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>

        {/* <Google /> */}
      </div>
    </div>
  );
};

export default Registration;
