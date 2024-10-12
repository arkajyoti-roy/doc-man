import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dis.css";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Handle input change for email and password fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Generic error handler (You can customize this to show a toast or other error UI)
  const handleError = (message) => {
    console.error("Error: ", message);
    toast.success(message, {
      position: "top-right",
    });
  };

  // Generic success handler
  const handleSuccess = (message) => {
    console.log("Success: ", message);
    toast.success(message, {
      position: "top-right",
    });
    
  };

  // Login request handler
  const request = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required.");
    }

    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess("Login successful");
        localStorage.setItem('token', jwtToken); // Store JWT token in local storage
        localStorage.setItem('loggedInUser', name); // Store logged-in user name
        // toast.success("Registration Successful!", {
        //   position: "top-right",
        // });
       
        setTimeout(() => {
          navigate('/display'); // Navigate to home after login
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || "Login failed";
        handleError(details); // Handle errors from the backend
      } else {
        handleError(message); // Handle custom error messages
      }

    } catch (err) {
      handleError("Something went wrong. Please try again later.");
      console.error(err); // Log the error for debugging
    }
  };
  

  return (
    <>
      <div className="logcen">
        <h1 className="hq">
          <>Document Manager</>
        </h1>
        <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden ">
          <div className="flex flex-col justify-center items-start space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            <p className="text-slate-500">Enter details below.</p>
          </div>
          <form onSubmit={request} className="w-full mt-4 space-y-3">
            <div>
              <input
                className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
                placeholder="Email"
                id="email"
                name="email"
                type="email"
                value={loginInfo.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
                placeholder="Password"
                id="password"
                name="password"
                type="password"
                value={loginInfo.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="mr-2 w-4 h-4"
                  id="remember"
                  name="remember"
                  type="checkbox"
                />
                <span className="text-slate-500">Remember me </span>
              </div>
              <a className="text-white font-medium hover:underline" href="#">
                Forgot Password
              </a>
            </div>
            <button
              className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2"
              id="login"
              name="login"
              type="submit"
            >
              login
            </button>
            <p className="flex justify-center space-x-1">
              <span className="text-slate-700"> Have an account? </span>
              <Link
                className="text-blue-500 hover:underline"
                to="/registration"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
