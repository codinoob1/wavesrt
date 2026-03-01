import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const BrtConv = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [conversionData, setConversionData] = useState({
    fileName: 'sample-audio.mp3',
    duration: '00:03:45',
    fileSize: '4.2 MB',
    status: 'success',
    srtContent: `1
00:00:00,000 --> 00:00:05,000
Welcome to the SRT conversion tool

2
00:00:05,500 --> 00:00:12,300
This is a sample subtitle entry

3
00:00:12,800 --> 00:00:18,500
You can see how the timestamps work

4
00:00:19,000 --> 00:00:24,000
This is the fourth subtitle entry`,
  })

  const [expandedPreview, setExpandedPreview] = useState(false)

  // Load conversion data from session storage or location state
  useEffect(() => {
    // Try to get data from location state first
    if (location.state?.conversionResult) {
      setConversionData(location.state.conversionResult)
      return
    }

    // Try to get data from sessionStorage
    const storedData = sessionStorage.getItem('conversionResult')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setConversionData(parsedData)
        // Clear sessionStorage after using
        sessionStorage.removeItem('conversionResult')
      } catch (error) {
        console.error('Failed to parse conversion data:', error)
      }
    }
  }, [location])

  // Format file size
  const formatFileSize = (sizeInMB) => {
    const size = parseFloat(sizeInMB)
    if (size > 1024) {
      return `${(size / 1024).toFixed(2)} GB`
    }
    return `${size.toFixed(2)} MB`
  }

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(conversionData.srtContent)
      toast.success('SRT content copied to clipboard!', {
        position: 'top-right',
      })
    } catch (err) {
      toast.error('Failed to copy to clipboard', { position: 'top-right' })
    }
  }

  // Download SRT file
  const handleDownloadSRT = () => {
    try {
      const element = document.createElement('a')
      const file = new Blob([conversionData.srtContent], {
        type: 'text/plain',
      })
      element.href = URL.createObjectURL(file)
      element.download = `${conversionData.fileName.split('.')[0]}.srt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success('SRT file downloaded successfully!', {
        position: 'top-right',
      })
    } catch (err) {
      toast.error('Failed to download file', { position: 'top-right' })
    }
  }

  // Convert another file
  const handleConvertAnother = () => {
    navigate('/upload')
  }

  // Get preview lines (first 4 entries)
  const getPreviewLines = () => {
    const lines = conversionData.srtContent.split('\n')
    const previewLines = []
    let entryCount = 0
    let i = 0

    while (i < lines.length && entryCount < 4) {
      // Check if line is a number (subtitle index)
      if (/^\d+$/.test(lines[i].trim())) {
        const entry = []
        entry.push(lines[i])
        entry.push(lines[i + 1])
        entry.push(lines[i + 2])
        previewLines.push(...entry)
        previewLines.push('') // Blank line between entries
        entryCount++
        i += 4
      } else {
        i++
      }
    }

    return previewLines.join('\n').trim()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Conversion Result
          </h1>
          <p className="text-gray-600 text-lg">
            Your audio file has been successfully converted to SRT format
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Original Audio Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 1 1 0 100 2H6a6 6 0 016 6v3a3 3 0 01-3 3H7a1 1 0 100 2h6a1 1 0 100-2h-1a3 3 0 01-3-3v-3a6 6 0 016-6h.5a1 1 0 000-2A2 2 0 0116 5v5a3 3 0 01-3 3H9a3 3 0 01-3-3V5z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Original Audio Info
              </h2>
            </div>

            {/* File Details */}
            <div className="space-y-4 mb-6">
              {/* File Name */}
              <div className="flex justify-between items-start">
                <span className="text-gray-600">File Name</span>
                <span className="text-gray-900 font-medium text-right truncate ml-4">
                  {conversionData.fileName}
                </span>
              </div>

              {/* Duration */}
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900 font-medium">
                  {conversionData.duration}
                </span>
              </div>

              {/* File Size */}
              <div className="flex justify-between items-start">
                <span className="text-gray-600">File Size</span>
                <span className="text-gray-900 font-medium">
                  {formatFileSize(conversionData.fileSize)}
                </span>
              </div>
            </div>

            {/* Status Box */}
            <div
              className={`flex items-center gap-3 p-3 rounded-xl ${
                conversionData.status === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {conversionData.status === 'success' ? (
                <>
                  <svg
                    className="w-5 h-5 text-green-700 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Conversion Successful
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 text-red-700 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">
                    Conversion Failed. Please try again.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Generated SRT Preview Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2V4z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Generated SRT Preview
              </h2>
            </div>

            {/* Code Block */}
            <div className="bg-gray-900 rounded-xl p-4 mb-4 overflow-auto max-h-80 font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap">
              {getPreviewLines()}
            </div>

            {/* Preview Note */}
            <p className="text-center text-gray-500 text-xs mb-4">
              Preview shows first 4 subtitle entries
            </p>

            {/* Preview Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                Copy
              </button>
              <button
                onClick={() => setExpandedPreview(!expandedPreview)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Expand
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDownloadSRT}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
            </svg>
            Download SRT
          </button>
          <button
            onClick={handleConvertAnother}
            className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 5.199V4a1 1 0 01-1-1zm5 9a1 1 0 011 1v.01a1 1 0 11-2 0V12a1 1 0 011-1zm0-4a1 1 0 011 1v.01a1 1 0 11-2 0V8a1 1 0 011-1zm3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zM2 17a1 1 0 011-1h12.101A7.002 7.002 0 014.399 14.434a1 1 0 11-.399 1.968A5.002 5.002 0 002.001 16.4V17a1 1 0 01-1 1z"
                clipRule="evenodd"
              />
            </svg>
            Convert Another File
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrtConv
