from services.hg_servise import transcribe_audio
from services.srt_gen import generate_srt_from_text   
import os
import uuid

Download = "uploads"

# Create uploads directory if it doesn't exist
if not os.path.exists(Download):
    os.makedirs(Download)


async def process_upload_file(upload_file) -> str:
    """
    Process uploaded audio file: transcribe and generate SRT subtitles.
    
    Args:
        upload_file: FastAPI UploadFile object
        
    Returns:
        str: SRT formatted subtitles
    """
    file_path = None
    try:
        # Extract file extension
        file_extension = upload_file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(Download, unique_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as f:
            content = await upload_file.read()
            f.write(content)
        
        # Transcribe audio to text
        transcribed_text = await transcribe_audio(file_path, upload_file.filename)
        
        # Generate SRT from transcribed text
        srt_content = generate_srt_from_text(transcribed_text)
        
        return srt_content
    
    finally:
        # Clean up: remove uploaded file after processing
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            