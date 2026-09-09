from django.urls import path

from .views import (
    ResumeAnalysisView,
    ResumeAnalysisDetailView,
    DashboardView
)


urlpatterns = [
    path(
        '',
        ResumeAnalysisView.as_view(),
        name='resume-analysis'
    ),

    path(
        '<int:pk>/',
        ResumeAnalysisDetailView.as_view(),
        name='resume-analysis-detail'
    ),
    path(
        'dashboard/',
        DashboardView.as_view(),
        name='dashboard'
    ),
]