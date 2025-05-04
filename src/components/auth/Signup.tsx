import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import graderLogo from "../../assets/grader_logo.png";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const gradeOptions = [
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || age === "" || !grade) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      setIsLoading(true);
      await register(email, password, name, age, grade);
      navigate("/"); // Go directly to dashboard
    } catch (err) {
      setError("Failed to create an account. Try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            Join <span style={{ color: "#4a6ee0" }}>grader</span>!
          </h1>
          <h2>Create your account to start your learning journey</h2>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

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
              placeholder="Create a Password"
              required
              minLength={6}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              className="input-field"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              placeholder="Your Age"
              min={5}
              max={15}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label htmlFor="grade">Grade Level</label>
            <select
              id="grade"
              className="input-field"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="" disabled>
                Select Your Grade
              </option>
              {gradeOptions.map((gradeOption) => (
                <option key={gradeOption} value={gradeOption}>
                  {gradeOption}
                </option>
              ))}
            </select>
          </div>

          <button
            aria-busy
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
            }}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }}
          />
          <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>
            OR
          </span>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }}
          />
        </div>

        {/* Google Sign Up */}
        <button
          onClick={googleSignIn}
          style={{
            width: "100%",
            padding: "10px",
            background: "#fff",
            color: "#444",
            border: "1px solid #dadce0",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 1px 2px rgba(60,64,67,.08)",
            transition: "box-shadow 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow = "0 2px 4px rgba(60,64,67,.15)")
          }
          onMouseOut={(e) =>
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
          Sign up with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#4a6ee0",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
