from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from db import SessionLocal, Usuario, engine
from schemas import UsuarioCrear, UsuarioActualizar, UsuarioSalida
from auth import hashear_contraseña, verificar_contraseña, crear_token_acceso, obtener_usuario_actual, es_administrador
from db_session import obtener_db

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
def inicio_sesion(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(obtener_db)):
    db_usuario = db.query(Usuario).filter(Usuario.correo == form_data.username).first()
    if not db_usuario:
        raise HTTPException(status_code=400, detail="Nombre de usuario o contraseña incorrectos")
    if not verificar_contraseña(form_data.password, db_usuario.hashed_password):
        raise HTTPException(status_code=400, detail="Nombre de usuario o contraseña incorrectos")

    access_token = crear_token_acceso(db_usuario.correo)
    return {"access_token": access_token, "token_type": "bearer", "nombre": db_usuario.nombre, "es_administrador": db_usuario.es_administrador}


@app.get("/admin", response_model=bool)
def comprobar_admin(db: Session = Depends(obtener_db), current_user: Usuario = Depends(es_administrador)):
    return True

@app.get("/usuarios", response_model=List[UsuarioSalida])
def obtener_todos_los_usuarios(db: Session = Depends(obtener_db), current_user: Usuario = Depends(obtener_usuario_actual)):
    usuarios = db.query(Usuario).all()
    return usuarios

@app.post("/usuarios", response_model=UsuarioSalida)
def crear_usuario(usuario: UsuarioCrear, db: Session = Depends(obtener_db), current_user: Usuario = Depends(es_administrador)):
    hashed_password = hashear_contraseña(usuario.contraseña)
    db_usuario = Usuario(nombre=usuario.nombre, correo=usuario.correo, telefono=usuario.telefono, es_administrador=usuario.es_administrador, hashed_password=hashed_password)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario


@app.get("/usuarios/{usuario_id}", response_model=UsuarioSalida)
def obtener_usuario(usuario_id: int, db: Session = Depends(obtener_db), current_user: Usuario = Depends(obtener_usuario_actual)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@app.put("/usuarios/{usuario_id}", response_model=UsuarioSalida)
def actualizar_usuario(usuario_id: int, usuario: UsuarioActualizar, db: Session = Depends(obtener_db), current_user: Usuario = Depends(es_administrador)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for var, value in vars(usuario).items():
        if value is not None:
            setattr(db_usuario, var, value)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(obtener_db), current_user: Usuario = Depends(es_administrador)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(db_usuario)
    db.commit()
    return {"message": "Usuario eliminado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
