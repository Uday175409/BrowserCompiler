from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
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

    # Check file extension first
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
        # Don't fail immediately, try to validate with PIL
        pass

    # Check file format with PIL
    allowed_formats = ["JPEG", "PNG", "GIF", "WEBP"]
    try:
        # Reset file pointer to beginning
        image.seek(0)

        with Image.open(image) as img:
            # Force loading the image to detect any corruption
            img.load()

            # Check format
            img_format = img.format
            if img_format not in allowed_formats:
                raise ValidationError(
                    f'Unsupported image format "{img_format}". Allowed formats: {", ".join(allowed_formats)}'
                )

            # Check dimensions
            width, height = img.size
            if width < 50 or height < 50:
                raise ValidationError(
                    f"Image dimensions too small. Minimum size: 50x50px. Your image: {width}x{height}px"
                )

            if width > 3000 or height > 3000:
                raise ValidationError(
                    f"Image dimensions too large. Maximum size: 3000x3000px. Your image: {width}x{height}px"
                )

    except Exception as e:
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

    finally:
        # Reset file pointer for subsequent use
        image.seek(0)


def validate_profile_image(image):
    """
    Specific validator for profile images
    """
    validate_image_file(image)

    # Additional profile-specific validations
    try:
        # Reset file pointer to beginning
        image.seek(0)

        with Image.open(image) as img:
            # Check if image is square (recommended for profile pictures)
            width, height = img.size
            aspect_ratio = width / height
            if aspect_ratio < 0.5 or aspect_ratio > 2.0:
                # Don't raise error, just pass - we'll resize it
                pass

    except Exception:
        # If we can't check, that's fine - the main validator will catch serious issues
        pass

    finally:
        # Reset file pointer for subsequent use
        image.seek(0)
