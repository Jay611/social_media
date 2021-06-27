import "./register.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password.current.value !== passwordAgain.current.value) {
        passwordAgain.current.setCustomValidity("Password don't match!");
      } else {
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
        };
        await axios.post("/user/register", user);

        localStorage.setItem("firstLogin", true);

        window.location.href = "/";
      }
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={submitHandler}>
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              className="loginInput"
              ref={username}
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="loginInput"
              ref={email}
            />
            <input
              type="password"
              name="password"
              required
              minLength="6"
              placeholder="Password"
              className="loginInput"
              ref={password}
            />
            <input
              type="password"
              name="passwordAgain"
              required
              placeholder="Password Again"
              className="loginInput"
              ref={passwordAgain}
            />
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <Link style={{ textAlign: "center" }} to="/login">
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
