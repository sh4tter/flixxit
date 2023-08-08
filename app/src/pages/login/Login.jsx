import { useContext, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import "./login.scss";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password }, dispatch);
      setIsLoading(false); // Set loading to false when login is successful
    } catch (error) {
      setIsLoading(false); // Set loading to false if login fails
      // Handle error, display a message, etc.
    }
  };
  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://imgtr.ee/images/2023/07/29/874aa6d159c78664eba369521a387358.webp"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email or phone number"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="loginButton"
            onClick={handleLogin}
            disabled={isFetching || isLoading} // Disable the button when fetching or loading
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
          <span>
            New to Flixxit?{" "}
            <Link to="/register" className="signupButton">
              <b>Sign up now.</b>
            </Link>
          </span>
          {/* <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small> */}
        </form>
        {/* enable captch from google with secret key */}
        {/* <form action="?" method="POST">
      <div class="g-recaptcha" data-sitekey="6LdZfUgnAAAAACtHI4Soi5RPMTvwUjCUG6D4SGcw"></div>
      <br/>
      <input type="submit" value="Submit"></input>
    </form> */}
      </div>
    </div>
  );
}
