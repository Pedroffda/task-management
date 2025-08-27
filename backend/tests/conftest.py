import pytest
import asyncio
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from api.core.db_conection import get_db
from api.models.base import Base

# Test database URL - use in-memory database
TEST_DATABASE_URL = "sqlite:///:memory:"

# Create test database engine
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def db_engine():
    """Create database engine for the test session."""
    # Create tables once for the session
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    # Drop tables at the end of session
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a fresh database session for each test."""
    # Create session
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(db_session) -> Generator:
    """Create a test client with a fresh database."""
    
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    # Override the database dependency
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clear overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def auth_headers(client, test_user):
    """Create authentication headers for authenticated requests."""
    from api.core.security import create_access_token
    
    # Use the same user as test_user to ensure consistency
    access_token = create_access_token(data={"sub": test_user.email})
    
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture(scope="function")
def test_user(db_session):
    """Create a test user for testing."""
    from tests.factories.user_factory import UserFactory
    
    user = UserFactory()
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    return user


@pytest.fixture(scope="function")
def test_task(db_session, test_user):
    """Create a test task for testing."""
    from tests.factories.task_factory import TaskFactory
    
    task = TaskFactory(usuario_id=test_user.id)
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    
    return task 