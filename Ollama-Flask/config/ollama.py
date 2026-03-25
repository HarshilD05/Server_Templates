import os
import subprocess
import time
import urllib.request
import urllib.error
import sys

OLLAMA_BASE_URL = "http://127.0.0.1:11434/"

def init_ollama():
    try:
        # 1. Check if Ollama is installed
        try:
            result = subprocess.run(["ollama", "-v"], capture_output=True, text=True, check=True)
            print(f"✅ Ollama is installed: {result.stdout.strip()}")
        except FileNotFoundError:
            raise Exception("Ollama is not installed. Please install Ollama first from https://ollama.com/")
        except subprocess.CalledProcessError:
            raise Exception("Failed to check Ollama version.")

        # 2. Check if Ollama is running
        is_running = False
        try:
            req = urllib.request.Request(OLLAMA_BASE_URL)
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    is_running = True
                    print("✅ Ollama instance is already running.")
        except urllib.error.URLError:
            print("⚠️ Ollama is not running. Starting ollama serve...")

        if not is_running:
            log_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ollama.log")
            log_file = open(log_path, "a")
            
            ollama_process = subprocess.Popen(
                ["ollama", "serve"],
                stdout=log_file,
                stderr=log_file,
                start_new_session=True
            )
            print(f"✅ Started Ollama process. Logs are tied to {log_path}")
            
            # Wait a few seconds for server to start
            time.sleep(3)

        # 3. Check and install required models
        req_models_path = os.path.join(os.path.dirname(__file__), "req_models.txt")
        if os.path.exists(req_models_path):
            with open(req_models_path, "r") as f:
                required_models = [m.strip() for m in f.read().split("\n") if m.strip()]

            installed_models = []
            try:
                result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=True)
                lines = result.stdout.strip().split("\n")[1:]
                installed_models = [line.split("\t")[0].strip().split(":")[0] for line in lines]
            except Exception as e:
                print(f"Failed to list models: {e}")

            for model in required_models:
                if model not in installed_models:
                    print(f"⏳ Model '{model}' not found. Pulling model... This may take a while.")
                    try:
                        subprocess.run(["ollama", "pull", model], check=True)
                        print(f"✅ Successfully pulled model '{model}'")
                    except subprocess.CalledProcessError as e:
                        print(f"❌ Failed to pull model '{model}': {e}")
                else:
                    print(f"✅ Model '{model}' is already installed.")

    except Exception as e:
        print(f"❌ Initialization Error: {e}")
        sys.exit(1)
