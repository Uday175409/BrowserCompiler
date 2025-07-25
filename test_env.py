#!/usr/bin/env python
"""Test script to check if environment variables are loaded correctly"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🔍 Environment Variables Check:")
print("=" * 50)

# Check Cloudinary variables
cloudinary_vars = {
    "CLOUDINARY_CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
    "CLOUDINARY_API_KEY": os.getenv("CLOUDINARY_API_KEY"),
    "CLOUDINARY_API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
}

for key, value in cloudinary_vars.items():
    if value:
        if key == "CLOUDINARY_API_SECRET":
            # Hide the secret for security
            print(
                f"✅ {key}: {value[:4]}...{value[-4:] if len(value) > 8 else 'short'}"
            )
        else:
            print(f"✅ {key}: {value}")
    else:
        print(f"❌ {key}: Not found or empty")

print("\n🔧 Django Variables:")
print(f"✅ SECRET_KEY: {os.getenv('SECRET_KEY', 'Using default')[:20]}...")
print(f"✅ DEBUG: {os.getenv('DEBUG', 'True')}")

print("\n💡 If any variables show as 'Not found', check your .env file!")
