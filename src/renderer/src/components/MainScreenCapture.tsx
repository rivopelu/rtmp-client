import { useRef, useState } from 'react'

export function MainScreenCapture() {
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const mediaRecorderRef = useRef<any>(null)
  const chunks = useRef<any>([])

  const startRecording = async () => {
    try {
      // Request the screen stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // Optional: if you also want to record system audio
      })

      // Create a MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })

      mediaRecorderRef.current = mediaRecorder

      // Collect video data
      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data)
      }

      // When recording stops, generate a video URL
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' })
        chunks.current = [] // Clear the chunks
        setVideoUrl(URL.createObjectURL(blob))
      }

      mediaRecorder.start() // Start recording
      setRecording(true)
    } catch (error) {
      console.error('Error accessing screen: ', error)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div>
      <h1>Screen Recorder</h1>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {videoUrl && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoUrl} controls width="600" />
          <a href={videoUrl} download="recording.webm">
            Download Video
          </a>
        </div>
      )}
    </div>
  )
}
