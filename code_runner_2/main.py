from fastapi import FastAPI
from pydantic import BaseModel
import subprocess, uuid, os, time, resource

app = FastAPI()


class CodeRequest(BaseModel):
    language: str
    code: str
    input: str = ""


def set_limits():
    # Limit CPU time: 3 seconds
    resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
    # Limit memory: 256 MB (in bytes)
    resource.setrlimit(resource.RLIMIT_AS, (128 * 1024 * 1024, 256 * 1024 * 1024))


@app.post("/run")
def run_code(req: CodeRequest):
    uid = str(uuid.uuid4())
    file_path = f"/tmp/code_{uid}"
    input_path = f"/tmp/input_{uid}.txt"
    bin_path = f"/tmp/bin_{uid}"

    try:
        with open(input_path, "w") as f:
            f.write(req.input)

        if req.language == "python":
            file_path += ".py"
            with open(file_path, "w") as f:
                f.write(req.code)
            cmd = ["python3", file_path]

        elif req.language == "c":
            file_path += ".c"
            with open(file_path, "w") as f:
                f.write(req.code)
            subprocess.run(["gcc", file_path, "-o", bin_path], check=True)
            cmd = [bin_path]

        elif req.language == "cpp":
            file_path += ".cpp"
            with open(file_path, "w") as f:
                f.write(req.code)
            subprocess.run(["g++", file_path, "-o", bin_path], check=True)
            cmd = [bin_path]

        elif req.language == "java":
            file_path = "/tmp/Main.java"
            with open(file_path, "w") as f:
                f.write(req.code)
            compile_result = subprocess.run(["javac", file_path], capture_output=True)
            if compile_result.returncode != 0:
                return {
                    "stdout": "",
                    "stderr": compile_result.stderr.decode(),
                    "exit_code": compile_result.returncode,
                }

            cmd = ["java", "-cp", "/tmp", "Main"]

        elif req.language == "javascript":
            file_path += ".js"
            with open(file_path, "w") as f:
                f.write(req.code)
            cmd = ["node", file_path]
        else:
            return {"error": "Unsupported language"}

        start = time.time()

        # Try to get resource usage, fallback if not available
        try:
            usage_before = resource.getrusage(resource.RUSAGE_CHILDREN)
        except (AttributeError, OSError):
            usage_before = None

        result = subprocess.run(
            cmd,
            input=req.input.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=5,
            preexec_fn=(
                set_limits if req.language != "java" else None
            ),  # 🚨 Enforces the limits before execution
        )

        end = time.time()

        # Try to get resource usage, fallback if not available
        try:
            usage_after = resource.getrusage(resource.RUSAGE_CHILDREN)
            memory_used = usage_after.ru_maxrss if usage_before else 0
        except (AttributeError, OSError):
            memory_used = 0

        time_taken = round(end - start, 4)

        return {
            "stdout": result.stdout.decode(),
            "stderr": result.stderr.decode(),
            "exit_code": result.returncode,
            "time_taken": time_taken,
            "memory_used": memory_used,
        }

    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}
    except subprocess.CalledProcessError as e:
        return {"error": "Compilation failed", "stderr": str(e)}
    except MemoryError:
        return {"error": "Memory limit exceeded"}
    finally:
        for path in [file_path, input_path, bin_path if "bin_path" in locals() else ""]:
            if path and os.path.exists(path):
                os.remove(path)
