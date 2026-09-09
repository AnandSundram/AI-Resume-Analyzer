import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function History() {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/analysis/");

        setAnalyses(response.data);
      } catch (error) {
        console.error("History error:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load analysis history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/analysis/${id}/`);

      setAnalyses(
        analyses.filter((analysis) => analysis.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);

      setError("Failed to delete analysis.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading analysis history...
      </div>
    );
  }

  return (
    <div className="history-page">

      <div className="history-header">

        <div>
          <h1>Analysis History</h1>

          <p>
            View your previous resume analyses.
          </p>
        </div>

        <div className="history-actions">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/analyze">
            New Analysis
          </Link>

        </div>

      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {analyses.length === 0 ? (
        <div className="empty-history">

          <h2>No analyses yet</h2>

          <p>
            Analyze your resume against a job description
            to see your results here.
          </p>

          <Link to="/analyze">
            Start Your First Analysis
          </Link>

        </div>
      ) : (
        <div className="history-list">

          {analyses.map((analysis) => (
            <div
              className="history-card"
              key={analysis.id}
            >

              <div className="history-info">

               <h2>
  {analysis.job_title}
</h2>

<p>
  {analysis.company}
</p>

<p>
  Resume: {analysis.resume_name}
</p>

                <small>
                  {new Date(
                    analysis.created_at
                  ).toLocaleString()}
                </small>

              </div>


              <div className="history-score">

                <span>Match Score</span>

                <strong>
                  {analysis.match_score}%
                </strong>

              </div>


              <div className="history-card-actions">

                <Link
                  to={`/analysis/${analysis.id}`}
                >
                  View
                </Link>

                <button
                  onClick={() =>
                    handleDelete(analysis.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default History;