from django.db import models
from django.contrib.auth.models import User

from resumes.models import Resume
from jobs.models import JobDescription

class ResumeAnalysis(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    job_description = models.ForeignKey(
        JobDescription,
        on_delete=models.CASCADE,
        related_name='analyses'
    )

    skill_score = models.FloatField(default=0)
    semantic_score = models.FloatField(default=0)
    match_score = models.FloatField(default=0)

    matching_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)

    recommendations = models.JSONField(default=list)
    ai_feedback = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.match_score}%"