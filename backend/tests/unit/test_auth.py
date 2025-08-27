from api.core.security import (
    create_access_token,
    verify_password,
    get_password_hash,
    authenticate_user
)
from tests.factories.user_factory import UserFactory


class TestAuthService:
    """Test authentication service functions."""
    
    def test_password_hashing(self):
        """Test password hashing and verification."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Hash should be different from original password
        assert hashed != password
        
        # Verification should work
        assert verify_password(password, hashed) is True
        
        # Wrong password should fail
        assert verify_password("wrongpassword", hashed) is False
    
    def test_create_access_token(self):
        """Test JWT token creation."""
        user_email = "test@example.com"
        token = create_access_token(data={"sub": user_email})
        
        # Token should be a string
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Token should be a valid JWT format (3 parts separated by dots)
        assert len(token.split('.')) == 3
    
    def test_authenticate_user_valid(self, db_session):
        """Test user authentication with valid credentials."""
        # Create a test user
        user = UserFactory.create_with_password(password="testpass123")
        db_session.add(user)
        db_session.commit()
        
        # Authenticate with correct credentials
        authenticated_user = authenticate_user(db_session, user.email, "testpass123")
        
        assert authenticated_user is not None
        assert authenticated_user.id == user.id
        assert authenticated_user.email == user.email
    
    def test_authenticate_user_invalid_email(self, db_session):
        """Test user authentication with invalid email."""
        # Create a test user
        user = UserFactory.create_with_password(password="testpass123")
        db_session.add(user)
        db_session.commit()
        
        # Try to authenticate with wrong email
        authenticated_user = authenticate_user(db_session, "wrong@email.com", "testpass123")
        
        assert authenticated_user is False
    
    def test_authenticate_user_invalid_password(self, db_session):
        """Test user authentication with invalid password."""
        # Create a test user
        user = UserFactory.create_with_password(password="testpass123")
        db_session.add(user)
        db_session.commit()
        
        # Try to authenticate with wrong password
        authenticated_user = authenticate_user(db_session, user.email, "wrongpassword")
        
        assert authenticated_user is False
    
    def test_authenticate_user_nonexistent(self, db_session):
        """Test user authentication with non-existent user."""
        # Try to authenticate with non-existent user
        authenticated_user = authenticate_user(db_session, "nonexistent@email.com", "anypassword")
        
        assert authenticated_user is False 