let canvas: OffscreenCanvas

const DEBUG = m => console.log(`[worker] ${m}`)

interface Point {
  x: number
  y: number
}

let lastPoint: Point | undefined

const initCanvas = ({ canvas: _canvas, boundingRect, devicePixelRatio }: {
  canvas: OffscreenCanvas
  boundingRect: {
    width: number
    height: number
  }
  devicePixelRatio: number
}): void => {
  canvas = _canvas
  const context = canvas.getContext('2d')

  // increase the actual size of our canvas
  canvas.width = boundingRect.width * devicePixelRatio;
  canvas.height = boundingRect.height * devicePixelRatio;

  // ensure all drawing operations are scaled
  context.scale(devicePixelRatio, devicePixelRatio);
}

self.onmessage = ({ data }: MessageEvent) => {
  switch (data?.type) {
    case 'init': {
      initCanvas(data)

      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(1, 'blue');
      ctx.strokeStyle = gradient;

      break
    }

    case 'move': {
      const ctx = canvas?.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(lastPoint?.x, lastPoint?.y)
      ctx.lineTo(data.position.x, data.position.y)
      ctx.closePath()
      ctx.stroke()

      lastPoint = data.position
      break
    }
  }
}
