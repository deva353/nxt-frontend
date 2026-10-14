import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Results() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await api.get(`/attempts/${id}`);

        if (response.data.status === "in-progress") {
          setError("This assessment has not been submitted yet.");
          return;
        }

        setResult(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load assessment results"
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading results...</p>;
  }

  if (error) {
    return (
      <main className="page">
        <section className="card">
          <h2>Results unavailable</h2>
          <p>{error}</p>
          <Link to="/">Return to dashboard</Link>
        </section>
      </main>
    );
  }

  const percentage =
    result.totalMarks > 0
      ? Math.round((result.score / result.totalMarks) * 100)
      : 0;

  return (
    <main className="page">
      <section className="card result-card">
        <p className="eyebrow">ASSESSMENT REPORT</p>
        <h1>Assessment completed</h1>

        <div className="result-score">
          <strong>
            {result.score} / {result.totalMarks}
          </strong>
          <span>Marks obtained</span>
        </div>

        <h2>{percentage}%</h2>

        <p>
          Status:{" "}
          {result.status === "expired"
            ? "Time expired — saved answers were scored"
            : "Submitted successfully"}
        </p>

        {result.submittedAt && (
          <p>
            Submitted at:{" "}
            {new Date(result.submittedAt).toLocaleString()}
          </p>
        )}

        <Link to="/" className="result-link">
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}

export default Results;