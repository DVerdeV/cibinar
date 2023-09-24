from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base

# Configura la conexión a la base de datos utilizando SQLite
url_base_datos = "sqlite:///usuarios.db"
engine = create_engine(url_base_datos, connect_args={"check_same_thread": False})

# Crear una sesión para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(250))
    correo = Column(String(250), unique=True, index=True)
    telefono = Column(String(50))
    es_administrador = Column(Boolean, default=False)
    hashed_password = Column(String(100))

# Crear la tabla en la base de datos
Base.metadata.create_all(bind=engine)
