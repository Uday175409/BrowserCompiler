# Cloudinary Setup Instructions

## 1. Create Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your dashboard: [https://cloudinary.com/console](https://cloudinary.com/console)

## 2. Get Your Credentials
From your Cloudinary dashboard, copy:
- **Cloud Name**
- **API Key** 
- **API Secret**

## 3. Update .env File
Replace the placeholder values in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 4. Test the Setup
1. Run the Django server: `python manage.py runserver`
2. Go to your profile page
3. Try uploading a profile picture
4. Check your Cloudinary dashboard to see the uploaded image

## Benefits of Cloudinary Integration:
- ✅ **No local storage** - Images stored in the cloud
- ✅ **Automatic optimization** - Images optimized for web
- ✅ **Automatic resizing** - Profile pictures resized to 400x400px
- ✅ **CDN delivery** - Fast image loading worldwide
- ✅ **Face detection** - Smart cropping focuses on faces
- ✅ **Format conversion** - Automatic format optimization (WebP, etc.)

## Features Implemented:
- Profile picture upload with Cloudinary
- Automatic image transformation (400x400px, face-focused cropping)
- Quality and format optimization
- Navbar profile picture display
- Fallback to default avatar if no picture uploaded
