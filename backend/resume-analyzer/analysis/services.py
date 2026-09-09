import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI, RateLimitError
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


SKILLS = {
    "python": ["python"],
    "django": ["django"],
    "django rest framework": [
        "django rest framework",
        "drf"
    ],
    "flask": ["flask"],
    "fastapi": ["fastapi"],
    "java": ["java"],
    "c++": ["c++", "cpp"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "react": ["react", "react.js"],
    "node.js": ["node.js", "nodejs", "node"],
    "html": ["html"],
    "css": ["css"],
    "postgresql": ["postgresql", "postgres"],
    "mysql": ["mysql"],
    "mongodb": ["mongodb", "mongo"],
    "redis": ["redis"],
    "docker": ["docker"],
    "aws": ["aws", "amazon web services"],
    "git": ["git", "github", "gitlab"],
    "rest api": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis"
    ],
    "machine learning": [
        "machine learning",
        "machine-learning"
    ],
    "deep learning": [
        "deep learning",
        "deep-learning"
    ],
    "tensorflow": ["tensorflow"],
    "pytorch": ["pytorch"],
    "celery": ["celery"],
}


def extract_skills(text):
    """
    Extract known skills from a piece of text.
    """

    if not text:
        return []

    text = text.lower()

    found_skills = []

    for skill, keywords in SKILLS.items():

        for keyword in keywords:

            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'

            if re.search(pattern, text):
                found_skills.append(skill)
                break

    return sorted(found_skills)


def calculate_match_score(resume_text, job_text):
    resume_skills = set(
        extract_skills(resume_text)
    )

    job_skills = set(
        extract_skills(job_text)
    )

    if not job_skills:
        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": []
        }

    matching_skills = resume_skills & job_skills
    missing_skills = job_skills - resume_skills

    score = (
        len(matching_skills)
        / len(job_skills)
    ) * 100

    return {
        "score": round(score, 2),
        "matching_skills": sorted(matching_skills),
        "missing_skills": sorted(missing_skills)
    }

model = SentenceTransformer(
    'all-MiniLM-L6-v2'
)


def calculate_semantic_similarity(
    resume_text,
    job_text
):
    if not resume_text or not job_text:
        return 0.0

    resume_embedding = model.encode(
        [resume_text]
    )

    job_embedding = model.encode(
        [job_text]
    )

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )[0][0]

    score = similarity * 100

    return round(float(score), 2)


def calculate_final_score(
    resume_text,
    job_text
):
    skill_result = calculate_match_score(
        resume_text,
        job_text
    )

    semantic_score = calculate_semantic_similarity(
        resume_text,
        job_text
    )

    skill_score = skill_result["score"]

    final_score = (
        skill_score * 0.60
        + semantic_score * 0.40
    )

    return {
        "final_score": round(final_score, 2),
        "skill_score": skill_score,
        "semantic_score": semantic_score,
        "matching_skills": skill_result[
            "matching_skills"
        ],
        "missing_skills": skill_result[
            "missing_skills"
        ],
    }

def generate_recommendations(
    resume_text,
    job_text
):
    result = calculate_final_score(
        resume_text,
        job_text
    )

    recommendations = []

    missing_skills = result["missing_skills"]

    # Missing skills recommendation
    if missing_skills:
        skills = ", ".join(missing_skills[:5])

        recommendations.append(
            f"Consider adding experience with "
            f"{skills} if you have worked with these technologies."
        )

    # Resume length/content check
    if len(resume_text.strip()) < 1000:
        recommendations.append(
            "Your resume appears to contain limited "
            "content. Consider adding more detail about "
            "your projects and experience."
        )

    # Project recommendation
    project_keywords = [
        "project",
        "projects",
        "developed",
        "built",
        "implemented"
    ]

    has_project_content = any(
        keyword in resume_text.lower()
        for keyword in project_keywords
    )

    if not has_project_content:
        recommendations.append(
            "Add a Projects section describing your "
            "technical work and personal contributions."
        )

    # Achievement recommendation
    achievement_keywords = [
        "%",
        "increased",
        "reduced",
        "improved",
        "users",
        "performance"
    ]

    has_metrics = any(
        keyword in resume_text.lower()
        for keyword in achievement_keywords
    )

    if not has_metrics:
        recommendations.append(
            "Add measurable results to your projects "
            "where possible, such as performance improvements, "
            "user counts, or efficiency gains."
        )

    # Job-specific recommendation
    if result["skill_score"] < 50:
        recommendations.append(
            "Your skill match is relatively low. "
            "Review the job requirements and highlight "
            "relevant experience that you already have."
        )

    elif result["skill_score"] < 75:
        recommendations.append(
            "Your resume has a moderate skill match. "
            "Focus on highlighting the technologies most "
            "relevant to this position."
        )

    else:
        recommendations.append(
            "Your resume has a strong skill match. "
            "Focus on clearly presenting your strongest "
            "relevant projects and achievements."
        )

    return recommendations

def generate_ai_recommendations(resume_text, job_text):
    """
    Generate AI-powered resume recommendations.

    The AI layer is optional. If the OpenAI API is unavailable,
    the core resume analysis should still succeed.
    """

    fallback_response = {
        "strengths": [],
        "weaknesses": [],
        "resume_improvements": [],
        "keyword_suggestions": [],
        "project_improvements": [],
        "overall_feedback": (
            "AI feedback is currently unavailable. "
            "Your resume match score and rule-based recommendations "
            "are still available."
        )
    }

    if not resume_text or not job_text:
        fallback_response["overall_feedback"] = (
            "AI feedback could not be generated because "
            "the resume or job description is empty."
        )

        return fallback_response

    prompt = f"""
You are an expert technical recruiter and resume coach.

Analyze the candidate's resume against the job description.

RESUME:
----------------
{resume_text}
----------------

JOB DESCRIPTION:
----------------
{job_text}
----------------

Provide practical and honest recommendations for improving
the resume specifically for this job.

Focus on:

1. Strengths
   - Relevant skills, projects, or experience already present.

2. Weaknesses
   - Important gaps or areas that are weak compared with the job.

3. Resume improvements
   - Specific changes to wording, structure, or presentation.

4. Keyword suggestions
   - Important keywords from the job description that the
     candidate should consider using ONLY if they genuinely
     have that experience.

5. Project improvements
   - Ways to make existing technical projects stronger.

6. Overall feedback
   - A short summary of the candidate's position and what
     they should prioritize.

IMPORTANT RULES:

- Do not invent experience.
- Do not invent skills.
- Do not invent projects.
- Do not invent achievements.
- Do not claim the candidate has a technology unless there
  is evidence in the resume.
- Keep recommendations practical and concise.

Return exactly 5 useful recommendations.
"""

    try:
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt
        )

        text = response.output_text or ""

        recommendations = [
            line.strip()
            for line in text.split("\n")
            if line.strip()
        ]

        cleaned_recommendations = []

        for recommendation in recommendations:
            recommendation = re.sub(
                r"^\s*(?:\d+[\.\)]|[-*])\s*",
                "",
                recommendation
            )

            if recommendation:
                cleaned_recommendations.append(
                    recommendation
                )

        cleaned_recommendations = (
            cleaned_recommendations[:5]
        )

        return {
            "strengths": [],
            "weaknesses": [],
            "resume_improvements": cleaned_recommendations,
            "keyword_suggestions": [],
            "project_improvements": [],
            "overall_feedback": (
                "AI-generated recommendations are available "
                "based on the provided resume and job description."
            )
        }

    except RateLimitError as e:
        print(
            "OpenAI API quota/credit error:",
            e
        )

        return {
            "strengths": [],
            "weaknesses": [],
            "resume_improvements": [],
            "keyword_suggestions": [],
            "project_improvements": [],
            "overall_feedback": (
                "AI feedback is temporarily unavailable because "
                "the OpenAI API account has no available credits. "
                "The resume match score was still calculated "
                "successfully."
            )
        }

    except Exception as e:
        print(
            "AI recommendation error:",
            e
        )

        return {
            "strengths": [],
            "weaknesses": [],
            "resume_improvements": [],
            "keyword_suggestions": [],
            "project_improvements": [],
            "overall_feedback": (
                "AI feedback could not be generated at this time. "
                "The resume match score was still calculated "
                "successfully."
            )
        }