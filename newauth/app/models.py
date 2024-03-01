from sqlalchemy import Column
from sqlalchemy import Integer, String, ForeignKey, Boolean

from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True) 
    user_id = Column(Integer, ForeignKey('users.id'))
    query = Column(String)
    response = Column(String)
