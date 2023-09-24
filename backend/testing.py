from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def obtener_cabeceras_autorizacion():
    respuesta = client.post("/login", data={"username": "admin@example.com", "password": "admin"})
    token = respuesta.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_login():
    datos_login = {
        "username": "admin@example.com",
        "password": "admin"
    }
    response = client.post("/login", data=datos_login)
    
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_obtener_usuarios_administrador():
    cabeceras = obtener_cabeceras_autorizacion()

    response = client.get("/usuarios", headers=cabeceras)
    
    assert response.status_code == 200
    assert len(response.json()) > 0  # ¿Se devuelven datos?

def test_obtener_usuarios_normal():
    # Crear un usuario normal
    usuario_prueba = {
        "nombre": "Usuario de Prueba",
        "correo": "usuarioprueba2@example.com",
        "telefono": "1234567890",
        "es_administrador": False,
        "contraseña": "contraseñaprueba2"
    }
    cabeceras = obtener_cabeceras_autorizacion()
    response = client.post("/usuarios/", json=usuario_prueba, headers=cabeceras)
    
    assert response.status_code == 200
    datos_usuario = response.json()
    id_usuario = datos_usuario['id']

    # Iniciar sesión como el usuario normal
    response = client.post("/login", data={"username": "usuarioprueba2@example.com", "password": "contraseñaprueba2"})
    token = response.json()["access_token"]
    cabeceras = {"Authorization": f"Bearer {token}"}

    # Intentar obtener usuarios
    response = client.get("/usuarios", headers=cabeceras)
    
    assert response.status_code == 200
    assert len(response.json()) > 0  # ¿Se devuelven datos?

    # Iniciar sesión como administrador para eliminar el usuario
    cabeceras = obtener_cabeceras_autorizacion()
    response = client.delete(f"/usuarios/{id_usuario}", headers=cabeceras)
    
    assert response.status_code == 200

def test_crear_usuario():
    usuario_prueba = {
        "nombre": "Usuario de Prueba",
        "correo": "usuarioprueba@example.com",
        "telefono": "1234567890",
        "es_administrador": False,
        "contraseña": "contraseñaprueba"
    }
    cabeceras = obtener_cabeceras_autorizacion()
    response = client.post("/usuarios/", json=usuario_prueba, headers=cabeceras)
    
    assert response.status_code == 200
    datos = response.json()
    assert datos["nombre"] == "Usuario de Prueba"

def test_actualizar_usuario():
    usuario_actualizado = {
        "nombre": "Usuario Actualizado",
        "correo": "usuarioactualizado@example.com",
        "telefono": "0987654321",
        "es_administrador": True,
    }
    cabeceras = obtener_cabeceras_autorizacion()
    response = client.put("/usuarios/2", json=usuario_actualizado, headers=cabeceras)
    
    assert response.status_code == 200
    datos = response.json()
    assert datos["nombre"] == "Usuario Actualizado"

def test_eliminar_usuario():
    cabeceras = obtener_cabeceras_autorizacion()
    response = client.delete("/usuarios/2", headers=cabeceras)
    
    assert response.status_code == 200
