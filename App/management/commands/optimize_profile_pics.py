from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from App.models import AppUser
from App.views.profile_views import validate_and_process_image
from PIL import Image
import os


class Command(BaseCommand):
    help = "Optimize existing profile pictures to reduce file size and standardize dimensions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be optimized without making changes",
        )
        parser.add_argument(
            "--max-size",
            type=int,
            default=5,
            help="Maximum file size in MB (default: 5)",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        max_size_mb = options["max_size"]

        users_with_pics = AppUser.objects.exclude(profile_pic="").exclude(
            profile_pic__isnull=True
        )
        total_users = users_with_pics.count()

        if total_users == 0:
            self.stdout.write(
                self.style.SUCCESS("No users with profile pictures found.")
            )
            return

        self.stdout.write(f"Found {total_users} users with profile pictures.")

        optimized_count = 0
        error_count = 0

        for user in users_with_pics:
            try:
                if not user.profile_pic.file:
                    continue

                original_size = user.profile_pic.size
                original_size_mb = original_size / (1024 * 1024)

                self.stdout.write(f"Processing {user.username}'s profile picture...")
                self.stdout.write(f"  Original size: {original_size_mb:.2f}MB")

                # Check if optimization is needed
                max_size_bytes = max_size_mb * 1024 * 1024
                needs_optimization = original_size > max_size_bytes

                # Check dimensions
                try:
                    with Image.open(user.profile_pic.file) as img:
                        width, height = img.size
                        needs_resize = width > 800 or height > 800

                        if needs_optimization or needs_resize:
                            if dry_run:
                                self.stdout.write(
                                    f"  Would optimize: Size {original_size_mb:.2f}MB, Dimensions {width}x{height}"
                                )
                                optimized_count += 1
                            else:
                                # Process the image
                                is_valid, result = validate_and_process_image(
                                    user.profile_pic.file,
                                    max_size_mb=max_size_mb,
                                    max_dimensions=(800, 800),
                                )

                                if is_valid and hasattr(result, "read"):
                                    # Save the new file only if result is a file-like object
                                    old_file_name = user.profile_pic.name
                                    user.profile_pic.save(
                                        old_file_name, result, save=True
                                    )

                                    new_size = user.profile_pic.size
                                    new_size_mb = new_size / (1024 * 1024)
                                    savings = (
                                        (original_size - new_size) / original_size
                                    ) * 100

                                    self.stdout.write(
                                        self.style.SUCCESS(
                                            f"  Optimized: {original_size_mb:.2f}MB → {new_size_mb:.2f}MB "
                                            f"(saved {savings:.1f}%)"
                                        )
                                    )
                                    optimized_count += 1
                                else:
                                    self.stdout.write(
                                        self.style.ERROR(f"  Error: {result}")
                                    )
                                    error_count += 1
                        else:
                            self.stdout.write("  Already optimized, skipping.")

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"  Error processing image: {str(e)}")
                    )
                    error_count += 1

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing user {user.username}: {str(e)}")
                )
                error_count += 1

        # Summary
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nDry run complete. Would optimize {optimized_count} profile pictures."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nOptimization complete! "
                    f"Processed: {optimized_count}, Errors: {error_count}"
                )
            )
