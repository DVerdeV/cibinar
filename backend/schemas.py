from typing import List, Optional
from pydantic import BaseModel

class UsuarioBase(BaseModel):
    nombre: str
    correo: str
    telefono: str
    es_administrador: Optional[bool] = False

class UsuarioCrear(UsuarioBase):
    contraseña: str

class UsuarioActualizar(UsuarioBase):
    pass

class UsuarioSalida(UsuarioBase):
    id: int

    class Config:
        from_attributes = True
