import { useState, useContext, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isStudent, setIsStudent] = useState(false);
  const [error, setError] = useState(null);
  const { loggedIN } = useContext(AppContext);
  const [roleId] = useState(5);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const [ip, setIp] = useState("");
  const [isAllowedNewRegistration, setIsAllowedNewRegistration] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // NOTE: Use /api/login here to hit Laravel api.php routes
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: credentials.email,
        password: credentials.password,
      });

      const access_token = response.data.access_token;
      const userData = response.data.user;

      loggedIN(access_token, userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Google login code (left mostly unchanged)
  const handleGoogleLogin = async (googleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/OAUTH2`, {
        credentials: googleData,
        role_id: roleId,
      });

      if (response.status === 200) {
        const access_token = response.data.access_token;
        const userData = response.data.user;

        loggedIN(access_token, userData);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        handleGoogleLogin(JSON.stringify(userInfo));
      } catch (error) {
        console.error("Error fetching Google user info:", error);
      }
    },
    onError: (error) => console.error("Google Login Failed:", error),
  });

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setIp(response.data.ip);
      } catch (error) {
        console.error("Failed to get IP:", error);
      }
    };

    fetchIp();
  }, []);

  const newRegistrationBanner = isAllowedNewRegistration ? (
    <div className="alert alert-success text-center mt-3">
      ✅ New Registrations are now allowed!
    </div>
  ) : null;

  return (
    <div className="hold-transition login-page"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1599725427295-6ed79ff8dbef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sJTIwYnVpbGRpbmd8ZW58MHx8MHx8&w=1000&q=80')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      }}
    >
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center">
            <img src={`${process.env.PUBLIC_URL}/images/header-logo.png`} alt="Logo" className="img-fluid" style={{ maxWidth: '70%' }} />
            <h2 className="mt-4 mb-3">Welcome to School</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="User Name"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text"><span>&#9993;</span></div>
              </div>
            </div>

            <div className="input-group mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text"><span>&#128274;</span></div>
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
                checked={isStudent}
                onChange={() => setIsStudent(!isStudent)}
              />
              <label className="form-check-label" htmlFor="remember">I'm a Student</label>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">Sign In</button>
            </div>

            {error && (
              <div className="mt-3 text-danger text-center">{error}</div>
            )}
          </form>

          {newRegistrationBanner}
        </div>
      </div>
    </div>
  );
}
