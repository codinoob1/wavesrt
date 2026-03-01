import os
import mimetypes
import requests
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load environment variables
load_dotenv()

# Get API key
HF_API_KEY = os.environ.get("HF_TOKEN")
client = InferenceClient(
    provider="hf-inference",
    api_key=os.environ["HF_TOKEN"],
)

async def transcribe_audio(file_path: str, filename: str) -> str:
    """
    Transcribe audio file using OpenAI Whisper model via HuggingFace API
    
    Args:
        file_path (str): Path to the audio file to transcribe
        filename (str): Original filename to detect MIME type
        
    Returns:
        str: Transcribed text from the audio file
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        Exception: If transcription fails
    """
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")
        
        # Detect MIME type from filename
        mime_type, _ = mimetypes.guess_type(filename)
        
        # Map mp4 audio to m4a
        if mime_type == "audio/mp4":
            mime_type = "audio/m4a"
        
        # Default to wav if MIME type detection fails
        if not mime_type:
            mime_type = "audio/wav"
        
        # Read audio file
        with open(file_path, "rb") as audio_file:
            audio_data = audio_file.read()
        
        # Call the Whisper model via HuggingFace API with correct content type
        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": mime_type
        }
        
        # Use requests to send with proper headers
        response = client.automatic_speech_recognition(file_path, model="openai/whisper-large-v3")
        
       
        
       
        
        # Extract text from result
        transcribe_audio = response.text if response and "text" in response else ""
        print(f"Transcription result: {transcribe_audio}")
        return transcribe_audio
    
    except FileNotFoundError as e:
        raise e
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")