# profile_views.py

from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from django.contrib import messages
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
import os
import cloudinary.uploader
from .code_views import (
    compile_code_basic,
    compile_code_monaco,
    run_examples,
    submit_test_cases,
)
from App.mongo import get_user_submissions

from django.contrib.auth.decorators import login_required
from App.models import AppUser


# ----------------------------
# ✅ Cloudinary Upload Helper
# ----------------------------
def upload_image_to_cloudinary(image_file, folder="profile_pics"):
    """
    Upload image to Cloudinary with automatic optimization

    Args:
        image_file: Uploaded image file
        folder: Cloudinary folder name

    Returns:
        tuple: (success, cloudinary_url_or_error_message)
    """
    try:
        # Ensure Cloudinary is configured
        import os
        from dotenv import load_dotenv

        load_dotenv()

        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True,
        )

        # Reset file pointer
        image_file.seek(0)

        # Upload to Cloudinary with transformations
        result = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "format": "auto"},
            ],
            use_filename=True,
            unique_filename=True,
        )

        return True, result["secure_url"]

    except Exception as e:
        return False, f"Failed to upload image: {str(e)}"


# ----------------------------
# ✅ Profile View (GET user data)
# ----------------------------


@login_required(login_url="auth-page")
def profile_view(request):
    user = request.user  # ✅ Use Django auth system
    return render(request, "profile/index.html", {"user": user})


# ----------------------------
# ✅ Profile Update
# ----------------------------
@login_required(login_url="auth-page")
def update_profile(request):
    user = request.user

    if request.method == "POST":
        user.username = request.POST.get("username", user.username)
        user.email = request.POST.get("email", user.email)
        user.phone = request.POST.get("phone", user.phone)
        user.gender = request.POST.get("gender", user.gender)

        dob_input = request.POST.get("dob", "")
        user.dob = dob_input if dob_input else None

        # Handle profile picture upload with Cloudinary
        if "profile_pic" in request.FILES:
            uploaded_image = request.FILES["profile_pic"]

            # Basic validation
            if uploaded_image.size > 5 * 1024 * 1024:  # 5MB limit
                messages.error(request, "Image size must be less than 5MB.")
                return render(request, "profile/update.html", {"user": user})

            # Upload to Cloudinary
            success, result = upload_image_to_cloudinary(uploaded_image)

            if success:
                user.profile_pic = result  # Store Cloudinary URL
                messages.success(request, "Profile picture updated successfully!")
            else:
                messages.error(request, f"Profile picture upload failed: {result}")
                return render(request, "profile/update.html", {"user": user})

        user.save()
        messages.success(request, "Profile updated successfully!")
        return redirect("profile-page")

    return render(request, "profile/update.html", {"user": user})


# ----------------------------
# ✅ General Static Pages
# ----------------------------
def home_page(request):
    return render(request, "home/home.html")


def problem_list(request):
    from App.models import Problem
    from django.db.models import Count, Q

    problems = Problem.objects.all()

    # Calculate counts by difficulty
    easy_count = problems.filter(difficulty="Easy").count()
    medium_count = problems.filter(difficulty="Medium").count()
    hard_count = problems.filter(difficulty="Hard").count()

    context = {
        "problems": problems,
        "easy_count": easy_count,
        "medium_count": medium_count,
        "hard_count": hard_count,
    }

    return render(request, "problems/index.html", context)


def execution_result(request):
    return render(request, "output.html")


def languages_supported(request):
    return render(request, "languages/index.html")


def about_page(request):
    return render(request, "about/about.html")


def contact_page(request):
    return render(request, "contact/index.html")


@login_required(login_url="auth-page")
def user_history(request):
    user_id = request.user.id
    print(f"🔍 DEBUG: Fetching history for user_id: {user_id}")

    submission_records = get_user_submissions(user_id)
    print(f"🔍 DEBUG: Found {len(submission_records)} submission records")

    # Flatten submissions for individual filtering
    individual_submissions = []
    for record in submission_records:
        print(f"🔍 DEBUG: Processing record: {record}")
        if hasattr(record, "submissions"):
            print(f"🔍 DEBUG: Record has {len(record.submissions)} submissions")
            for submission in record.submissions:
                # Add problem info to each submission
                submission.problem_id = record.problem_id
                submission.problem_title = getattr(record, "problem_title", None)
                submission.created_at = record.created_at
                individual_submissions.append(submission)
        else:
            print(f"🔍 DEBUG: Record has no submissions attribute")

    print(f"🔍 DEBUG: Total individual submissions: {len(individual_submissions)}")

    # Sort by submission time (newest first)
    individual_submissions.sort(
        key=lambda x: getattr(x, "submitted_at", x.created_at), reverse=True
    )

    # Calculate statistics
    total_submissions = len(individual_submissions)
    accepted_count = sum(
        1
        for sub in individual_submissions
        if sub.status.lower() in ["accepted", "correct"]
    )
    wrong_count = sum(
        1
        for sub in individual_submissions
        if sub.status.lower()
        in ["wrong answer", "wrong", "failed", "error", "time limit exceeded"]
    )

    # Calculate success rate
    success_rate = round(
        (accepted_count / total_submissions * 100) if total_submissions > 0 else 0, 1
    )

    print(
        f"🔍 DEBUG: Statistics - Total: {total_submissions}, Accepted: {accepted_count}, Wrong: {wrong_count}"
    )

    context = {
        "submissions": individual_submissions,
        "total_submissions": total_submissions,
        "accepted_count": accepted_count,
        "wrong_count": wrong_count,
        "success_rate": success_rate,
    }

    return render(request, "history/history.html", context)


# ----------------------------
# ✅ Custom Error Handlers
# ----------------------------
def custom_404(request, exception):
    """
    Custom 404 error handler with beautiful design
    """
    return render(request, "404.html", status=404)


def custom_404_test(request):
    """
    Test view for the custom 404 page - works even in DEBUG mode
    """
    return render(request, "404.html", status=404)


def custom_404_catch_all(request, invalid_path):
    """
    Catch-all view for handling any undefined URLs - works in DEBUG mode
    """
    return render(request, "404.html", status=404)
