from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.gemini import get_gemini_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers= ["*"],
)

@app.post("/chat")
async def chat(request:Request):
    data= await request.json()
    prompt = data.get("prompt","")
    reply = await get_gemini_response(prompt)
    print(reply,"reply")
    return {"reply":reply}