import { MediaCapture } from './components/MediaCapture'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <button onClick={ipcHandle}>onCLICK</button>
      <MediaCapture />
    </div>
  )
}

export default App
