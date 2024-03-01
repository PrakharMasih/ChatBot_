from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    email: str
    username: str

class UserIn(UserSchema):
    password: str

class UserInDBBase(UserSchema):
    id: int

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    hashed_password: str

class GetAns(BaseModel):
    needstr: str

class TokenData(BaseModel):
    username: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str