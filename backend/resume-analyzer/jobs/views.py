from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import JobDescription
from .serializers import JobDescriptionSerializer


class JobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = JobDescription.objects.filter(
            user=request.user
        )

        serializer = JobDescriptionSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = JobDescriptionSerializer(
            data=request.data
        )

        if serializer.is_valid():
            job = serializer.save(
                user=request.user
            )

            return Response(
                JobDescriptionSerializer(job).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            job = JobDescription.objects.get(
                pk=pk,
                user=request.user
            )

        except JobDescription.DoesNotExist:
            return Response(
                {
                    'error': 'Job description not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobDescriptionSerializer(job)

        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            job = JobDescription.objects.get(
                pk=pk,
                user=request.user
            )

        except JobDescription.DoesNotExist:
            return Response(
                {
                    'error': 'Job description not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        job.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )