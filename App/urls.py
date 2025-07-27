from django.contrib import admin
from django.urls import path
from App import views
from App.views import code_views, admin_views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home_page, name="home"),
    path("compile/", code_views.compile_code_basic, name="compile"),  # Basic compiler
    path(
        "compile/<slug:slug>/",
        code_views.compile_code_monaco,
        name="compile_with_problem",
    ),  # Compiler with problem
    path(
        "problems/<slug:slug>/comment/",
        code_views.submit_comment,
        name="submit-comment",
    ),
    path(
        "leaderboard/<slug:slug>/", code_views.leaderboard_data, name="leaderboard-data"
    ),
    path(
        "test-leaderboard/<slug:slug>/",
        code_views.add_test_leaderboard_data,
        name="test-leaderboard",
    ),
    path("problems/", views.problem_list, name="problems"),
    path("problems/upload/", code_views.upload_problem, name="upload-problem"),
    path(
        "manage/problems/insert/",
        admin_views.admin_problem_insert,
        name="admin-problem-insert",
    ),
    path("manage/logout/", admin_views.admin_logout, name="admin-logout"),
    path("test-404/", views.custom_404_test, name="test-404"),  # Test 404 page
    path("result/", views.execution_result, name="result"),
    path("languages/", views.languages_supported, name="languages"),
    path("about/", views.about_page, name="about"),
    path("contact/", views.contact_page, name="contact"),
    path("history/", views.user_history, name="history"),
    path("auth/", views.auth_view, name="auth-page"),
    path("register/", views.register_user, name="register-user"),
    path("login/", views.login_user, name="login-user"),
    path("profile/", views.profile_view, name="profile-page"),
    path("profile/update/", views.update_profile, name="update-profile"),
    path("logout/", views.logout_view, name="logout-view"),
    # Catch-all pattern for 404 - MUST be last
    path("<path:invalid_path>/", views.custom_404_catch_all, name="catch-all-404"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
