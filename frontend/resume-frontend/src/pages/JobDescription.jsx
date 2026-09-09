import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function JobDescription() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/jobs/",
        formData
      );

      console.log("Job created:", response.data);

      setSuccess("Job description added successfully!");

      setFormData({
        title: "",
        company: "",
        description: "",
      });

    } catch (error) {
      console.error("Job creation error:", error);

      if (error.response?.data) {
        const data = error.response.data;

        if (typeof data === "object") {
          const message = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" | ");

          setError(message);
        } else {
          setError(data);
        }
      } else {
        setError(
          "Could not connect to Django server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-page">
      <div className="job-card">

        <h1>Add Job Description</h1>

        <p>
          Enter the job details you want to compare
          your resume against.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Paste the complete job description here..."
            value={formData.description}
            onChange={handleChange}
            rows="12"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Job Description"}
          </button>

        </form>

        {success && (
          <p className="success">
            {success}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {success && (
          <button
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        )}

      </div>
    </div>
  );
}

export default JobDescription;