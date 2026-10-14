
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./QuestionBank.css";

const initialForm = {
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "0",
  subject: "",
  difficulty: "easy",
  marks: "1",
};

function QuestionBank() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadQuestions() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/questions");
      const data = response.data;

      setQuestions(
        Array.isArray(data) ? data : data.questions || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load questions. Check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function handleTextChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleOptionChange(index, value) {
    setForm((current) => {
      const options = [...current.options];
      options[index] = value;
      return { ...current, options };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.text.trim() || !form.subject.trim()) {
      setError("Enter both the question and subject.");
      return;
    }

    if (form.options.some((option) => !option.trim())) {
      setError("Fill in all four options.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        text: form.text.trim(),
        options: form.options.map((option) => option.trim()),
        correctAnswer: Number(form.correctAnswer),
        subject: form.subject.trim(),
        difficulty: form.difficulty,
        marks: Number(form.marks),
      };

      const response = await api.post("/admin/questions", payload);

      setQuestions((current) => [
        response.data.question || response.data,
        ...current,
      ]);

      setForm(initialForm);
      setSuccess("Question added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save question. Check the backend terminal."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="qb-page">
      <header className="qb-navbar">
        <strong>Nxt Assess</strong>

        <button
          type="button"
          className="qb-back"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </header>

      <div className="qb-container">
        <div className="qb-heading">
          <p>ADMIN PORTAL</p>
          <h1>Question Bank</h1>
          <span>Create and manage assessment questions.</span>
        </div>

        <section className="qb-panel">
          <h2>Add a new question</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="question-text">Question</label>
            <textarea
              id="question-text"
              name="text"
              value={form.text}
              onChange={handleTextChange}
              placeholder="Enter your question"
              rows={3}
              required
            />

            <fieldset className="qb-options">
              <legend>Answer options</legend>

              {form.options.map((option, index) => (
                <div className="qb-option-row" key={index}>
                  <label htmlFor={`option-${index}`}>
                    Option {String.fromCharCode(65 + index)}
                  </label>

                  <input
                    id={`option-${index}`}
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                </div>
              ))}
            </fieldset>

            <label htmlFor="correct-answer">Correct answer</label>
            <select
              id="correct-answer"
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleTextChange}
            >
              {form.options.map((option, index) => (
                <option key={index} value={index}>
                  {String.fromCharCode(65 + index)}:{" "}
                  {option.trim() || `Option ${index + 1}`}
                </option>
              ))}
            </select>

            <div className="qb-form-grid">
              <div>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleTextChange}
                  placeholder="e.g. JavaScript"
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleTextChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="marks">Marks</label>
                <input
                  id="marks"
                  name="marks"
                  type="number"
                  min="1"
                  value={form.marks}
                  onChange={handleTextChange}
                  required
                />
              </div>
            </div>

            {error && <p className="qb-error">{error}</p>}
            {success && <p className="qb-success">{success}</p>}

            <button
              className="qb-submit"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Question"}
            </button>
          </form>
        </section>

        <section className="qb-list">
          <div className="qb-list-heading">
            <h2>Existing questions</h2>
            <button
              type="button"
              className="qb-refresh"
              onClick={loadQuestions}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p>No questions found. Add your first question above.</p>
          ) : (
            questions.map((question) => (
              <article
                className="qb-question-card"
                key={question._id || question.id}
              >
                <h3>{question.text}</h3>
                <p>
                  Subject: {question.subject} · Difficulty:{" "}
                  {question.difficulty} · Marks: {question.marks}
                </p>
                <ol type="A">
                  {(question.options || []).map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ol>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default QuestionBank;
