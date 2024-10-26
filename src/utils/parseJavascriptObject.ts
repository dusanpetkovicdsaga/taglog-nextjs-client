export function parseJavascriptObject(object: any, depth = 0, max_depth = 2) {
  // change max_depth to see more levels, for a touch event, 2 is good
  if (depth > max_depth) return 'Object'

  const obj = {}
  for (let key in object) {
    let value = object[key]
    if (value instanceof Node)
      // specify which properties you want to see from the node
      value = { textContent: value.textContent }
    else if (value instanceof Window) value = 'Window'
    else if (value instanceof Object)
      value = parseJavascriptObject(value, depth + 1, max_depth)

    obj[key] = value
  }

  return obj;
}
