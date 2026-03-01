from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#importing routes here from Routes.transcribe import router as transcribe_router
from Routes.transcribe import router as transcribe_router

app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app Routes
app.include_router(transcribe_router)



@app.get("/")
async def root():
    return {"message": "Hello World"}