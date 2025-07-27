# 🚀 CodeCompiler - Multi-Language Code Execution Platform

[![Django](https://img.shields.io/badge/Django-5.2.1-green.svg)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-featured online code compiler and problem-solving platform supporting multiple programming languages with secure Docker-based execution, intuitive Monaco editor, and comprehensive problem management system.

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-Language Support**: Python, C, C++, Java with intelligent syntax highlighting
- **Secure Code Execution**: Docker-containerized compilation and execution environment
- **Problem Management**: Comprehensive system for creating, organizing, and solving coding challenges
- **Test Case Validation**: Automated testing with custom examples and hidden test cases
- **User Authentication**: Secure registration, login, and profile management system

### 🎨 **User Experience**
- **Monaco Editor Integration**: Professional code editor with IntelliSense and auto-completion
- **Bootstrap Dark Theme**: Modern, responsive design optimized for coding
- **Instant Feedback**: Real-time compilation results and comprehensive error reporting
- **Progress Tracking**: Detailed submission history and performance analytics
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### 🔧 **Admin Features**
- **Problem Creation Tool**: Intuitive admin panel for adding new coding challenges
- **Environment-Based Security**: Secure authentication using environment variables
- **Comprehensive Problem Setup**: Support for examples, test cases, and starter code templates
- **User Management**: Monitor user engagement and track platform usage

### 📱 **Technical Highlights**
- **MVC Architecture**: Clean, scalable Django backend design
- **Docker Integration**: Isolated, secure code execution environment
- **MongoDB Integration**: Flexible data storage for submissions
- **Cloudinary CDN**: Optimized image storage and delivery
- **Custom Error Handling**: Beautiful 404 pages and error management

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Django 5.2.1
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Storage**: MongoDB (Submissions), Cloudinary (Media)
- **Authentication**: Django Auth System

### **Frontend**
- **CSS Framework**: Bootstrap 5.3.3
- **JavaScript**: Vanilla JS with modern ES6+
- **Code Editor**: Monaco Editor
- **Icons**: Bootstrap Icons

### **DevOps & Deployment**
- **Containerization**: Docker for code execution
- **Environment Management**: python-dotenv
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Docker (for code execution)
- MongoDB (optional, for submission analytics)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uday-0408/compiler.git
   cd compiler
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

7. **Access the Application**
   - Main App: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin
   - Problem Management: http://localhost:8000/manage/problems/insert

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here

# Admin Access
ADMIN_PASSWORD=your-admin-password

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Database (Optional - MongoDB)
MONGODB_URI=mongodb://localhost:27017/codecompiler
```

### Docker Setup (For Code Execution)
The platform uses Docker for secure code execution. Ensure Docker is installed and running.

## 📖 Usage Guide

### For Students/Users
1. **Register/Login**: Create an account or sign in
2. **Browse Problems**: Explore available coding challenges
3. **Code & Test**: Write solutions with real-time feedback
4. **Submit Solutions**: Validate against test cases
5. **Track Progress**: Monitor your submission history

### For Educators/Admins
1. **Access Admin Panel**: Navigate to `/manage/problems/insert`
2. **Authenticate**: Enter admin password
3. **Create Problems**: Add new coding challenges
4. **Configure Test Cases**: Set up examples and validation
5. **Monitor Progress**: Track student submissions

## 🏗️ Project Structure

```
codecompiler/
├── App/                          # Main Django application
│   ├── views/                    # View controllers
│   │   ├── auth_views.py        # Authentication logic
│   │   ├── code_views.py        # Code execution & problems
│   │   ├── profile_views.py     # User profiles & general pages
│   │   └── admin_views.py       # Admin panel functionality
│   ├── code_runner/             # Code execution utilities
│   ├── DB/                      # Database utilities
│   ├── models.py                # Database models
│   ├── urls.py                  # URL routing
│   └── utils.py                 # Utility functions
├── code_runner_2/               # Docker-based code execution
├── templates/                   # HTML templates
│   ├── compiler/                # Code editor interface
│   ├── problems/                # Problem management
│   ├── auth/                    # Authentication pages
│   └── admin_problem_insert.html # Admin panel
├── static/                      # Static assets (CSS, JS, Images)
├── media/                       # User uploads
├── compiler/                    # Django project settings
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment configuration template
└── manage.py                    # Django management script
```

## � Security Features

- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: Django's built-in CSRF middleware
- **Secure File Upload**: Cloudinary integration with validation
- **Environment Variables**: Sensitive data protection
- **Docker Isolation**: Secure code execution environment
- **Authentication**: Session-based user management

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Professional coding environment
- **Syntax Highlighting**: Language-specific code coloring
- **Auto-completion**: IntelliSense for better productivity
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error presentation

## 🔧 API Reference

### Web Routes
- `GET /` - Home page
- `GET /problems/` - List all problems
- `GET /languages/` - Supported languages page
- `GET /compile/<slug>/` - Access problem compiler interface
- `POST /compile/<slug>/` - Submit solution for execution

### User Management
- `GET /login/` - User login page
- `POST /login/` - Process login
- `GET /register/` - User registration page
- `POST /register/` - Process registration
- `GET /profile/` - User profile page
- `POST /profile/update/` - Update profile information
- `GET /history/` - View submission history

### Admin Operations
- `GET /manage/problems/insert/` - Admin problem creation interface
- `POST /manage/problems/insert/` - Create new problem with test cases

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Extended Language Support**: Add Python 3.11+, Rust, Go, JavaScript
- [ ] **Advanced Analytics**: Detailed performance metrics and code complexity analysis
- [ ] **Real-time Collaboration**: Multi-user problem solving sessions
- [ ] **Contest Mode**: Timed programming competitions with rankings
- [ ] **AI-Powered Code Review**: Intelligent code suggestions and optimizations
- [ ] **Mobile App**: Native mobile applications for iOS and Android
- [ ] **Plagiarism Detection**: Advanced code similarity checking
- [ ] **Video Tutorials**: Integrated learning resources

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/uday-0408/compiler/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/uday-0408/compiler/discussions)
- **Documentation**: [Wiki](https://github.com/uday-0408/compiler/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Uday** - Lead Developer - [@uday-0408](https://github.com/uday-0408)

## 🙏 Acknowledgments

- **Django Community** - For the amazing web framework
- **Monaco Editor** - For the professional code editor
- **Bootstrap** - For the responsive design framework
- **Docker** - For secure code execution environment
- **Cloudinary** - For media management solution

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/uday-0408/compiler?style=social)
![GitHub forks](https://img.shields.io/github/forks/uday-0408/compiler?style=social)
![GitHub issues](https://img.shields.io/github/issues/uday-0408/compiler)
![GitHub pull requests](https://img.shields.io/github/issues-pr/uday-0408/compiler)

---

<div align="center">
  <p><strong>Built with ❤️ for the coding community</strong></p>
  <p>
    <a href="https://github.com/uday-0408/compiler">⭐ Star us on GitHub</a> •
    <a href="https://github.com/uday-0408/compiler/issues">🐛 Report Bug</a> •
    <a href="https://github.com/uday-0408/compiler/discussions">💡 Request Feature</a>
  </p>
</div>

