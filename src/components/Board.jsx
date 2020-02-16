import React from 'react'
import cn from 'classnames'
import { flattenedBuffer } from '../placements'

function Board({ buffer, rows, cols, shape }) {
  let flattened
  if (shape) {
    flattened = flattenedBuffer(
      shape.mask(),
      shape.row,
      shape.col,
      shape.style,
      buffer,
      rows,
      cols
    )
  } else {
    flattened = buffer
  }
  function cell(row, col) {
    const cellValue = flattened[row * cols + col] - 1
    let className = cn('cell', 'default')
    if (cellValue >= 0) {
      const color = cellValue % 16 || 0
      const fill = cellValue >>> 4 || 0
      className = cn('cell', 'color-' + color, 'fill-' + fill)
    }
    return <div className={className} key={col + 'x' + row} />
  }
  function buildRow(row) {
    const cells = []
    for (let col = 0; col < cols; col++) {
      cells.push(cell(row, col))
    }
    return (
      <div className="row" key={row}>
        {cells}
      </div>
    )
  }
  function buildRows() {
    const list = []
    for (let row = 0; row < rows; row++) {
      list.unshift(buildRow(row))
    }
    return <div className="board">{list}</div>
  }

  return buildRows()
}

export default Board
