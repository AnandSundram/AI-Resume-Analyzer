from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return JsonResponse({
        "message": "AI Resume Analyzer API",
        "status": "running",
        "version": "1.0"
    })


urlpatterns = [
    path('', home, name='home'),

    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),
    path('api/resumes/', include('resumes.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/analysis/', include('analysis.urls')),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )