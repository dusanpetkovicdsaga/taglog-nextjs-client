import { request as httpsRequest } from 'https'
import { request as httpRequest } from 'http'
import { initConsolLogger } from './consoleLogger'
import {
  ILogRequest,
  ITaglogConfig,
  ITaglogInit,
  ITagLogRequest,
  TagLogInstance
} from './models'

const logMessageType = 'LOG_TYPE_API'

const taglogConfig: ITaglogConfig = {}

const TAGLOG_SERVER_URL = 'https://api.taglog.io/api'

let shouldCaptureConsole: boolean = false

export function taglogInit({
  accessKey,
  defaultChannel,
  serverURL = TAGLOG_SERVER_URL,
  options = { captureConsole: false }
}: ITaglogInit): TagLogInstance {
  taglogConfig[accessKey] = {
    ACCESS_KEY: accessKey,
    DEFAULT_CHANNEL: defaultChannel,
    SERVER_URL: serverURL
  }

  const logInstance: TagLogInstance = {
    captureException,
    captureInfo,
    captureRequest
  }

  if (options.captureConsole) {
    shouldCaptureConsole = options.captureConsole

    initConsolLogger(logInstance)
  }

  return logInstance
}

function getFirstConfig() {
  for (const accessKey in taglogConfig) {
    return accessKey
  }
  return false
}

export function captureException(
  title: string,
  data?: Record<string, any>,
  channel?: string,
  tags?: string[],
  accessKey?: string
): void {
  const detectedAccessKey = accessKey ? accessKey : getFirstConfig()

  if (detectedAccessKey) {
    logRequestBeacon({
      title,
      data,
      type: 'EXCEPTION',
      channel,
      tags,
      accessKey: detectedAccessKey
    })
  } else {
    if (!shouldCaptureConsole)
      console.error('Logging event to taglog.io failed.')
  }
}

export function captureRequest(
  request: ITagLogRequest,
  channel?: string,
  tags?: string[],
  accessKey?: string
): void {
  const detectedAccessKey = accessKey ? accessKey : getFirstConfig()

  if (detectedAccessKey) {
    logRequestBeacon({
      title: request.url,
      data: {
        method: request.method,
        status: request.status,
        duration: request.duration,
        headers: request.headers,
        body: request.body,
        response: request.response
      },
      tags,
      type: 'REQUEST',
      channel,
      accessKey: detectedAccessKey
    })
  } else {
    if (!shouldCaptureConsole)
      console.error('Logging event to taglog.io failed.')
  }
}

export function captureInfo(
  title: string,
  data?: Record<string, any>,
  channel?: string,
  tags?: string[],
  accessKey?: string
): void {
  const detectedAccessKey = accessKey ? accessKey : getFirstConfig()

  if (detectedAccessKey) {
    logRequestBeacon({
      title,
      data,
      type: 'INFO',
      channel,
      tags,
      accessKey: detectedAccessKey
    })
  } else {
    if (!shouldCaptureConsole)
      console.error('Logging event to taglog.io failed.')
  }
}

function logRequestBeacon({
  title,
  data = {},
  type,
  accessKey,
  tags,
  channel
}: ILogRequest & { tags?: string[] }) {
  const postData = JSON.stringify({ title, data, type, tags })

  const isLocalhost = taglogConfig[accessKey].SERVER_URL.includes('localhost')
  const request = isLocalhost ? httpRequest : httpsRequest

  const serverUrl = new URL(taglogConfig[accessKey].SERVER_URL)
  const options = {
    hostname: serverUrl.hostname,
    port: serverUrl.port || 80,
    path: `/api/ingest/${
      channel ? channel : taglogConfig[accessKey].DEFAULT_CHANNEL
    }`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      messageType: logMessageType,
      accessToken: accessKey,
      Accept: 'application/json'
    }
  }

  const req = request(options)

  req.on('error', (e) => {
    if (!shouldCaptureConsole)
      console.error(`problem with request: ${e.message}`)
  })

  // Write data to request body and end the request
  req.write(postData)
  req.end()
}
