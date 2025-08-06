from django.contrib import admin

# Register your models here.

from .models import (
    Problem,
    Example,
    TestCase,
    AppUser,
    StarterCode,
    UserSubmission,
    Category,
)

admin.site.register(AppUser)
admin.site.register(Problem)
admin.site.register(Example)
admin.site.register(TestCase)
admin.site.register(StarterCode)
admin.site.register(UserSubmission)
admin.site.register(Category)
