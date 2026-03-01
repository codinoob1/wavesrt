import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Upload = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
  }

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File "${file.name}" exceeds 50MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        { position: 'top-right' }
      )
      return false
    }
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(validateFile)

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added`, {
        position: 'top-right',
      })
    }
  }

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = selectedFiles.filter(validateFile)

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added`, {
        position: 'top-right',
      })
    }
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    toast.info('File removed', { position: 'top-right' })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning('Please select files to upload', {
        position: 'top-right',
      })
      return
    }

    setUploading(true)

    // Process only the first file
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()

      // Prepare conversion result data
      const conversionResult = {
        fileName: data.fileName,
        duration: data.duration || '00:00:00',
        fileSize: data.fileSize,
        status: 'success',
        srtContent: data.srtContent,
      }

      // Store in sessionStorage as backup
      sessionStorage.setItem('conversionResult', JSON.stringify(conversionResult))

      toast.success('✅ File uploaded and converted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })

      // Redirect to srtConv page with data
      navigate('/convert', { state: { conversionResult } })
      
      // Reset form
      setFiles([])
      setUploadProgress({})
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-right',
      })
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const getTotalSize = () => {
    return files.reduce((sum, file) => sum + file.size, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl sm:max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Upload Files
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Upload SRT files for conversion</p>
        </div>

        {/* Main Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center bg-white hover:border-blue-400 transition-colors shadow-sm"
        >
          <div className="mb-4">
            <svg
              className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-4m0 0V8m0 4h4m-4 0H8M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Drag and drop your files
          </h3>
          <p className="text-gray-600 mb-4">or</p>

          <label className="inline-block">
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors">
              Browse Files
            </span>
            <input
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept=".srt,.mp4,.mov,.avi,.m4a,.mp3"
            />
          </label>

          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            Maximum file size: 50MB per file
          </p>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Files to Upload ({files.length})
            </h2>

            <div className="space-y-3 mb-6">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                          {file.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {uploadProgress[index] !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-300"
                          style={{
                            width: `${uploadProgress[index]}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {!uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="Remove file"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Size</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {(getTotalSize() / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row w-full sm:w-auto">
                <button
                  onClick={() => setFiles([])}
                  disabled={uploading}
                  className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                      </svg>
                      <span>Upload Files</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && !uploading && (
          <div className="mt-8 sm:mt-12 text-center text-gray-500 text-sm sm:text-base">
            <p>No files selected. Drag files here or click Browse to start.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload
