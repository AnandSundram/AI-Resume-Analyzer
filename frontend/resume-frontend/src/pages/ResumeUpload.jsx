import { useRef, useState } from "react";
import api from "../services/api";
import { getErrorMessage } from "../services/errorHandler";
import Loading from "../components/Loading";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setSuccess("");
    setResume(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file type
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Maximum file size: 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setResume(null);

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    // Final validation before sending to backend
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post(
        "/resumes/upload/",
        formData
      );

      setResume(response.data);
      setSuccess("Resume uploaded successfully!");
      setFile(null);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Resume upload error:", error);

      setError(
        getErrorMessage(
          error,
          "Failed to upload resume. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">

        <h1>Upload Resume</h1>

        <p>
          Upload your resume in PDF format to analyze it
          against job descriptions.
        </p>

        <form onSubmit={handleUpload}>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={loading}
          />

          {file && (
            <div className="selected-file">
              <p>
                Selected file:
              </p>

              <strong>{file.name}</strong>

              <span>
                {" "}
                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>

        {loading && (
          <Loading message="Uploading and processing your resume..." />
        )}

        {success && !loading && (
          <p className="success">
            {success}
          </p>
        )}

        {error && !loading && (
          <p className="error">
            {error}
          </p>
        )}

        {resume && !loading && (
          <div className="resume-result">

            <h2>Resume Uploaded Successfully</h2>

            <p>
              <strong>Resume ID:</strong>{" "}
              {resume.id}
            </p>

            <p>
              <strong>File:</strong>{" "}
              {resume.file}
            </p>

            <p>
              <strong>Text extracted:</strong>{" "}
              {resume.extracted_text
                ? "Yes"
                : "No"}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeUpload;