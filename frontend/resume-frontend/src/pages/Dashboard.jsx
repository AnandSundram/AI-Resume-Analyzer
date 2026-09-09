import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        profileResponse,
        resumesResponse,
        jobsResponse,
        dashboardResponse,
      ] = await Promise.all([
        api.get("/users/profile/"),
        api.get("/resumes/"),
        api.get("/jobs/"),
        api.get("/analysis/dashboard/"),
      ]);

      setUsername(profileResponse.data.username);
      setResumes(resumesResponse.data);
      setJobs(jobsResponse.data);
      setDashboard(dashboardResponse.data);

    } catch (error) {
      console.error("Dashboard error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("Failed to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/resumes/${id}/`);

      setResumes(
        resumes.filter((resume) => resume.id !== id)
      );

    } catch (error) {
      console.error("Delete resume error:", error);
      setError("Failed to delete resume.");
    }
  };

  const handleDeleteJob = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/jobs/${id}/`);

      setJobs(
        jobs.filter((job) => job.id !== id)
      );

    } catch (error) {
      console.error("Delete job error:", error);
      setError("Failed to delete job.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Header */}

      <header className="dashboard-header">

        <div>
          <h1>AI Resume Analyzer</h1>

          <p>
            Welcome back, <strong>{username}</strong>
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {error && (
        <p className="error">
          {error}
        </p>
      )}


      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">
          <h3>Resumes</h3>
          <p>{resumes.length}</p>
        </div>

        <div className="stat-card">
          <h3>Job Descriptions</h3>
          <p>{jobs.length}</p>
        </div>

        <div className="stat-card">
          <h3>Analyses</h3>
          <p>
            {dashboard?.total_analyses || 0}
          </p>
        </div>

      </div>

      <div className="dashboard-hero">
  <div>
    <h1>AI Resume Analyzer</h1>

    <p>
      Analyze your resume against job descriptions and get
      AI-powered recommendations to improve your chances.
    </p>
  </div>

  <button
    className="primary-button"
    onClick={() => navigate("/analyze")}
  >
    Analyze Resume
  </button>
</div>


      {/* Main Actions */}

      <div className="dashboard-actions">

        <Link
          to="/upload-resume"
          className="action-card"
        >
          <h2>Upload Resume</h2>
          <p>Upload a new PDF resume.</p>
        </Link>

        <Link
          to="/add-job"
          className="action-card"
        >
          <h2>Add Job</h2>
          <p>Add a job description.</p>
        </Link>

        <Link
          to="/analyze"
          className="action-card"
        >
          <h2>Analyze Resume</h2>
          <p>Compare your resume with a job.</p>
        </Link>

        <Link
          to="/history"
          className="action-card"
        >
          <h2>History</h2>
          <p>View previous analyses.</p>
        </Link>

      </div>


      {/* Resumes */}

      <section className="management-section">

        <div className="section-header">

          <div>
            <h2>Your Resumes</h2>
            <p>Manage your uploaded resumes.</p>
          </div>

          <Link to="/upload-resume">
            + Upload
          </Link>

        </div>


        {resumes.length === 0 ? (
          <div className="empty-management">
            <p>No resumes uploaded yet.</p>

            <Link to="/upload-resume">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="management-list">

            {resumes.map((resume) => (
              <div
                className="management-card"
                key={resume.id}
              >

                <div className="management-info">

                  <h3>
                    {resume.file.split("/").pop()}
                  </h3>

                  <p>
                    Uploaded:{" "}
                    {new Date(
                      resume.uploaded_at
                    ).toLocaleDateString()}
                  </p>

                  <small>
                    Text extracted:{" "}
                    {resume.extracted_text
                      ? "Yes"
                      : "No"}
                  </small>

                </div>


                <div className="management-actions">

                  <Link to="/analyze">
                    Analyze
                  </Link>

                  <button
                    onClick={() =>
                      handleDeleteResume(resume.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>


      {/* Jobs */}

      <section className="management-section">

        <div className="section-header">

          <div>
            <h2>Your Job Descriptions</h2>
            <p>Manage your saved job descriptions.</p>
          </div>

          <Link to="/add-job">
            + Add Job
          </Link>

        </div>


        {jobs.length === 0 ? (
          <div className="empty-management">
            <p>No job descriptions added yet.</p>

            <Link to="/add-job">
              Add Job Description
            </Link>
          </div>
        ) : (
          <div className="management-list">

            {jobs.map((job) => (
              <div
                className="management-card"
                key={job.id}
              >

                <div className="management-info">

                  <h3>
                    {job.title}
                  </h3>

                  <p>
                    {job.company}
                  </p>

                  <small>
                    Added:{" "}
                    {new Date(
                      job.created_at
                    ).toLocaleDateString()}
                  </small>

                </div>


                <div className="management-actions">

                  <Link to="/analyze">
                    Analyze
                  </Link>

                  <button
                    onClick={() =>
                      handleDeleteJob(job.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>


      {/* Latest Analysis */}

      {dashboard?.latest_analysis && (
        <section className="latest-analysis">

          <div className="section-header">

            <div>
              <h2>Latest Analysis</h2>
              <p>Your most recent resume analysis.</p>
            </div>

            <Link to="/history">
              View History
            </Link>

          </div>


          <div className="latest-score">

            <div>
              <span>Overall Match</span>

              <strong>
                {dashboard.latest_analysis.match_score}%
              </strong>
            </div>

            <div>
              <span>Skill Score</span>

              <strong>
                {dashboard.latest_analysis.skill_score}%
              </strong>
            </div>

            <div>
              <span>Semantic Score</span>

              <strong>
                {dashboard.latest_analysis.semantic_score}%
              </strong>
            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default Dashboard;