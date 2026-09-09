# AI Resume Analyzer

An AI-powered full-stack application that analyzes resumes against job
descriptions and provides personalized recommendations.

## Features

- User registration and JWT authentication
- Resume PDF upload
- Automatic PDF text extraction
- Job description management
- Skill-based resume matching
- Semantic similarity using Sentence Transformers
- Combined resume-job match score
- AI-powered resume recommendations
- Matching and missing skill detection
- Analysis history
- User dashboard
- User-specific resource access

## Architecture

```text
React Frontend
      |
      | REST API
      ↓
Django REST Framework
      |
      ├── Authentication
      ├── Resume Management
      ├── Job Management
      └── Resume Analysis
              |
              ├── Skill Matching
              ├── Semantic Similarity
              └── OpenAI Feedback
                      |
                      ↓
                  Database