export function validPlacement(mask, row, col, buffer, rows, cols) {
  if (
    row < 0 ||
    col < 0 ||
    // row + mask.length > rows ||
    col + mask[0].length > cols
  ) {
    return false
  }
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[0].length; c++) {
      if (mask[r][c] && buffer[(row + r) * cols + col + c]) {
        return false
      }
    }
  }
  return true
}

export function flattenedBuffer(mask, row, col, style, buffer, rows, cols) {
  const result = new Uint8Array(buffer)
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[0].length; c++) {
      if (mask[r][c]) {
        result[(row + r) * cols + col + c] = style
      }
    }
  }
  return result
}

function arrayChunkSplit(buffer, size) {
  const result = []
  for (let offs = 0; offs < buffer.length; offs += size) {
    result.push(buffer.slice(offs, offs + size))
  }
  return result
}

export function countFilledRows(buffer, rows, cols) {
  function isAllFull(buffer) {
    return buffer.every(e => e)
  }
  return arrayChunkSplit(buffer, cols).filter(isAllFull).length
}

export function cleanFilledRows(buffer, rows, cols) {
  function isNotFull(buffer) {
    return buffer.some(e => !e)
  }
  const cleanedRows = arrayChunkSplit(buffer, cols).filter(isNotFull)
  if (cleanedRows.length === rows) {
    return buffer
  } else {
    const result = new Uint8Array(rows * cols)
    cleanedRows.forEach((data, index) => {
      result.set(data, index * cols)
    })
    return result
  }
}
