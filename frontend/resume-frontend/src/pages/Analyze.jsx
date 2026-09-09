import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Analyze() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeResponse, jobResponse] =
          await Promise.all([
            api.get("/resumes/"),
            api.get("/jobs/"),
          ]);

        setResumes(resumeResponse.data);
        setJobs(jobResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load resumes or jobs.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeId || !jobId) {
      setError("Please select both a resume and a job.");
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      const response = await api.post(
        "/analysis/",
        {
          resume_id: Number(resumeId),
          job_id: Number(jobId),
        }
      );

      console.log("Analysis result:", response.data);

      navigate("/results", {
        state: {
          analysis: response.data,
        },
      });
    } catch (error) {
      console.error("Analysis error:", error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to analyze resume.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading resumes and jobs...
      </div>
    );
  }

  return (
    <div className="analyze-page">
      <div className="analyze-card">

        <h1>Analyze Resume</h1>

        <p>
          Select a resume and a job description to see
          how well they match.
        </p>

        <form onSubmit={handleAnalyze}>

          <label>
            Select Resume
          </label>

          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
          >
            <option value="">
              -- Select Resume --
            </option>

            {resumes.map((resume) => (
              <option
                key={resume.id}
                value={resume.id}
              >
                {resume.file}
              </option>
            ))}
          </select>

          <label>
            Select Job Description
          </label>

          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          >
            <option value="">
              -- Select Job --
            </option>

            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.id}
              >
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>

        </form>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {resumes.length === 0 && (
          <p className="warning">
            No resumes found. Upload a resume first.
          </p>
        )}

        {jobs.length === 0 && (
          <p className="warning">
            No jobs found. Add a job description first.
          </p>
        )}

      </div>
    </div>
  );
}

export default Analyze;