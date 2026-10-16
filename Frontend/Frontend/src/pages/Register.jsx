import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };
    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <form onSubmit={handleClick} style={{ display: "flex", flexDirection: "column", width: "350px", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", gap: "15px" }}>
        <h2 style={{ textAlign: "center", color: "#1877f2" }}>Social Media Register</h2>
        <input placeholder="Username" required ref={username} style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input placeholder="Email" required ref={email} type="email" style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input placeholder="Password" required ref={password} type="password" style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <button type="submit" style={{ padding: "12px", backgroundColor: "#42b72a", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>Sign Up</button>
        <button type="button" onClick={() => navigate("/login")} style={{ padding: "12px", backgroundColor: "#1877f2", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>Log into Account</button>
      </form>
    </div>
  );
}