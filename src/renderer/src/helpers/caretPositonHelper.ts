export default function caretPositionHelper(e) {
  let range
  let textNode
  let offset

  if (document.caretPositionFromPoint) {
    range = document.caretPositionFromPoint(e.clientX, e.clientY)
    textNode = range.offsetNode
    offset = range.offset
  } else if (document.caretRangeFromPoint) {
    // Use WebKit-proprietary fallback method
    range = document.caretRangeFromPoint(e.clientX, e.clientY)
    textNode = range.startContainer
    offset = range.startOffset
  } else {
    // Neither method is supported, do nothing
    return
  }
  console.log('range: ', range, ' textNode: ', textNode, ', Offset: ', offset)
  return { range, textNode, offset }
}
