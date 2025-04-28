from app import create_app

application = create_app()

# Optional: Initialize migrate inside run.py too

if __name__ == "__main__":
    application.run(debug=True, port=5001)