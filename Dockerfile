# Development Dockerfile with Poetry
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    APP_HOME=/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    python3-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Set work directory
WORKDIR $APP_HOME

# Configure Poetry
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Copy Poetry files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --no-root && rm -rf "$POETRY_CACHE_DIR"

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Run migrations and start Uvicorn
ENTRYPOINT ["sh", "-c", "alembic upgrade heads && uvicorn main:app --host 0.0.0.0 --port 8000"] 