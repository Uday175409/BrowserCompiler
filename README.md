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

## 🐳 Code Execution Architecture

### **Flexible Execution System**
The platform provides two robust methods for secure code execution, allowing you to choose based on your needs:

### **Method 1: RapidAPI Judge0 Service**
**File: `App/code_runner/code_runner2.py`**

This method uses the professional Judge0 compilation service through RapidAPI:

```python
# Supported languages with Judge0 IDs
LANGUAGE_ID_MAP = {
    "python": 71,    # Python 3.8.1
    "cpp": 54,       # C++ (GCC 9.2.0)
    "c": 50,         # C (GCC 9.2.0)
    "java": 62,      # Java (OpenJDK 13.0.1)
}
```

**Features:**
- ✅ **Professional Grade**: Industrial-strength execution environment
- ✅ **Zero Setup**: No Docker or container management needed
- ✅ **Scalable**: Handles concurrent executions automatically
- ✅ **Secure**: Sandboxed execution with time and memory limits
- ✅ **Multi-Language**: Supports 60+ programming languages

**Configuration:**
```env
# Add to .env file
API_KEY=your-rapidapi-judge0-key
```

### **Method 2: Self-Hosted Docker Container**
**Directory: `code_runner_2/`**

For users who prefer complete control over their execution environment:

**Container Features:**
- 🐳 **FastAPI-based execution server**
- 🔒 **Isolated execution environment**
- ⚡ **High-performance local processing**
- 🛠️ **Customizable language configurations**
- 📊 **Detailed execution metrics**

**Setup Instructions:**
```bash
# Navigate to the Docker setup directory
cd code_runner_2

# Build the execution container
docker build -t codecompiler-runner .

# Run the container (expose on port 8001)
docker run -d -p 8001:8000 --name code-executor codecompiler-runner

# Verify container is running
curl http://localhost:8001/health
```

**Container Structure:**
```
code_runner_2/
├── Dockerfile              # Container configuration
├── requirements.txt        # Python dependencies
├── main.py                 # FastAPI server
├── executors/              # Language-specific execution logic
│   ├── python_executor.py
│   ├── cpp_executor.py
│   ├── java_executor.py
│   └── c_executor.py
└── security/               # Sandbox and security configurations
```

### **When to Use Which Method**

| Scenario | Recommended Method | Reason |
|----------|-------------------|---------|
| **Quick Development** | RapidAPI Judge0 | Instant setup, no infrastructure needed |
| **Production (Low Volume)** | RapidAPI Judge0 | Cost-effective, professional support |
| **Production (High Volume)** | Docker Container | Better cost control, no API limits |
| **Educational Institution** | Docker Container | Complete control, offline capability |
| **Corporate Environment** | Docker Container | Data security, compliance requirements |
| **Prototyping** | RapidAPI Judge0 | Fastest time to market |

### **Switching Between Methods**

**To Use RapidAPI (Default):**
```python
# In your Django views (code_views.py)
from App.code_runner.code_runner2 import execute_code

# Execute code using Judge0 API
result = execute_code(code, language, input_data)
```

**To Use Docker Container:**
```python
# In your Django views (code_views.py)
from App.code_runner.code_runner3 import execute_code

# Execute code using local Docker container
result = execute_code(code, language, input_data)
```

### **Environment Configuration**

**For RapidAPI Setup:**
```env
# .env file
DEBUG=True
SECRET_KEY=your-django-secret-key
API_KEY=your-rapidapi-judge0-key
ADMIN_PASSWORD=your-admin-password
```

**For Docker Container Setup:**
```env
# .env file
DEBUG=True
SECRET_KEY=your-django-secret-key
CODE_EXECUTION_URL=http://localhost:8001
ADMIN_PASSWORD=your-admin-password
```

### **Performance Comparison**

| Metric | RapidAPI Judge0 | Docker Container |
|--------|----------------|------------------|
| **Setup Time** | < 5 minutes | 15-30 minutes |
| **Execution Speed** | 200-500ms | 50-200ms |
| **Concurrent Users** | Unlimited* | Hardware dependent |
| **Monthly Cost** | $10-50+ | Server costs only |
| **Maintenance** | Zero | Container updates |

### **Creating Your Own Docker Container**

If you want to customize the execution environment:

#### **1. Container Structure**
```
code_runner_2/
├── Dockerfile                    # Container configuration
├── main.py                      # FastAPI execution server
├── requirements.txt             # Python dependencies
├── config/
│   ├── languages.json          # Language configurations
│   └── security.json           # Security settings
├── executors/
│   ├── base_executor.py        # Base execution class
│   ├── python_executor.py      # Python code execution
│   ├── cpp_executor.py         # C++ compilation and execution
│   ├── java_executor.py        # Java compilation and execution
│   └── c_executor.py           # C compilation and execution
├── sandbox/
│   ├── security_policy.json    # Sandbox restrictions
│   └── resource_limits.json    # Memory and time limits
└── tests/
    └── test_executors.py       # Unit tests for executors
```

#### **2. Custom Dockerfile Example**
```dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc g++ openjdk-11-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create sandbox user for security
RUN useradd -m -s /bin/bash sandbox

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
  CMD curl -f http://localhost:8000/health || exit 1

# Start FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **3. Language Configuration**
```json
{
  "python": {
    "extension": ".py",
    "command": "python3",
    "timeout": 10,
    "memory_limit": "128MB"
  },
  "cpp": {
    "extension": ".cpp",
    "compile_command": "g++ -o program program.cpp",
    "run_command": "./program",
    "timeout": 15,
    "memory_limit": "256MB"
  }
}
```

#### **4. Security Configuration**
```json
{
  "max_execution_time": 30,
  "max_memory_usage": "512MB",
  "allowed_system_calls": [
    "read", "write", "exit", "brk", "mmap"
  ],
  "blocked_operations": [
    "network_access", "file_system_write", "process_creation"
  ]
}
```

#### **5. Building and Testing**
```bash
# Build your custom container
docker build -t my-code-executor .

# Test the container
docker run -p 8001:8000 my-code-executor

# Test code execution
curl -X POST http://localhost:8001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello, World!\")",
    "language": "python",
    "input": ""
  }'
```

#### **6. Integration with Django**
```python
# Create custom executor in code_runner3.py
import requests
import json

def execute_code(code, language="python", input_data=""):
    url = "http://localhost:8001/execute"
    payload = {
        "code": code,
        "language": language,
        "input": input_data
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        return response.json().get("output", "No output")
    except Exception as e:
        return f"Execution error: {str(e)}"
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

**For RapidAPI Judge0 Setup (Recommended):**
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here

# Admin Access
ADMIN_PASSWORD=your-admin-password

# RapidAPI Judge0 Configuration
API_KEY=your-rapidapi-judge0-key

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Database (Optional - MongoDB)
MONGODB_URI=mongodb://localhost:27017/codecompiler
```

**For Docker Container Setup:**
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here

# Admin Access
ADMIN_PASSWORD=your-admin-password

# Docker Container Configuration
CODE_EXECUTION_URL=http://localhost:8001
DOCKER_CONTAINER_NAME=codecompiler-runner

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Database (Optional - MongoDB)
MONGODB_URI=mongodb://localhost:27017/codecompiler
```

### Docker Setup (For Code Execution)

The platform supports **two code execution methods**:

#### **Option 1: RapidAPI Judge0 (Recommended for Quick Setup)**
Uses Judge0 API via RapidAPI for code execution - no Docker setup required.

**Setup:**
1. Get a RapidAPI key from [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Add to your `.env` file:
   ```env
   API_KEY=your-rapidapi-key-here
   ```
3. The system will automatically use `code_runner2.py` for execution

**Pros:**
- ✅ No Docker installation required
- ✅ Quick setup and deployment
- ✅ Handles multiple languages out of the box
- ✅ Professional-grade execution environment

**Cons:**
- ❌ Requires internet connection
- ❌ API rate limits may apply
- ❌ Monthly API costs for heavy usage

#### **Option 2: Self-Hosted Docker Container (Advanced)**
Run your own Docker-based execution environment for complete control.

**Setup:**
1. Install Docker on your system
2. Navigate to `code_runner_2/` directory
3. Build the container:
   ```bash
   cd code_runner_2
   docker build -t codecompiler-runner .
   docker run -p 8001:8000 codecompiler-runner
   ```
4. Update your Django settings to use the local container

**Pros:**
- ✅ Complete control over execution environment
- ✅ No API costs or rate limits
- ✅ Works offline
- ✅ Can customize language configurations

**Cons:**
- ❌ Requires Docker installation and management
- ❌ More complex setup and maintenance
- ❌ Requires server resources

#### **Switching Between Methods**

To switch from RapidAPI to Docker container:
1. Ensure your Docker container is running on port 8001
2. In your Django views, import from `code_runner3.py` instead of `code_runner2.py`
3. Update the code execution calls to point to `localhost:8001`

To switch from Docker to RapidAPI:
1. Ensure you have a valid `API_KEY` in your `.env` file
2. Import from `code_runner2.py` in your Django views
3. The system will automatically use Judge0 API

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

## 🚀 Deployment Guide

### **Production Deployment**

#### **Method 1: RapidAPI Judge0 (Recommended)**
Perfect for most production deployments:

```bash
# 1. Set production environment variables
export DEBUG=False
export API_KEY=your-rapidapi-key
export SECRET_KEY=your-production-secret-key

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Collect static files
python manage.py collectstatic

# 5. Start with Gunicorn
gunicorn compiler.wsgi:application
```

#### **Method 2: Docker Container**
For high-volume or corporate deployments:

```bash
# 1. Start the code execution container
docker run -d -p 8001:8000 --name code-executor \
  --restart unless-stopped codecompiler-runner

# 2. Configure environment for Docker
export CODE_EXECUTION_URL=http://localhost:8001
export DEBUG=False

# 3. Deploy Django application
gunicorn compiler.wsgi:application
```

### **Scaling Considerations**

| Users | Recommended Setup |
|-------|-------------------|
| < 100 | RapidAPI Judge0 |
| 100-1000 | RapidAPI Judge0 + CDN |
| 1000-10000 | Docker Container + Load Balancer |
| 10000+ | Kubernetes + Multiple Containers |

## 🔧 Troubleshooting

### **Common Issues**

#### **RapidAPI Connection Issues**
```bash
# Test API connectivity
curl -X GET "https://judge0-ce.p.rapidapi.com/languages" \
  -H "X-RapidAPI-Key: YOUR_API_KEY"
```

#### **Docker Container Not Starting**
```bash
# Check container logs
docker logs codecompiler-runner

# Rebuild container
docker build -t codecompiler-runner --no-cache .
```

#### **Code Execution Timeouts**
- **RapidAPI**: Increase timeout in `code_runner2.py`
- **Docker**: Adjust container memory limits

### **Performance Optimization**

#### **For RapidAPI Setup**
```python
# In code_runner2.py, add connection pooling
import urllib3
http = urllib3.PoolManager()
```

#### **For Docker Setup**
```bash
# Allocate more resources to container
docker run -d -p 8001:8000 --memory=2g --cpus=2 codecompiler-runner
```

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

