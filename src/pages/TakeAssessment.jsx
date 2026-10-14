import { useParams } from "react-router-dom";

function TakeAssessment() {
  const { id } = useParams();

  return (
    <main className="page">
      <section className="card">
        <h1>Nxt Assess</h1>
        <p>Assessment ID: {id}</p>
        <p>The assessment page is connected successfully.</p>
      </section>
    </main>
  );
}

export default TakeAssessment;