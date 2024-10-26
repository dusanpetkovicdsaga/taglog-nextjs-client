type CaptureFunction = (
  title: string,
  data?: Record<string, any>,
  channel?: string
) => void

export function initConsolLogger({
  captureInfo,
  captureException
}: {
  captureInfo: CaptureFunction
  captureException: CaptureFunction
}) {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  }

  console.log = function (title: string, ...rest: any[]) {
    captureInfo(title, { data: rest })
    originalConsole.log.apply(console, [title, ...rest])
  }

  console.error = function (title: string, ...rest: any[]) {
    captureException(title, { data: rest })
    originalConsole.error.apply(console, [title, ...rest])
  }

  console.warn = function (title: string, ...rest: any[]) {
    captureException(title, { data: rest })
    originalConsole.warn.apply(console, [title, ...rest])
  }

  console.info = function (title: string, ...rest: any[]) {
    captureInfo(title, { data: rest })
    originalConsole.info.apply(console, [title, ...rest])
  }
}
