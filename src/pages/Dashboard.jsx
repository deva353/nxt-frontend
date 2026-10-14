
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username =
    user?.name || user?.username || user?.email?.split("@")[0] || "Student";

  useEffect(() => {
    let active = true;

    async function fetchAssessments() {
      try {
        const response = await api.get("/assessments");

        if (active) {
          const data = response.data;
          setAssessments(
            Array.isArray(data) ? data : data.assessments || []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load assessments. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAssessments();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="student-page">
      <header className="student-navbar">
        <div className="student-brand">Nxt Assess</div>

        <div className="student-nav-right">
          <span className="student-username">{username}</span>
          <button className="student-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="student-content">
        <section className="student-welcome">
          <p className="student-eyebrow">STUDENT PORTAL</p>

          <h1>Welcome, {username}!</h1>

          <p className="student-subtitle">
            Choose an assessment to test your knowledge.
          </p>
        </section>

        <section className="available-assessments">
          <h2>Available assessments</h2>

          {loading && <p>Loading assessments...</p>}

          {!loading && error && (
            <p className="student-message student-error">{error}</p>
          )}

          {!loading && !error && assessments.length === 0 && (
            <p className="student-message">
              No published assessments are available yet.
            </p>
          )}

          {!loading && !error && assessments.length > 0 && (
            <div className="assessment-list">
              {assessments.map((assessment) => (
                <article
                  className="assessment-card"
                  key={assessment._id || assessment.id}
                >
                  <h3>{assessment.title || assessment.name}</h3>

                  <p>
                    {assessment.description ||
                      "Test your knowledge with this assessment."}
                  </p>

                  {assessment.duration != null && (
                    <p className="assessment-duration">
                      Duration: {assessment.duration} minutes
                    </p>
                  )}

                  <button
                    className="assessment-start"
                    onClick={() =>
                      navigate(
                        `/take-assessment/${
                          assessment._id || assessment.id
                        }`
                      )
                    }
                  >
                    Start assessment
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
