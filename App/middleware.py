from django.http import Http404
from django.shortcuts import render
from django.conf import settings


class Custom404Middleware:
    """
    Custom middleware to handle 404 errors even in DEBUG mode
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Handle 404 errors even in DEBUG mode
        if response.status_code == 404:
            return render(request, "404.html", status=404)

        return response

    def process_exception(self, request, exception):
        """
        Handle Http404 exceptions
        """
        if isinstance(exception, Http404):
            return render(request, "404.html", status=404)
        return None
