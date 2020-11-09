import React, { FC, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

const CanvasContainer: FC = () => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>();
  const workerRef = useRef<Worker>(new Worker('./worker.ts'));

  useEffect(() => {
    if (canvasRef) {
      const rect = canvasRef.getBoundingClientRect()

      // scale everything down using CSS
      canvasRef.style.width = rect.width + 'px';
      canvasRef.style.height = rect.height + 'px';

      const offscreen = canvasRef.transferControlToOffscreen();

      workerRef.current.postMessage(
        {
          type: "init",
          canvas: offscreen,
          boundingRect: {
            width: rect.width,
            height: rect.height,
          },
          devicePixelRatio,
        },
        [offscreen]
      )

      const createMouseHandler = (type: string) =>
        (e: MouseEvent) => workerRef.current.postMessage({
          type,
          position: {
            x: e.offsetX,
            y: e.offsetY
          }
        })

      const onMouseMove = createMouseHandler('move')
      canvasRef.addEventListener('mousemove', onMouseMove)

      return () => {
        canvasRef.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [workerRef, canvasRef])

  return (
    <canvas style={{ width: '100%', height: '100%' }} ref={c => setCanvasRef(c)} />
  )
}

ReactDOM.render(
  <CanvasContainer />,
  document.getElementById('root'),
)
