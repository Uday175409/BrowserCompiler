from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile

## Removed Pillow import; only Cloudinary validation will be used
import os
import mimetypes


def validate_image_file(image):
    """
    Custom validator for image files
    """
    # Check file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB
    if image.size > max_size:
        raise ValidationError(
            f"Image file too large. Maximum size allowed is 5MB. Your file is {image.size / (1024*1024):.1f}MB."
        )

    # Check file extension
    file_name = getattr(image, "name", "")
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    file_extension = os.path.splitext(file_name.lower())[1]
    if not file_extension or file_extension not in allowed_extensions:
        raise ValidationError(
            f'Invalid file extension "{file_extension}". Allowed extensions: {", ".join(allowed_extensions)}'
        )

    # Check MIME type
    mime_type, _ = mimetypes.guess_type(file_name)
    allowed_mime_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if mime_type not in allowed_mime_types:
        raise ValidationError(f"Unsupported image type: {mime_type}")
        # All other validation and processing will be handled by Cloudinary

        # All other validation and processing will be handled by Cloudinary
        if isinstance(e, ValidationError):
            raise
        # More specific error message
        error_msg = str(e).lower()
        if "cannot identify image file" in error_msg:
            raise ValidationError(
                "The uploaded file is not a valid image or is corrupted."
            )
        elif "unknown file extension" in error_msg:
            raise ValidationError(
                f"Unknown or unsupported image file format. Please use: {', '.join(allowed_extensions)}"
            )
        else:
            raise ValidationError(f"Invalid image file: {str(e)}")


def validate_profile_image(image):
    """
    Specific validator for profile images
    """
    validate_image_file(image)

    # Additional profile-specific validations
    # All other validation and processing will be handled by Cloudinary
    # All other validation and processing will be handled by Cloudinary
