from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "hash1"  # Cambia por la contraseña real del usuario
if len(password) > 72:
    password = password[:72]
hashed = pwd_context.hash(password)
print(hashed)