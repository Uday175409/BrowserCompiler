# views/__init__.py

from .auth_views import (
    login_user,
    logout_view,
    register_user,
    auth_view,
)

from .profile_views import (
    profile_view,
    update_profile,
    home_page,
    problem_list,
    execution_result,
    languages_supported,
    about_page,
    contact_page,
    user_history,
    custom_404,
    custom_404_catch_all,
)
