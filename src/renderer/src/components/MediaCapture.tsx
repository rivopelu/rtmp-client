import { useRef, useState } from 'react'

export function MediaCapture() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)
  const videoRef = useRef<any>(null)
  const mediaRecorderRef = useRef<any>(null)
  const chunks = useRef<any>([])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Enable camera
        audio: true // Set to true to capture microphone
      })

      // Attach the camera feed to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })

      mediaRecorderRef.current = mediaRecorder

      // Collect video data
      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data)
      }
    } catch (error: any) {
      console.error(error)
      setErrorMessage('Error accessing camera: ' + error?.message)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsCameraActive(false)
  }

  return (
    <div>
      <h1>Media Capture</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <video ref={videoRef} autoPlay muted style={{ width: '600px', border: '1px solid black' }} />
      <div>
        {isCameraActive ? (
          <button onClick={stopCamera}>Stop Camera</button>
        ) : (
          <button onClick={startCamera}>Start Camera</button>
        )}
      </div>
    </div>
  )
}
