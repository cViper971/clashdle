import { Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="container">
      <h1>Clashdle</h1>

      <form className="login-form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Log In</button>
      </form>

      <p className="login-signup">Don't have an account? <Link to="/register">Sign up</Link></p>
    </div>
  );
}
