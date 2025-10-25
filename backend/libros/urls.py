# backend/libros/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet, SugerenciaViewSet, LugarViewSet

router = DefaultRouter()
router.register(r'libros', LibroViewSet)
router.register(r'sugerencias', SugerenciaViewSet)
router.register(r'lugares', LugarViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


