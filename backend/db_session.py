from db import SessionLocal

# Función para obtener una instancia de la base de datos
def obtener_db():
    """
    Esta función se encarga de la apertura y el cierre de una sesión de base de datos. 
    Cuando se llama, inicialmente crea una sesión y la devuelve.
    Una vez se termina de usar la sesión, el código después del 'yield' se ejecuta.
    Esto asegura que las sesiones de la base de datos se cierren correctamente después de su uso.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
