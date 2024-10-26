export type ITaglogConfig = {
  [accessKey: string]: {
    SERVER_URL: string
    ACCESS_KEY: string
    DEFAULT_CHANNEL: string
  }
}
export type ILogRequest = {
  title: string
  data?: Record<string, any>
  type: 'EXCEPTION' | 'WARNING' | 'INFO' | 'REQUEST'
  channel?: string
  accessKey: string
}
export interface ITagLogRequest {
  method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE'
  url: string
  status: number
  duration?: number
  headers?: Record<string, string>
  body?: Record<string, any>
  response?: Record<string, any>
}

export interface ITaglogInit {
  accessKey: string
  defaultChannel: string
  serverURL?: string
  options?: {
    captureConsole?: boolean
  }
}

export interface TagLogInstance {
  captureException(
    title: string,
    data?: Record<string, any>,
    channel?: string,
    tags?: string[]
  ): void
  captureInfo(
    title: string,
    data?: Record<string, any>,
    channel?: string,
    tags?: string[]
  ): void
  captureRequest(
    request: ITagLogRequest,
    channel?: string,
    tags?: string[]
  ): void
}
