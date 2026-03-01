from datetime import timedelta


def format_timestamp(seconds: float) -> str:
    """
    Converts seconds to SRT timestamp format (HH:MM:SS,mmm).
    Ensures precise millisecond rounding for perfect timestamp synchronization.
    """
    # Handle negative or zero values
    if seconds < 0:
        seconds = 0
    
    # Use timedelta for accurate time conversion
    td = timedelta(seconds=seconds)
    total_seconds = int(td.total_seconds())
    
    # Calculate hours, minutes, seconds, and milliseconds
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    
    # Calculate milliseconds with proper rounding
    milliseconds = round((seconds - total_seconds) * 1000) % 1000
    
    # Handle edge case where rounding causes milliseconds to overflow
    if milliseconds < 0:
        milliseconds = 0
    elif milliseconds >= 1000:
        milliseconds = 999
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{milliseconds:03d}"


def generate_srt_from_text(
    text: str, 
    total_audio_duration: float = 60.0,
    min_duration: float = 0.5,
    sentence_delimiter: str = ". "
) -> str:
    """
    Generates SRT from plain text with improved timestamp precision.
    
    Args:
        text: Plain text to convert to SRT subtitles
        total_audio_duration: Total duration of audio in seconds
        min_duration: Minimum duration for each subtitle (default: 0.5 seconds)
        sentence_delimiter: Delimiter to split sentences (default: ". ")
    
    Returns:
        Formatted SRT subtitle string
    """
    if not text or not text.strip():
        return ""
    
    # Split text into sentences, preserving the text properly
    sentences = [s.strip() for s in text.split(sentence_delimiter) if s.strip()]
    
    if not sentences:
        return ""
    
    num_sentences = len(sentences)
    duration_per_sentence = total_audio_duration / num_sentences
    
    # Ensure each subtitle has minimum duration
    if duration_per_sentence < min_duration:
        duration_per_sentence = min_duration
    
    srt_output = ""
    current_time = 0.0
    
    for index, sentence in enumerate(sentences, start=1):
        start_time = current_time
        end_time = current_time + duration_per_sentence
        
        # Ensure end_time doesn't exceed total duration
        if end_time > total_audio_duration:
            end_time = total_audio_duration
        
        srt_output += f"{index}\n"
        srt_output += f"{format_timestamp(start_time)} --> {format_timestamp(end_time)}\n"
        srt_output += f"{sentence}\n\n"
        
        current_time = end_time
        
        # Stop if we've reached the end of audio duration
        if current_time >= total_audio_duration:
            break
    
    return srt_output


def generate_srt_from_timed_segments(segments: list) -> str:
    """
    Generates SRT from pre-timed segments for precise control over timestamps.
    
    Args:
        segments: List of dicts with 'text', 'start', and 'end' keys
                  Example: [
                      {'text': 'Hello world', 'start': 0.0, 'end': 2.5},
                      {'text': 'How are you?', 'start': 2.5, 'end': 4.8}
                  ]
    
    Returns:
        Formatted SRT subtitle string
    """
    if not segments:
        return ""
    
    srt_output = ""
    
    for index, segment in enumerate(segments, start=1):
        try:
            text = segment.get('text', '').strip()
            start = float(segment.get('start', 0))
            end = float(segment.get('end', 0))
            
            if not text or start < 0 or end <= start:
                continue
            
            srt_output += f"{index}\n"
            srt_output += f"{format_timestamp(start)} --> {format_timestamp(end)}\n"
            srt_output += f"{text}\n\n"
        except (ValueError, KeyError, TypeError):
            continue
    
    return srt_output