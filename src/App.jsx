
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/adminDashboard";
import QuestionBank from "./pages/QuestionBank";
import AssessmentManager from "./pages/AssessmentManager";
import TakeAssessment from "./pages/TakeAssessment";
import Results from "./pages/Results";

import "./App.css";

function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="loading">Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow only the roles listed for this route.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="loading">Checking session...</p>;
  }

  return (
    <Routes>
      {/* Login */}
        <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin" : "/"}
              replace
            />
            
          ) : (
            <Login />
            
          )
        }
        
      />

      {/* Student dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin question bank */}
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <QuestionBank />
          </ProtectedRoute>
        }
      />

      {/* Admin assessment manager */}
      <Route
        path="/admin/assessments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AssessmentManager />
          </ProtectedRoute>
        }
      />

      {/* Student takes an assessment */}
      <Route
        path="/take-assessment/:assessmentId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <TakeAssessment />
          </ProtectedRoute>
        }
      />

      {/* Student views results */}
      <Route
        path="/results/:attemptId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Results />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? user.role === "admin"
                  ? "/admin"
                  : "/"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
