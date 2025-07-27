# Code Runner API (FastAPI + Docker)

## Supports:
- Python
- Java  
- C
- C++
- JavaScript (Node.js)

## Usage:
1. Build the Docker image:
   ```bash
   docker build -t code-runner .
   ```

2. Run the container:
   ```bash
   docker run -p 8002:8002 code-runner
   ```

3. Test it:
   Use Postman or curl to POST to http://localhost:8002/run

Request JSON:
```json
{
  "language": "python",
  "code": "print(input())",
  "input": "Hello World"
}
```

## Supported Languages:
- `python` - Python 3.10
- `java` - Java 17
- `c` - GCC compiler
- `cpp` - G++ compiler  
- `javascript` - Node.js 18
