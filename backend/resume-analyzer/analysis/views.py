from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from resumes.models import Resume
from jobs.models import JobDescription

from .models import ResumeAnalysis
from .services import (
    calculate_final_score,
    generate_recommendations,
    generate_ai_recommendations,)
from .serializers import ResumeAnalysisSerializer


class ResumeAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = ResumeAnalysis.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = ResumeAnalysisSerializer(
            analyses,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        resume_id = request.data.get('resume_id')
        job_id = request.data.get('job_id')

        if not resume_id or not job_id:
            return Response(
                {'error': 'resume_id and job_id are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user
            )
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            job = JobDescription.objects.get(
                id=job_id,
                user=request.user
            )
        except JobDescription.DoesNotExist:
            return Response(
                {'error': 'Job description not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        result = calculate_final_score(
            resume.extracted_text,
            job.description
        )

        recommendations = generate_ai_recommendations(
            resume.extracted_text,
            job.description
        )

        ai_feedback = generate_ai_recommendations(
            resume.extracted_text,
            job.description
        )

        analysis = ResumeAnalysis.objects.create(
    user=request.user,
    resume=resume,
    job_description=job,

    skill_score=result['skill_score'],
    semantic_score=result['semantic_score'],
    match_score=result['final_score'],

    matching_skills=result['matching_skills'],
    missing_skills=result['missing_skills'],

    recommendations=recommendations,
    ai_feedback=ai_feedback
)

        serializer = ResumeAnalysisSerializer(analysis)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class ResumeAnalysisDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(
                id=pk,
                user=request.user
            )
        except ResumeAnalysis.DoesNotExist:
            return Response(
                {'error': 'Analysis not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeAnalysisSerializer(analysis)

        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(
                id=pk,
                user=request.user
            )
        except ResumeAnalysis.DoesNotExist:
            return Response(
                {'error': 'Analysis not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        analysis.delete()

        return Response(
            {'message': 'Analysis deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = ResumeAnalysis.objects.filter(
            user=request.user
        ).order_by('-created_at')

        total_analyses = analyses.count()

        if total_analyses == 0:
            return Response({
                "total_analyses": 0,
                "latest_analysis": None
            })

        latest = analyses.first()

        return Response({
            "total_analyses": total_analyses,
            "latest_analysis": {
                "id": latest.id,
                "resume": latest.resume.id,
                "job_description": latest.job_description.id,
                "skill_score": latest.skill_score,
                "semantic_score": latest.semantic_score,
                "match_score": latest.match_score,
                "matching_skills": latest.matching_skills,
                "missing_skills": latest.missing_skills,
                "recommendations": latest.recommendations,
                "created_at": latest.created_at
            }
        })