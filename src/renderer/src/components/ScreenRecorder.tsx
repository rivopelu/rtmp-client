import { useEffect, useRef, useState } from 'react'

export function ScreenRecorder() {
  const videoRef = useRef<any>(null)
  const [streaming, setStreaming] = useState(false)

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Set the video source to the camera stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setStreaming(true)
    } catch (error) {
      console.error('Error accessing camera: ', error)
    }
  }

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject
    if (stream) {
      // Stop all tracks (turn off the camera)
      stream.getTracks().forEach((track) => track.stop())
    }

    setStreaming(false)
  }

  useEffect(() => {
    // Cleanup when the component unmounts
    return () => stopVideo()
  }, [])

  return (
    <div>
      <h1>Real-Time Video</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '600px', border: '1px solid black' }}
      />
      <div style={{ marginTop: '10px' }}>
        {streaming ? (
          <button onClick={stopVideo}>Stop Video</button>
        ) : (
          <button onClick={startVideo}>Start Video</button>
        )}
      </div>
    </div>
  )
}
