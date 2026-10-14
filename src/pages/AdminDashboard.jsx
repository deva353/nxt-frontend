
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const username =
    user?.name || user?.username || user?.email?.split("@")[0] || "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="admin-page">
      {/* Top navigation */}
      <header className="admin-navbar">
        <div className="admin-brand">Nxt Assess</div>

        <div className="admin-nav-right">
          <span className="admin-username">{username}</span>

          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Admin welcome section */}
      <main className="admin-content">
        <section className="admin-welcome">
          <p className="admin-eyebrow">ADMIN PORTAL</p>

          <h1>Welcome, {username}!</h1>

          <p className="admin-subtitle">
            Manage questions and assessments from one place.
          </p>
        </section>

        {/* Admin management options */}
        <section className="admin-workspace">
          <h2>Admin Workspace</h2>

          <p className="admin-workspace-description">
            Choose an option to manage your assessment platform.
          </p>

          <div className="admin-management-grid">
            <article className="admin-management-card">
              <div className="admin-card-icon">Q</div>

              <h3>Question Bank</h3>

              <p>
                Add new questions, review existing questions, and organize
                your question bank.
              </p>

              <button
                className="admin-action-button"
                onClick={() => navigate("/admin/questions")}
              >
                Manage Questions <span>→</span>
              </button>
            </article>

            <article className="admin-management-card">
              <div className="admin-card-icon">A</div>

              <h3>Assessments</h3>

              <p>
                Create assessments, configure their duration, and manage
                the questions included in each assessment.
              </p>

              <button
                className="admin-action-button"
                onClick={() => navigate("/admin/assessments")}
              >
                Manage Assessments <span>→</span>
              </button>
            </article>

            <article className="admin-management-card">
              <div className="admin-card-icon">S</div>

              <h3>Student Portal</h3>

              <p>
                Open the student assessment page to review the student
                experience.
              </p>

              <button
                className="admin-action-button"
                onClick={() => navigate("/")}
              >
                View Student Portal <span>→</span>
              </button>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
