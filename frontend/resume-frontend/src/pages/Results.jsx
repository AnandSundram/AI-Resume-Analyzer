import { useLocation, useNavigate } from "react-router-dom";

function ScoreCircle({ score, label }) {
  return (
    <div className="score-card">
      <div
        className="score-circle"
        style={{
          "--score": `${score}%`,
        }}
      >
        <div className="score-circle-inner">
          <strong>{Math.round(score)}%</strong>
        </div>
      </div>

      <h3>{label}</h3>
    </div>
  );
}


function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div className="results-page">
        <h1>No analysis found</h1>

        <button onClick={() => navigate("/analyze")}>
          Analyze Resume
        </button>
      </div>
    );
  }

  return (
    <div className="results-page">

      <div className="results-header">
        <h1>Resume Analysis</h1>

        <p>
          Here's how your resume matches the selected
          job description.
        </p>
      </div>

      <div className="score-container">

        <div className="score-card">
          <h3>Overall Match</h3>

          <div className="score">
            {analysis.match_score}%
          </div>
        </div>

        <div className="score-grid">

  <ScoreCircle
    score={analysis.match_score}
    label="Overall Match"
  />

  <ScoreCircle
    score={analysis.skill_score}
    label="Skill Match"
  />

  <ScoreCircle
    score={analysis.semantic_score}
    label="Semantic Match"
  />

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

          {analysis.matching_skills.length > 0 ? (
            <ul>
              {analysis.matching_skills.map((skill) => (
                <li key={skill}>
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching skills found.</p>
          )}

        </div>

        <div className="skill-box">

          <h2>Missing Skills</h2>

          {analysis.missing_skills.length > 0 ? (
            <ul>
              {analysis.missing_skills.map((skill) => (
                <li key={skill}>
                  {skill}
                </li>
              ))}
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

      <div className="results-actions">

        <button onClick={() => navigate("/analyze")}>
          Analyze Another Resume
        </button>

        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

      </div>

    </div>
  );
}

export default Results;