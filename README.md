# 🤖 AI Resume Analyzer

An AI-powered full-stack application that analyzes resumes against job
descriptions and provides actionable feedback to help candidates improve
their resumes for specific roles.

The application combines deterministic skill matching, transformer-based
semantic similarity, and LLM-powered recommendations to provide a more
useful resume-job analysis.

---

## ✨ Features

- 🔐 User registration and JWT authentication
- 📄 PDF resume upload
- 📝 Automatic resume text extraction
- 💼 Job description management
- 🧠 Technical skill extraction
- 📊 Skill-based resume matching
- 🔎 Semantic similarity using Sentence Transformers
- 🎯 Combined resume-job match score
- 🤖 AI-powered resume recommendations
- 💡 Matching and missing skill detection
- 📈 Analysis history
- 📊 User dashboard
- 🛡️ User-specific resource access
- ⚡ RESTful backend API
- 🔄 Graceful handling of AI API failures

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │      Vite + Axios   │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │ Django REST Framework│
                         │                     │
                         │ JWT Authentication  │
                         │ Resume Management   │
                         │ Job Management      │
                         │ Analysis APIs       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Analysis Engine   │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
             Skill Matching   Semantic Matching   OpenAI
                   │                │                │
                   ▼                ▼                ▼
              Skill Score    Semantic Score     AI Feedback
                   │                │                │
                   └────────────────┼────────────────┘
                                    ▼
                              Final Match Score
                                    │
                                    ▼
                              SQLite Database