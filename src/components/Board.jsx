import React from 'react'
import cn from 'classnames'
function Board({ buffer, rows, cols, shape }) {
  const mask = (shape && shape.mask()) || []
  const getSceneValue = (row, col) => buffer[row * cols + col]
  const getShapeValue = (row, col) => {
    if (!shape) {
      return 0
    }
    if (
      row < shape.row ||
      col < shape.col ||
      row >= shape.row + mask.length ||
      col > shape.col + mask[0].length
    ) {
      return 0
    }
    return mask[row - shape.row][col - shape.col] ? shape.style : -1
  }
  function cell(row, col) {
    const shape = getShapeValue(row, col)
    const scene = getSceneValue(row, col)
    const cellValue = (shape || scene) - 1
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
