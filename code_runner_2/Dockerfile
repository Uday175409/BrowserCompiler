FROM python:3.10

# Install compilers and Node.js
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    openjdk-17-jdk \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN useradd -m -u 1000 coderunner && \
    mkdir -p /app /tmp && \
    chown -R coderunner:coderunner /app /tmp

WORKDIR /app
COPY . .
RUN chown -R coderunner:coderunner /app

# Install Python dependencies
RUN pip install fastapi uvicorn

# Switch to non-root user
USER coderunner

# Expose port 8002 to match Django expectation
EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
