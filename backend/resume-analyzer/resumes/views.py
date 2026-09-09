from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from pypdf import PdfReader

from .models import Resume
from .serializers import ResumeSerializer


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if 'file' not in request.FILES:
            return Response(
                {
                    'error': 'Please upload a PDF file.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES['file']

        if not uploaded_file.name.lower().endswith('.pdf'):
            return Response(
                {
                    'error': 'Only PDF files are allowed.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        resume = Resume.objects.create(
            user=request.user,
            file=uploaded_file
        )

        try:
            reader = PdfReader(resume.file.path)

            text = ""

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

            resume.extracted_text = text
            resume.save()

        except Exception:
            resume.delete()

            return Response(
                {
                    'error': 'Could not process the PDF.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ResumeSerializer(resume)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class ResumeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(user=request.user)

        serializer = ResumeSerializer(
            resumes,
            many=True
        )

        return Response(serializer.data)


class ResumeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            resume = Resume.objects.get(
                pk=pk,
                user=request.user
            )

        except Resume.DoesNotExist:
            return Response(
                {
                    'error': 'Resume not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResumeSerializer(resume)

        return Response(serializer.data)

    def delete(self, request, pk):

        try:
            resume = Resume.objects.get(
                pk=pk,
                user=request.user
            )

        except Resume.DoesNotExist:
            return Response(
                {
                    'error': 'Resume not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        resume.delete()

        return Response(
            {
                'message': 'Resume deleted successfully.'
            },
            status=status.HTTP_204_NO_CONTENT
        )