from rest_framework import serializers

from .models import ResumeAnalysis


class ResumeAnalysisSerializer(serializers.ModelSerializer):

    resume_name = serializers.SerializerMethodField()
    job_title = serializers.CharField(
        source='job_description.title',
        read_only=True
    )
    company = serializers.CharField(
        source='job_description.company',
        read_only=True
    )

    class Meta:
        model = ResumeAnalysis

        fields = [
            'id',

            'resume',
            'resume_name',

            'job_description',
            'job_title',
            'company',

            'skill_score',
            'semantic_score',
            'match_score',

            'matching_skills',
            'missing_skills',
            'recommendations',
            'ai_feedback',

            'created_at',
        ]

        read_only_fields = [
            'id',
            'resume_name',
            'job_title',
            'company',

            'skill_score',
            'semantic_score',
            'match_score',

            'matching_skills',
            'missing_skills',
            'recommendations',
            'ai_feedback',

            'created_at',
        ]

    def get_resume_name(self, obj):
        return obj.resume.file.name