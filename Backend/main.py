from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes.transcribe import router as transcribe_router
from services.file_Hanlder import process_upload_file

app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# App Routes
app.include_router(transcribe_router)


@app.get("/")
async def root():
    
    return {"message": "Hello World"}
