from db import SessionLocal, Usuario
from auth import hashear_contraseña

def add_user():
    db = SessionLocal()
    user = Usuario(
        correo="admin@example.com",
        hashed_password=hashear_contraseña("admin"),
        es_administrador=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

add_user()
