import React, { useState, useEffect } from 'react'
import * as shapes from './shapes'
const W = 8
const H = 12

function randomFunc() {
  const funcs = Object.values(shapes)
  return funcs[Math.floor(Math.random() * funcs.length)]
}

function nextFunc(current) {
  const funcs = Object.values(shapes)
  const idx = funcs.indexOf(current)
  if (idx === -1 || idx === funcs.length - 1) {
    return funcs[0]
  } else {
    return funcs[idx + 1]
  }
}

function newShape(func, rows, cols) {
  const data = func(0)
  const height = data.length
  const width = data[0].length
  return {
    col: Math.floor((cols - width) / 2),
    row: rows - height,
    orientation: 0,
    func,
    mask() {
      return this.func(
        arguments.length === 0 ? this.orientation : arguments[0]
      ).reverse()
    }
  }
}

function validPlacement(mask, row, col, buffer, rows, cols) {
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

function moveShape(shape, dR, dC, buffer, rows, cols, onFall) {
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

function rotateShape(shape, dir, buffer, rows, cols, onFall) {
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

function changeShape(current, rows, cols) {
  return newShape(nextFunc(current.func), rows, cols)
}

function flattenShape(shape, buffer, rows, cols) {
  if (!shape) {
    return buffer
  }

  const result = new Uint8Array(buffer)
  const mask = shape.mask()
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[0].length; c++) {
      if (mask[r][c]) {
        result[(shape.row + r) * cols + shape.col + c] = mask[r][c]
      }
    }
  }
  return cleanRows(result, rows, cols)
}

function cleanRows(buffer, rows, cols) {
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

function App() {
  const [gamePaused, setGamePaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [shape, setShape] = useState(newShape(randomFunc(), H, W))
  const [buffer, setBuffer] = useState(new Uint8Array(W * H))
  const [rows, setRows] = useState(H)
  const [cols, setCols] = useState(W)

  const getSceneValue = (row, col) => buffer[row * cols + col]
  const setDimentions = (rows, cols) => {
    setRows(rows)
    setCols(cols)
    setBuffer(new Uint8Array(rows * cols))
  }
  const getShapeValue = (row, col) => {
    if (!shape) {
      return 0
    }
    const mask = shape.mask()
    if (row < shape.row || col < shape.col || row >= shape.row + mask.length) {
      return 0
    }
    return mask[row - shape.row][col - shape.col] || 0
  }
  const setCellValue = (row, col, value) => {
    const result = new Uint8Array(buffer)
    result[row * cols + col] = value
    setBuffer(cleanRows(result, rows, cols))
  }
  const addRow = () => setDimentions(rows + 1, cols)
  const addCol = () => setDimentions(rows, cols + 1)
  const removeRow = () => setDimentions(rows - 1, cols)
  const removeCol = () => setDimentions(rows, cols - 1)

  function restart() {
    setShape(shape => {
      setGameOver(false)
      setBuffer(buffer => {
        return new Uint8Array(rows * cols)
      })
      return newShape(randomFunc(), H, W)
    })
  }

  function pause() {
    setGamePaused(true)
  }

  function resume() {
    setGamePaused(false)
  }

  useEffect(() => {
    function move(dR, dC) {
      setShape(shape =>
        moveShape(shape, dR, dC, buffer, rows, cols, newShape => fall(newShape))
      )
    }
    function rotate(dir) {
      setShape(shape =>
        rotateShape(shape, dir, buffer, rows, cols, newShape => fall(newShape))
      )
    }
    function change() {
      setShape(shape => changeShape(shape, rows, cols))
    }

    function drop() {
      if (!shape) {
        return
      }
      while (
        validPlacement(
          shape.mask(),
          shape.row - 1,
          shape.col,
          buffer,
          rows,
          cols
        )
      ) {
        shape.row = shape.row - 1
      }
      fall(shape)
    }

    function fall(shape) {
      setBuffer(buffer => {
        const newBuffer = flattenShape(shape, buffer, rows, cols)
        const candidate = newShape(randomFunc(), rows, cols)
        if (
          validPlacement(
            candidate.mask(),
            candidate.row,
            candidate.col,
            newBuffer,
            rows,
            cols
          )
        ) {
          setShape(candidate)
        } else {
          setShape()
          setGameOver(true)
        }

        return newBuffer
      })
    }

    function keyListener(e) {
      switch (e.key) {
        case 'ArrowRight':
          move(0, 1)
          break
        case 'ArrowLeft':
          move(0, -1)
          break
        case 'ArrowUp':
          move(1, 0)
          break
        case 'ArrowDown':
          move(-1, 0)
          break
        case '+':
          rotate(1)
          break
        case '-':
          rotate(-1)
          break
        case '*':
          change()
          break
        case ' ':
          drop()
          break
        default:
      }
    }
    document.addEventListener('keydown', keyListener)
    const timer = setInterval(() => {
      if (!shape || gamePaused || gameOver) {
        return
      }
      if (
        validPlacement(
          shape.mask(),
          shape.row - 1,
          shape.col,
          buffer,
          rows,
          cols
        )
      ) {
        setShape({ ...shape, row: shape.row - 1 })
      } else {
        fall(shape)
      }
    }, 1000)
    return () => {
      document.removeEventListener('keydown', keyListener)
      clearInterval(timer)
    }
  }, [shape, cols, rows, buffer, gamePaused])

  function cell(row, col) {
    const isScene = getSceneValue(row, col)
    const isShape = getShapeValue(row, col)
    const displayValue = isShape ? '▆' : isScene ? '●' : '·'
    function handler() {
      setTimeout(() => {
        if (!gamePaused && !gameOver) {
          setCellValue(row, col, 1 - isScene)
        }
      }, 100)
    }
    return (
      <div className="cell" key={col} onClick={handler}>
        {displayValue}
      </div>
    )
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
    return <div className="rows">{list}</div>
  }

  return (
    <div className="board">
      {gameOver && (
        <div className="gameover" onClick={restart}>
          <div className="message">
            Game is over
            <div className="cta">Click to resume.</div>
          </div>
        </div>
      )}
      {gamePaused && (
        <div className="gamepaused" onClick={resume}>
          <div className="message">
            Game is paused.
            <div className="cta">Click to resume.</div>
          </div>
        </div>
      )}
      <div className="display">
        {rows} x {cols}
      </div>
      {buildRows()}
      <div>
        <button onClick={pause}>▌▌</button>
        <button onClick={addRow}>+ row</button>
        <button onClick={removeRow} disabled={rows === 1}>
          - row
        </button>
      </div>
      <div>
        <button onClick={addCol}>+ col</button>
        <button onClick={removeCol} disabled={cols === 1}>
          - col
        </button>
      </div>
      {shape && (
        <div className="display">
          {shape.row} x {shape.col} * {shape.orientation}
        </div>
      )}
    </div>
  )
}

export default App
