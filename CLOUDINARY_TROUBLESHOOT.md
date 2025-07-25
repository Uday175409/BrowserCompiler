# 🔧 Cloudinary Troubleshooting Guide

## Current Status:
✅ Cloudinary credentials are correctly loaded from .env
✅ Environment variables are working
✅ Packages are installed

## If you're still getting the error:

### 1. **Restart Django Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
python manage.py runserver
```

### 2. **Test Cloudinary Connection**
Run this in Django shell:
```bash
python manage.py shell
```

Then in the shell:
```python
import cloudinary
import os
from dotenv import load_dotenv

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"), 
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Test upload (optional)
print("Cloudinary config:", cloudinary.config())
```

### 3. **Check Your .env File Location**
Make sure `.env` is in the same directory as `manage.py`:
```
D:\Project\Experiment\Compiler\
├── .env                 ← Should be here
├── manage.py
├── compiler/
└── App/
```

### 4. **Verify Environment Variables**
Run our test script again:
```bash
python test_env.py
```

### 5. **Alternative: Use Settings Directly**
If still having issues, you can temporarily hardcode in settings.py:
```python
# In compiler/settings.py, replace the Cloudinary config with:
cloudinary.config(
    cloud_name="dmos6g8x2",
    api_key="493127586542917", 
    api_secret="Sc2xgg3izc1iLAyU_ORzIrf_RKw",
    secure=True
)
```

## Your .env Values:
- CLOUDINARY_CLOUD_NAME=dmos6g8x2
- CLOUDINARY_API_KEY=493127586542917  
- CLOUDINARY_API_SECRET=Sc2xgg3izc1iLAyU_ORzIrf_RKw

These look correct! The issue is likely just needing a server restart.
