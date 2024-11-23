import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLock,
  faSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./SignIn.css";
import { setItem } from "../../../Utilities/storage";
import store from "../../../Store/store";
import { SigninApiCall } from "../../../Services/SignIn";
import { signUpAPICall } from "../../../Services/Signup";
import { Link, useNavigate } from "react-router-dom";


interface FormValues {
  email: string;
  password: string;
}

const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const loginDetails = {
      username: data?.email,
      password: data?.password,
    };
    dispatchStore(SigninApiCall(loginDetails));
  };

  return (
    <div className="auth-screen-layout">
      <form
        className="sign-in-layout"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span className="heading">Sign In</span>
        <div className="input-fields-layout">
          {/* Email Field */}
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <div className="input">
              <FontAwesomeIcon className="icon" icon={faUser} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
              <FontAwesomeIcon icon={faSquare} style={{ color: "white" }} />
            </div>
            {errors.email && (
              <span className="validation-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <div className="input">
              <FontAwesomeIcon className="icon" icon={faLock} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 7,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-icon"
              />
            </div>
            {errors.password && (
              <span className="validation-error">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Sign In
        </button>
        <span className="below-text">
          Don’t have an Account?{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <span className="below-highlighted-text">Sign Up</span>
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignIn;
