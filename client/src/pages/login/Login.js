import { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", { ...user });

      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
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
              type="email"
              name="email"
              required
              placeholder="Email"
              className="loginInput"
              onChange={onChangeInput}
            />
            <input
              type="password"
              name="password"
              required
              minLength="6"
              placeholder="Password"
              className="loginInput"
              onChange={onChangeInput}
            />
            <button className="loginButton" type="submit">
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link style={{textAlign:"center"}} to='/register'>
              <button className="loginRegisterButton">
                Create a New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
