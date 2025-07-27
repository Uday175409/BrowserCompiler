from django import template
from django.utils.safestring import mark_safe
import os
from django.conf import settings

register = template.Library()


@register.simple_tag
def load_page_css(page_name):
    """Load CSS file from the same template directory"""
    css_path = f"templates/{page_name}/style.css"
    full_path = os.path.join(settings.BASE_DIR, css_path)

    if os.path.exists(full_path):
        # Read and return the CSS content wrapped in <style> tags
        with open(full_path, "r", encoding="utf-8") as file:
            css_content = file.read()
            return mark_safe(f"<style>\n{css_content}\n</style>")
    return ""


@register.simple_tag
def load_page_js(page_name):
    """Load JS file from the same template directory"""
    js_path = f"templates/{page_name}/script.js"
    full_path = os.path.join(settings.BASE_DIR, js_path)

    if os.path.exists(full_path):
        # Read and return the JS content wrapped in <script> tags
        with open(full_path, "r", encoding="utf-8") as file:
            js_content = file.read()
            return mark_safe(f"<script>\n{js_content}\n</script>")
    return ""
    # return ""
