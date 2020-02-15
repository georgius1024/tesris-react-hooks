import React, { memo } from 'react'
import cn from 'classnames'
function Shape({ shape, pos }) {
  const mask = (shape && shape.func(0)) || []
  const rows = mask.length
  const cols = mask.length && mask[0].length
  const getShapeValue = (row, col) => {
    return mask[row][col] ? shape.style - 1 : -1
  }
  function cell(row, col) {
    const cellValue = getShapeValue(row, col)
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
    return <div className={cn('shape', pos)}>{list}</div>
  }

  return buildRows()
}

export default memo(Shape)
