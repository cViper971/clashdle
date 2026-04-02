import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  return (
    <div className="container">
      <h1>Clashdle</h1>

      <form className="register-form">
        <input type="text" placeholder="Username" />
<input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Create Account</button>
      </form>

      <p className="register-login">Already have an account? <Link to="/">Log in</Link></p>
    </div>
  );
}
