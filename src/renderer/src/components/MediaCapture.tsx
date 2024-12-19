import { useRef, useState } from 'react'

export function MediaCapture() {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)
  const videoRef = useRef<any>(null)
  const mediaRecorderRef = useRef<any>(null)
  const chunks = useRef<any>([])

  const ipcLiveTest = (): void => window.electron.ipcRenderer.send('ping')

  const startLiveStream = async () => {
    try {
      // Step 1: Capture the screen
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1080 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      })

      // Attach the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Step 2: Stream to RTMP using FFmpeg

      // ffmpeg.stderr.on('data', (data) => {
      //   console.error(`FFmpeg stderr: ${data}`)
      // })

      // ffmpeg.on('close', (code) => {
      //   console.log(`FFmpeg process exited with code ${code}`)
      // })

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })

      // mediaRecorder.ondataavailable = (event) => {
      //   if (event.data && event.data.size > 0) {
      //     ffmpeg.stdin.write(event.data)
      //   }
      // }

      mediaRecorder.start(100) // Send data every 100ms
    } catch (error) {
      console.error('Error starting live stream:', error)
    }
  }

  const startCamera = async () => {
    ipcLiveTest()
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
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
    // if (ffmpeg) {
    //   ffmpeg.stdin.end() // Close the input stream
    //   ffmpeg.kill('SIGINT') // Send the signal to stop the process
    // }
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
          <button onClick={ipcLiveTest}>Start Camera</button>
        )}
      </div>
    </div>
  )
}
