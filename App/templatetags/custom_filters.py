from django import template

register = template.Library()


@register.filter
def split(value, delimiter):
    """Split a string by delimiter"""
    if value:
        return value.split(delimiter)
    return []


@register.filter
def trim(value):
    """Remove leading and trailing whitespace"""
    if value:
        return value.strip()
    return value


@register.filter
def mul(value, arg):
    """Multiply value by arg"""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0
