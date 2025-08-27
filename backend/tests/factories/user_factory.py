import factory
from api.models.user import Usuario
from api.core.security import get_password_hash


class UserFactory(factory.Factory):
    class Meta:
        model = Usuario
    
    nome = factory.Faker('name')
    email = factory.Faker('email')
    senha = factory.LazyFunction(lambda: get_password_hash("testpassword123"))
    
    @classmethod
    def create_with_password(cls, password: str = "testpassword123", **kwargs):
        """Create a user with a specific password."""
        kwargs['senha'] = get_password_hash(password)
        return cls(**kwargs) 