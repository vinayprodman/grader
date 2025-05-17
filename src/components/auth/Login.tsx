import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../common/Loading";
import graderLogo from "../../assets/grader_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await googleSignIn();
      navigate(from);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="Signing in..." fullScreen />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <img
            src={graderLogo}
            alt="Grader Logo"
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              marginBottom: 10,
            }}
          />
          <h1>
            Welcome to <span style={{ color: "#4a6ee0" }}>grader</span>!
          </h1>
          <h2>Sign in to continue your learning journey</h2>
        </div>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              padding: "10px",
              background: "#ffebee",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
              disabled={isLoading}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              background: "#4a6ee0",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: "15px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ color: "#666" }}>or</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#fff",
            color: "#444",
            border: "1px solid #dadce0",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: 600,
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 1px 2px rgba(60,64,67,.08)",
            transition: "box-shadow 0.2s",
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseOver={(e) =>
            !isLoading &&
            (e.currentTarget.style.boxShadow = "0 2px 4px rgba(60,64,67,.15)")
          }
          onMouseOut={(e) =>
            !isLoading &&
            (e.currentTarget.style.boxShadow = "0 1px 2px rgba(60,64,67,.08)")
          }
        >
          <svg width="24" height="24" viewBox="0 0 48 48">
            <clipPath id="g">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
            </clipPath>
            <g className="colors" clipPath="url(#g)">
              <path fill="#FBBC05" d="M0 37V11l17 13z" />
              <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
              <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
              <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
            </g>
          </svg>
          Sign in with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#4a6ee0",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up here
          </Link>
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <p style={{ marginBottom: "5px", fontWeight: 500 }}>Demo Account:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 