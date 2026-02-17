from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from google import genai
import asyncio
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"

class Conversation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New Chat"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(BaseModel):
    content: str

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    role: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.get("/")
async def root():
    return {"message": "Chatbot API is running"}

@api_router.post("/conversations", response_model=Conversation)
async def create_conversation(input: ConversationCreate):
    conv_obj = Conversation(title=input.title)
    doc = conv_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.conversations.insert_one(doc)
    return conv_obj

@api_router.get("/conversations", response_model=List[Conversation])
async def get_conversations():
    conversations = await db.conversations.find({}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    for conv in conversations:
        if isinstance(conv['created_at'], str):
            conv['created_at'] = datetime.fromisoformat(conv['created_at'])
        if isinstance(conv['updated_at'], str):
            conv['updated_at'] = datetime.fromisoformat(conv['updated_at'])
    return conversations

@api_router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    result = await db.conversations.delete_one({"id": conversation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    await db.messages.delete_many({"conversation_id": conversation_id})
    return {"message": "Conversation deleted"}

@api_router.get("/conversations/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: str):
    messages = await db.messages.find({"conversation_id": conversation_id}, {"_id": 0}).sort("timestamp", 1).to_list(1000)
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    return messages

@api_router.post("/conversations/{conversation_id}/messages")
async def send_message(conversation_id: str, input: MessageCreate):
    conv = await db.conversations.find_one({"id": conversation_id}, {"_id": 0})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=input.content
    )
    user_doc = user_msg.model_dump()
    user_doc['timestamp'] = user_doc['timestamp'].isoformat()
    await db.messages.insert_one(user_doc)
    
    async def generate_response():
        try:
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                raise HTTPException(status_code=500, detail="API key not configured")
            
            client = genai.Client(api_key=api_key)
            
            messages = await db.messages.find(
                {"conversation_id": conversation_id}, 
                {"_id": 0}
            ).sort("timestamp", 1).to_list(1000)
            
            history = []
            for msg in messages[:-1]:
                history.append({
                    "role": "user" if msg["role"] == "user" else "model",
                    "parts": [{"text": msg["content"]}]
                })
            
            response = client.models.generate_content(
                model='models/gemini-2.5-flash',
                contents=history + [{
                    "role": "user",
                    "parts": [{"text": input.content}]
                }],
                config={
                    "system_instruction": "You are a helpful AI assistant. Provide clear, accurate, and friendly responses.",
                    "temperature": 0.7,
                }
            )
            
            ai_content = response.text
            
            ai_msg = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=ai_content
            )
            ai_doc = ai_msg.model_dump()
            ai_doc['timestamp'] = ai_doc['timestamp'].isoformat()
            await db.messages.insert_one(ai_doc)
            
            conv['updated_at'] = datetime.now(timezone.utc).isoformat()
            if conv['title'] == "New Chat":
                conv['title'] = input.content[:50] + ("..." if len(input.content) > 50 else "")
            await db.conversations.update_one(
                {"id": conversation_id},
                {"$set": {"updated_at": conv['updated_at'], "title": conv['title']}}
            )
            
            yield json.dumps({"type": "message", "data": ai_msg.model_dump(mode='json')}) + "\n"
            
        except Exception as e:
            logging.error(f"Error generating response: {e}")
            yield json.dumps({"type": "error", "data": str(e)}) + "\n"
    
    return StreamingResponse(generate_response(), media_type="application/x-ndjson")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()