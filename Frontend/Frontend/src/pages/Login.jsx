import { useRef, useContext, useState } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const username = useRef();
  const [isRegister, setIsRegister] = useState(false);
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (isRegister) {
      alert("Registration form submitted! You can now log in.");
      setIsRegister(false);
    } else {
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <div style={{ width: "380px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Title and Subtitle with proper gap */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h3 style={{ fontSize: "42px", fontWeight: "800", color: "#1775ee", margin: "0" }}>SocialApp</h3>
          <span style={{ fontSize: "16px", color: "#555", display: "block", marginTop: "15px" }}>
            Connect with friends and the world around you.
          </span>
        </div>

        {/* Form Box */}
        <form onSubmit={handleClick} style={{ width: "100%", backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 16px -8px rgba(0, 0, 0, 0.3)", display: "flex", flexDirection: "column", gap: "15px" }}>
          {isRegister && (
            <input
              placeholder="Username"
              type="text"
              required
              ref={username}
              style={{ height: "45px", borderRadius: "6px", border: "1px solid #ccc", paddingLeft: "15px", fontSize: "16px", outline: "none" }}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            required
            ref={email}
            style={{ height: "45px", borderRadius: "6px", border: "1px solid #ccc", paddingLeft: "15px", fontSize: "16px", outline: "none" }}
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            ref={password}
            style={{ height: "45px", borderRadius: "6px", border: "1px solid #ccc", paddingLeft: "15px", fontSize: "16px", outline: "none" }}
          />
          <button type="submit" disabled={isFetching} style={{ height: "45px", borderRadius: "6px", border: "none", backgroundColor: "#1775ee", color: "white", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>
            {isFetching ? "Loading..." : (isRegister ? "Sign Up" : "Log In")}
          </button>

          <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ height: "40px", borderRadius: "6px", border: "none", backgroundColor: "#42b72a", color: "white", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginTop: "5px" }}>
            {isRegister ? "Already have an account? Log In" : "Create a New Account"}
          </button>
        </form>

      </div>
    </div>
  );
}