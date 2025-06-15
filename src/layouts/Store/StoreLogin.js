import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../Login/LoginPage.css";
import logo from '../../Login/fivlialogo.png'

function StoreLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const id = location.state;
    setId(id)

  }, [])
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "fivlia" && password === "fivlia@123") {
      localStorage.setItem("userType", "store");
      alert("Login successful");
      localStorage.setItem('storeId', id)
      window.location.href = "/dashboard1";
    }
    else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <img src={logo} style={{ width: '130px', display: 'flex', justifyContent: 'center', alignSelf: 'center' }} />
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default StoreLogin;
