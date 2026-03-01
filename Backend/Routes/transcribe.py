#fetch files here 
from fastapi import APIRouter, File, UploadFile, HTTPException
import os
from datetime import datetime
from services.file_Hanlder import process_upload_file

#post request for uploading file
router = APIRouter()

ALLOWED_EXTENSIONS = {"mp3", "wav", "mp4", "m4a", "mov", "avi"}

@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload an audio/video file, transcribe it, and generate SRT subtitles.
    Returns the SRT content with file metadata.
    """
    # Validate file type
    file_ext = file.filename.split('.')[-1].lower()
    
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Only {', '.join(ALLOWED_EXTENSIONS)} are allowed."
        )
    
    try:
        # Process file: transcribe and generate SRT
        srt_content = await process_upload_file(file)
        
        # Get file size in MB
        file_size = file.size / (1024 * 1024) if file.size else 0
        
        return {
            "status": "success",
            "message": "File uploaded, transcribed, and SRT generated successfully",
            "fileName": file.filename,
            "fileSize": f"{file_size:.2f}",
            "srtContent": srt_content,
            "duration": "00:00:00"  # You can calculate actual duration if needed
        }
    
    except Exception as e:
        error_msg = str(e)
        print(f"Error processing file: {error_msg}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing file: {error_msg}"
        )