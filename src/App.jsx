import React, { useState, useEffect, memo } from 'react'
import shapeFactory from './shapes'
import Board from './components/Board'
import Shape from './components/Shape'
import {
  validPlacement,
  moveShape,
  rotateShape,
  flattenShape
} from './placements'

const rows = 16
const cols = 8

function App() {
  const [gamePaused, setGamePaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentShape, setCurrentShape] = useState(shapeFactory(rows, cols))
  const [nextShape, setNextShape] = useState(shapeFactory(rows, cols))
  const [buffer, setBuffer] = useState(new Uint8Array(rows * cols))

  function restart() {
    setCurrentShape(shape => {
      setGameOver(false)
      setBuffer(buffer => {
        return new Uint8Array(rows * cols)
      })
      setNextShape(shapeFactory(rows, cols))
      return shapeFactory(rows, cols)
    })
  }

  function resume() {
    setGamePaused(false)
  }

  useEffect(() => {
    function restart() {
      setCurrentShape(shape => {
        setGameOver(false)
        setBuffer(buffer => {
          return new Uint8Array(rows * cols)
        })
        setNextShape(shapeFactory(rows, cols))
        return shapeFactory(rows, cols)
      })
    }

    function pause() {
      setGamePaused(true)
    }

    function resume() {
      setGamePaused(false)
    }

    function move(dR, dC) {
      setCurrentShape(shape =>
        moveShape(shape, dR, dC, buffer, rows, cols, newShape => fall(newShape))
      )
    }
    function rotate(dir) {
      setCurrentShape(shape =>
        rotateShape(shape, dir, buffer, rows, cols, newShape => fall(newShape))
      )
    }

    function drop() {
      if (!currentShape) {
        return
      }
      while (
        validPlacement(
          currentShape.mask(),
          currentShape.row - 1,
          currentShape.col,
          buffer,
          rows,
          cols
        )
      ) {
        currentShape.row = currentShape.row - 1
      }
      fall(currentShape)
    }

    function fall(shape) {
      setBuffer(buffer => {
        const newBuffer = flattenShape(shape, buffer, rows, cols)
        const candidate = nextShape //shapeFactory(randomFunc(), rows, cols)
        console.error(JSON.stringify(candidate.mask()))
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
          setCurrentShape(candidate)
          setNextShape(shapeFactory(rows, cols))
        } else {
          setCurrentShape()
          setNextShape()
          setGameOver(true)
        }

        return newBuffer
      })
    }

    function keyListener(e) {
      if (gameOver) {
        restart()
        return
      }
      if (gamePaused) {
        resume()
      } else {
        switch (e.key) {
          case 'ArrowRight':
            move(0, 1)
            break
          case 'ArrowLeft':
            move(0, -1)
            break
          case 'ArrowUp':
            rotate(1)
            break
          case 'ArrowDown':
            drop()
            break
          case ' ':
            pause()
            break
          default:
        }
      }
    }
    document.addEventListener('keydown', keyListener)
    const timer = setInterval(() => {
      if (!currentShape || gamePaused || gameOver) {
        return
      }
      if (
        validPlacement(
          currentShape.mask(),
          currentShape.row - 1,
          currentShape.col,
          buffer,
          rows,
          cols
        )
      ) {
        setCurrentShape({ ...currentShape, row: currentShape.row - 1 })
      } else {
        fall(currentShape)
      }
    }, 1200)
    return () => {
      document.removeEventListener('keydown', keyListener)
      clearInterval(timer)
    }
  }, [currentShape, nextShape, buffer, gamePaused, gameOver])

  return (
    <div className="game">
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
      <Shape shape={nextShape} pos="right" />
      <Board buffer={buffer} cols={cols} rows={rows} shape={currentShape} />
    </div>
  )
}

export default memo(App)
