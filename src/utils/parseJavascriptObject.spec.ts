import { parseJavascriptObject } from './parseJavascriptObject'

describe('parseJavascriptObject()', () => {
  it.skip('should stringify object', () => {
    const stringObj = parseJavascriptObject({ test1: 'test1value' })

    expect(stringObj).toBe('{"test1":"test1value"}')
  })
})
