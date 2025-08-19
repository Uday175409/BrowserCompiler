"""
Custom middleware to handle authentication and CSRF issues
"""

from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)


class CSRFDebugMiddleware(MiddlewareMixin):
    """
    Debug middleware to log CSRF token information.
    Only use this temporarily for debugging CSRF issues.
    """

    def process_request(self, request):
        if request.method == "POST" and "/login/" in request.path:
            logger.debug("CSRF Debug Info:")
            logger.debug(
                f'- CSRF Cookie: {request.COOKIES.get("csrftoken", "Not Found")}'
            )
            logger.debug(
                f'- CSRF Token in POST: {request.POST.get("csrfmiddlewaretoken", "Not Found")}'
            )
            logger.debug(f"- POST data: {list(request.POST.keys())}")
        return None
