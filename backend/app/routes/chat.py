from fastapi import APIRouter, Request
from backend.app.gemini import generate_reply

router = APIRouter()

@router.post("")
async def chat(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    reply = await generate_reply(prompt)
    return {"reply":reply}