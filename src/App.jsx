import React, { useEffect, useReducer, memo } from 'react'
import reducer, { reset, actions, action } from './reducer'
import Board from './components/Board'
import Shape from './components/Shape'

function App() {
  const [state, dispatch] = useReducer(reducer, {}, reset)
  function restart() {
    dispatch(action(actions.RESTART))
  }
  function pause() {
    dispatch(action(actions.PAUSE))
  }
  function resume() {
    dispatch(action(actions.RESUME))
  }
  function down() {
    dispatch(action(actions.DOWN))
  }
  function left() {
    dispatch(action(actions.LEFT))
  }
  function right() {
    dispatch(action(actions.RIGHT))
  }
  function rotate() {
    dispatch(action(actions.ROTATE))
  }
  function drop() {
    dispatch(action(actions.DROP))
  }

  useEffect(() => {
    function keyListener(e) {
      if (state.gameOver) {
        if (!e.repeat) {
          restart()
        }
        return
      }
      if (state.gamePaused) {
        if (!e.repeat) {
          resume()
        }
        return
      } else {
        console.log(e)
        switch (e.key) {
          case 'Pause':
            pause()
            break
          case 'ArrowDown':
            down()
            break
          case 'ArrowLeft':
            left()
            break
          case 'ArrowRight':
            right()
            break
          case 'ArrowUp':
            rotate()
            break
          case ' ':
            drop()
            break
          default:
        }
      }
    }

    const timer = setInterval(() => {
      if (state.gameOver || state.gamePaused) {
        return
      }
      down()
    }, 1000)

    document.addEventListener('keydown', keyListener)
    return () => {
      document.removeEventListener('keydown', keyListener)
      clearInterval(timer)
    }
  }, [state])
  return (
    <div className="game">
      {state.gameOver && (
        <div className="gameover" onClick={restart}>
          <div className="message">
            Game is over
            <div className="cta">Click to resume.</div>
          </div>
        </div>
      )}
      {state.gamePaused && (
        <div className="gamepaused" onClick={resume}>
          <div className="message">
            Game is paused.
            <div className="cta">Click to resume.</div>
          </div>
        </div>
      )}
      <Shape shape={state.nextShape} pos="right" />
      <Board
        buffer={state.buffer}
        rows={state.rows}
        cols={state.cols}
        shape={state.currentShape}
      />
      [{state.score}]
    </div>
  )
}
export default memo(App)
