from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from db import Usuario
from db_session import obtener_db

SECRET_KEY = "e6bd0f82adcd001df5ab12f3f2f0c9d65dd08506b39c1a34f837d38c0e08b2e4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_contraseña(contraseña_plana: str) -> str:
    return pwd_context.hash(contraseña_plana)

def verificar_contraseña(contraseña_plana: str, contraseña_hash: str) -> bool:
    return pwd_context.verify(contraseña_plana, contraseña_hash)

async def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(obtener_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        identificador_usuario = payload.get("sub")
        if identificador_usuario is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se puede autenticar")
        usuario = db.query(Usuario).filter(Usuario.correo == identificador_usuario).first()
        if usuario is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return usuario
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

def es_administrador(usuario: Usuario = Depends(obtener_usuario_actual)):
    if not usuario.es_administrador:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso no autorizado")
    return usuario

def crear_token_acceso(identificador_usuario: str, expires_delta: timedelta = None) -> str:
    to_encode = {"sub": identificador_usuario}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
