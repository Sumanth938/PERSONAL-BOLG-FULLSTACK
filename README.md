# PERSONAL-BLOG-FULLSTACK Application

## INSTRUCTIONS TO RUN BACKEND APPLICATION

### Requirements

Ensure the following software is installed on your machine:
- Python (>=3.8)
- PostgreSQL
- Pip (Python package installer)
- Git (for cloning the repository)

### Setup Instructions

1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd PERSONAL_BLOG
    ```

2. **Navigate to the BACKEND Directory**:
    Move to the `BACKEND` directory:
    ```bash
    cd BACKEND
    ```

3. **Set Up a Virtual Environment**:
    Create and activate a virtual environment for Python dependencies.

    - **On Linux/Mac**:
        ```bash
        python3 -m venv env
        source env/bin/activate
        ```

    - **On Windows**:
        ```bash
        python -m venv env
        env\Scripts\activate
        ```

4. **Install Dependencies**:
    Use `pip` to install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

5. **Start the Backend Application**:
    Run the FastAPI application:
    ```bash
    uvicorn main:app --reload
    ```
    By default, the server will start on `http://127.0.0.1:8000`.

---

## INSTRUCTIONS TO RUN FRONTEND APPLICATION

1. **Navigate to the FRONTEND Directory**:
    Move to the `FRONTEND` directory:
    ```bash
    cd ../FRONTEND
    ```

2. **Install the Required Packages**:
    Install the necessary Node.js packages using `npm`:
    ```bash
    npm install
    ```

4. **Start the Frontend Application**:
    Run the frontend application:
    ```bash
    npm start
    ```
    By default, the frontend application will be served at `http://localhost:3000`.
