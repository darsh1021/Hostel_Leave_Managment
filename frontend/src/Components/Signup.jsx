import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './signup.css';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return handleError("Fill the information properly");
    }

    const signupinfo = { name, email, password}; 

    try {
      const url = "https://cp-project-5ths.onrender.com/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupinfo)
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/Login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError("Network error: " + err.message);
    }
  };

  return (
    <div className="sign">
      <form className="form_sign" onSubmit={submit}>
        <h1>Signup</h1>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
        <input type="submit" value="Signup" />
        <span style={{ textAlign: "center", color: "#F9F6F3" }}>OR</span>
        <Link to="/">Click to Login</Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
