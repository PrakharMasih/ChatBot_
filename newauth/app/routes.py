from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import User, Conversation
import os

from langchain.llms import OpenAI
# from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
# from langchain.chains.question_answering import load_qa_chain

from app import auth, models, schemas, passhash
from app.db import get_db
from ai.prompt import generate_context, qa_template

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

router = APIRouter()


@router.post("/register/", response_model=schemas.UserInDBBase)
async def register(user_in: schemas.UserIn, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, username=user_in.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = passhash.get_password_hash(user_in.password)
    db_user = models.User(**user_in.dict(exclude={"password"}), hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post('/checkauth' )
async def check_auth(current_user: schemas.UserInDBBase = Depends(auth.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=400, detail="Bad request")
    return True


@router.post("/login", response_model=schemas.Token)
async def login_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = auth.get_user(db, username=form_data.username)
    if not user or not passhash.pwd_context.verify(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=passhash.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = passhash.create_access_token(
        data={"user": user.username , "admin" : user.is_admin} ,  expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/conversation/")
async def gen_conversation(
    query: str,
    current_user: schemas.UserInDBBase = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).get(current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    context = generate_context(db_user)
    # print("newknjnjnjknsfd--------->", context)
    llm = OpenAI(
        temperature=0,
        openai_api_key=os.environ.get("OPENAI_API_KEY"),
    )
    prompt = PromptTemplate(
        input_variables=["context", "question"], template=qa_template
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    # print("chain------->", chain)
    response = chain.run(question=query, context=context)
    # print(" response-------->", response)
    new_conversation = models.Conversation(
    user_id=current_user.id,
    query=query,
    response=response
    )
    # print('New con-------------->',new_conversation)
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    return {"response": new_conversation}

@router.get('/conversation/')
async def read_conversation(
    current_user: schemas.UserInDBBase = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).get(current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_conversation = db.query(models.Conversation).filter(models.Conversation.user_id == current_user.id).all()
    # print(db_conversation)
    return db_conversation

@router.get('/alluser')
async def get_alluser(
    current_user: schemas.UserInDBBase = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).get(current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.is_admin == False:
        raise HTTPException(status_code=400, detail="Not Admin")
    db_user = db.query(models.User).all()
    if db_user == []:
        raise HTTPException(status_code=404, detail="No user found")
    
    
    return db_user