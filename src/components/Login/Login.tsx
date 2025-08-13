"use client";

import { useForm } from "react-hook-form";
import image1 from "../../assets/career.jpg";
import type { UserRequestApi } from "../Interfaces";
import AuthService from "../../config/AuthService";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequestApi>({
    defaultValues: {
      userId: "",
      password: "",
    },
  });


  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: UserRequestApi) => {
    console.log(data);
    AuthService.login(data)
      .then((response) => {
        console.log("Login successful:", response);
        sessionStorage.setItem("role", response.role);
        console.log("Role:", response.role);
        sessionStorage.setItem("token", response.accessToken);
        if (response.role === "admin") {
          navigate("/dashboard/admin/profile");
        }else if (response.role === "student") {
        navigate("/dashboard/student");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle the error, e.g., show a notification or alert
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={image1 || "/placeholder.svg"}
          alt="Career Image"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div> */}
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-50 to-teal-200">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white/50 p-8 rounded-2xl shadow-xl border border-gray-100">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  {...register("userId", { required: "Username is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your username"
                />
                {errors.userId && (
                  <p className="text-red-500 text-sm">
                    {errors.userId.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-8 bg-teal-800  hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <NavLink
                to="/registration"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
