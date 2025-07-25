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

    problems = Problem.objects.all()
    return render(request, "problems/index.html", {"problems": problems})


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
    submissions = get_user_submissions(user_id)

    # Calculate statistics
    total_submissions = 0
    accepted_count = 0
    wrong_count = 0

    for record in submissions:
        if hasattr(record, "submissions"):
            for submission in record.submissions:
                total_submissions += 1
                if submission.status == "accepted":
                    accepted_count += 1
                elif submission.status in ["wrong answer", "Wrong Answer"]:
                    wrong_count += 1

    # Calculate success rate
    success_rate = round(
        (accepted_count / total_submissions * 100) if total_submissions > 0 else 0, 1
    )

    context = {
        "submissions": submissions,
        "total_submissions": total_submissions,
        "accepted_count": accepted_count,
        "wrong_count": wrong_count,
        "success_rate": success_rate,
    }

    return render(request, "history/history.html", context)
