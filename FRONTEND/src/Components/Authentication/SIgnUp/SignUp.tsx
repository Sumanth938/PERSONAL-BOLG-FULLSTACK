import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faEye,
  faEyeSlash,
  faLock,
  faSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../SignIn/SignIn.css";
import { setItem } from "../../../Utilities/storage";
import store from "../../../Store/store";
import {signUpAPICall} from "../../../Services/Signup";
import { Link,useNavigate } from "react-router-dom";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form submitted:", data);
    const userDetails = {
      fullname: data.name,
      email: data.email,
      password: data.password,
    };

    // Dispatch API call and navigate after success
    dispatchStore(signUpAPICall(userDetails,navigate));
  };

  return (
    <div className="auth-screen-layout">
      <form
        className="sign-in-layout"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span className="heading">Sign Up</span>
        <div className="input-fields-layout">
          <div className="input-field">
            <label htmlFor="email">Full Name</label>
            <div className="input">
              <FontAwesomeIcon className="icon" icon={faUser} />
              <input
                id="name"
                type="name"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Full Name is required",
                })}
              />
              <FontAwesomeIcon icon={faSquare} style={{ color: "white" }} />
            </div>
            {errors.name && (
              <span className="validation-error">{errors.name.message}</span>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="email">Email</label>
            <div className="input">
              <FontAwesomeIcon className="icon" icon={faAt} />
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

          <div className="input-field">
            <label htmlFor="password">Confirm Password</label>
            <div className="input">
              <FontAwesomeIcon className="icon" icon={faLock} />
              <input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your confirm password"
                {...register("confirm_password", {
                  required: "Confirm Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Confirm Password must be at least 8 characters long",
                  },
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password-icon"
              />
            </div>
            {errors.confirm_password && (
              <span className="validation-error">
                {errors.confirm_password.message}
              </span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Sign Up
        </button>
        <span className="below-text">
          Already have an Account?{" "}
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <span className="below-highlighted-text">Sign in</span>
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;
