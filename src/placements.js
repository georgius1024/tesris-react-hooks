export function validPlacement(mask, row, col, buffer, rows, cols) {
  if (
    row < 0 ||
    col < 0 ||
    row + mask.length > rows ||
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

export function moveShape(shape, dR, dC, buffer, rows, cols, onFall) {
  if (
    shape &&
    validPlacement(
      shape.mask(),
      shape.row + dR,
      shape.col + dC,
      buffer,
      rows,
      cols
    )
  ) {
    const newShape = {
      ...shape,
      row: shape.row + dR,
      col: shape.col + dC
    }
    if (onFall) {
      if (
        !validPlacement(
          newShape.mask(),
          newShape.row - 1,
          newShape.col,
          buffer,
          rows,
          cols
        )
      ) {
        onFall(newShape)
      }
    }
    return newShape
  } else {
    return shape
  }
}

export function rotateShape(shape, dir, buffer, rows, cols, onFall) {
  if (!shape) {
    return shape
  }
  const orientation =
    shape.orientation + dir >= 0 ? (shape.orientation + dir) % 4 : 3
  let dR = 0
  let dC = 0
  if (shape.mask(0).length === 3) {
    if ([1, 3].includes(orientation)) {
      dC = -1
    }
    if ([0, 2].includes(orientation)) {
      dC = +1
    }
  }
  if (shape.mask(0).length === 4) {
    if ([1, 3].includes(orientation)) {
      dC = -1
      dR = +1
    }
    if ([0, 2].includes(orientation)) {
      dC = +1
      dR = -1
    }
  }
  if (
    validPlacement(
      shape.mask(orientation),
      shape.row + dR,
      shape.col + dC,
      buffer,
      rows,
      cols
    )
  ) {
    const newShape = {
      ...shape,
      row: shape.row + dR,
      col: shape.col + dC,
      orientation
    }
    if (onFall) {
      if (
        !validPlacement(
          newShape.mask(),
          newShape.row - 1,
          newShape.col,
          buffer,
          rows,
          cols
        )
      ) {
        onFall()
      }
    }
    return newShape
  } else {
    return shape
  }
}

export function flattenShape(shape, buffer, rows, cols) {
  if (!shape) {
    return buffer
  }

  const result = new Uint8Array(buffer)
  const mask = shape.mask()
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[0].length; c++) {
      if (mask[r][c]) {
        result[(shape.row + r) * cols + shape.col + c] = shape.style
      }
    }
  }
  return cleanRows(result, rows, cols)
}

export function cleanRows(buffer, rows, cols) {
  function arrayChunkSplit(buffer, size) {
    const result = []
    for (let offs = 0; offs < buffer.length; offs += size) {
      result.push(buffer.slice(offs, offs + size))
    }
    return result
  }
  function isNotFull(buffer) {
    return buffer.some(e => !e)
  }
  const cleanRows = arrayChunkSplit(buffer, cols).filter(isNotFull)
  if (cleanRows.length === rows) {
    return buffer
  } else {
    const result = new Uint8Array(rows * cols)
    cleanRows.forEach((data, index) => {
      result.set(data, index * cols)
    })
    return result
  }
}
