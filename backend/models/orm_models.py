from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, ARRAY, JSON
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    phone = Column(String(20))
    role = Column(String(20), default="artist")
    created_at = Column(TIMESTAMP)
    profile_image_url = Column(Text)
    city = Column(String)
    specialties = Column(ARRAY(String))
    profile_url = Column(Text)
    gallery_images = Column(JSON)

    # Relaciones
    appointments = relationship("Appointment", back_populates="user")
    portfolio = relationship("Portfolio", back_populates="user")
    assistant_messages = relationship("AssistantMessage", back_populates="user")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(20))
    email = Column(String(120), unique=True, index=True)
    phone = Column(String(20))
    city = Column(String(100))
    birthdate = Column(String(20))
    # Preferencias y respuestas del formulario completo
    preferences = Column(JSON)  # Guarda todas las respuestas adicionales como JSON
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relaciones
    appointments = relationship("Appointment", back_populates="client")
    portfolio = relationship("Portfolio", back_populates="client")
    visits = relationship("ClientVisit", back_populates="client")
    assistant_messages = relationship("AssistantMessage", back_populates="client")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    date = Column(TIMESTAMP, nullable=False)
    duration = Column(Integer)
    status = Column(String(20), default="scheduled")
    notes = Column(Text)

    client = relationship("Client", back_populates="appointments")
    user = relationship("User", back_populates="appointments")
    visit = relationship("ClientVisit", back_populates="appointment", uselist=False)

class Portfolio(Base):
    __tablename__ = "portfolio"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="SET NULL"))
    image_url = Column(Text, nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP)

    user = relationship("User", back_populates="portfolio")
    client = relationship("Client", back_populates="portfolio")
    tags = relationship("PortfolioTag", back_populates="portfolio")

class PortfolioTag(Base):
    __tablename__ = "portfolio_tags"
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolio.id", ondelete="CASCADE"))
    tag = Column(String(50), nullable=False)

    portfolio = relationship("Portfolio", back_populates="tags")

class ClientVisit(Base):
    __tablename__ = "client_visits"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"))
    visit_date = Column(TIMESTAMP, nullable=False)

    client = relationship("Client", back_populates="visits")
    appointment = relationship("Appointment", back_populates="visit")

class AssistantMessage(Base):
    __tablename__ = "assistant_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="SET NULL"))
    message = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP)

    user = relationship("User", back_populates="assistant_messages")
    client = relationship("Client", back_populates="assistant_messages")