import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(
          `/analysis/${id}/`
        );

        setAnalysis(response.data);
      } catch (error) {
        console.error("Analysis detail error:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (error.response?.status === 404) {
          setError("Analysis not found.");
        } else {
          setError("Failed to load analysis.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading">
        Loading analysis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <h1>{error}</h1>

        <Link to="/history">
          Back to History
        </Link>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="results-page">

      <div className="results-header">

        <Link to="/history">
          ← Back to History
        </Link>

        <h1>Analysis Details</h1>

        <p>
              {analysis.resume_name} → {analysis.job_title} at{" "}
              {analysis.company}
        </p>

      </div>


      <div className="score-container">

        <div className="score-card">
          <h3>Overall Match</h3>

          <div className="score">
            {analysis.match_score}%
          </div>
        </div>

        <div className="score-card">
          <h3>Skill Score</h3>

          <div className="score">
            {analysis.skill_score}%
          </div>
        </div>

        <div className="score-card">
          <h3>Semantic Score</h3>

          <div className="score">
            {analysis.semantic_score}%
          </div>
        </div>

      </div>


      <div className="skills-section">

        <div className="skill-box">

          <h2>Matching Skills</h2>

          {analysis.matching_skills?.length > 0 ? (
            <ul>
              {analysis.matching_skills.map(
                (skill) => (
                  <li key={skill}>
                    ✓ {skill}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No matching skills found.</p>
          )}

        </div>


        <div className="skill-box">

          <h2>Missing Skills</h2>

          {analysis.missing_skills?.length > 0 ? (
            <ul>
              {analysis.missing_skills.map(
                (skill) => (
                  <li key={skill}>
                    {skill}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No missing skills found.</p>
          )}

        </div>

      </div>


<div className="ai-feedback">

  <h2>AI Resume Feedback</h2>

  {analysis.ai_feedback ? (
    <>

      <div className="feedback-section">
        <h3>Strengths</h3>

        {analysis.ai_feedback.strengths?.length > 0 ? (
          <ul>
            {analysis.ai_feedback.strengths.map(
              (item, index) => (
                <li key={index}>
                  ✓ {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No strengths identified.</p>
        )}
      </div>


      <div className="feedback-section">
        <h3>Weaknesses</h3>

        {analysis.ai_feedback.weaknesses?.length > 0 ? (
          <ul>
            {analysis.ai_feedback.weaknesses.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No major weaknesses identified.</p>
        )}
      </div>


      <div className="feedback-section">
        <h3>Resume Improvements</h3>

        {analysis.ai_feedback.resume_improvements?.length > 0 ? (
          <ol>
            {analysis.ai_feedback.resume_improvements.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ol>
        ) : (
          <p>No resume improvements available.</p>
        )}
      </div>


      <div className="feedback-section">
        <h3>Keyword Suggestions</h3>

        <div className="keyword-list">
          {analysis.ai_feedback.keyword_suggestions?.map(
            (keyword, index) => (
              <span
                className="keyword"
                key={index}
              >
                {keyword}
              </span>
            )
          )}
        </div>
      </div>


      <div className="feedback-section">
        <h3>Project Improvements</h3>

        {analysis.ai_feedback.project_improvements?.length > 0 ? (
          <ul>
            {analysis.ai_feedback.project_improvements.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No project improvements available.</p>
        )}
      </div>


      <div className="feedback-section overall-feedback">

        <h3>Overall Feedback</h3>

        <p>
          {analysis.ai_feedback.overall_feedback}
        </p>

      </div>

    </>
  ) : (
    <p>
      AI feedback is not available for this analysis.
    </p>
  )}

</div>

    </div>
  );
}

export default AnalysisDetail;