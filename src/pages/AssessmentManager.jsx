import { useEffect, useState } from "react";
import api from "../services/api";

function AssessmentManager() {
  const [questions, setQuestions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("JavaScript");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setError("");

      const [questionResponse, assessmentResponse] =
        await Promise.all([
          api.get("/admin/questions"),
          api.get("/admin/assessments"),
        ]);

      setQuestions(questionResponse.data);
      setAssessments(assessmentResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load assessment data. Check your admin access."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleQuestion = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const createAssessment = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/admin/assessments", {
        title,
        description,
        subject,
        questionIds: selected,
        durationMinutes: Number(durationMinutes),
        status,
      });

      setTitle("");
      setDescription("");
      setSelected([]);
      setDurationMinutes(30);
      setStatus("draft");
      setMessage("Assessment created successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create assessment"
      );
    }
  };

  const changeStatus = async (assessment) => {
    const nextStatus =
      assessment.status === "published" ? "draft" : "published";

    try {
      setError("");
      setMessage("");

      await api.patch(
        `/admin/assessments/${assessment._id}/status`,
        { status: nextStatus }
      );

      setMessage(`Assessment moved to ${nextStatus}.`);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update assessment status"
      );
    }
  };

  if (loading) return <p className="loading">Loading assessments...</p>;

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">ADMIN PORTAL</p>
        <h1>Assessment Management</h1>
      </section>

      <section className="admin-panel">
        <h2>Create assessment</h2>

        <form onSubmit={createAssessment}>
          <label>
            Assessment title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <label>
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>

          <label>
            Duration in minutes
            <input
              type="number"
              min="1"
              max="300"
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(e.target.value)
              }
              required
            />
          </label>

          <label>
            Initial status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <h3>Select questions ({selected.length})</h3>

          {questions.length === 0 ? (
            <p>Create questions in the Question Bank first.</p>
          ) : (
            questions.map((question) => (
              <label className="question-choice" key={question._id}>
                <input
                  type="checkbox"
                  checked={selected.includes(question._id)}
                  onChange={() => toggleQuestion(question._id)}
                />

                <span>
                  {question.text}
                  <small>
                    {question.subject} · {question.marks} mark(s)
                  </small>
                </span>
              </label>
            ))
          )}

          <button
            type="submit"
            disabled={selected.length === 0}
          >
            Create assessment
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="admin-panel">
        <h2>Existing assessments ({assessments.length})</h2>

        {assessments.map((assessment) => (
          <article className="question-item" key={assessment._id}>
            <h3>{assessment.title}</h3>
            <p>
              {assessment.subject} · {assessment.durationMinutes} min ·{" "}
              {assessment.questions.length} questions ·{" "}
              {assessment.totalMarks} marks
            </p>
            <p>Status: {assessment.status}</p>

            <button onClick={() => changeStatus(assessment)}>
              {assessment.status === "published"
                ? "Unpublish"
                : "Publish"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AssessmentManager;