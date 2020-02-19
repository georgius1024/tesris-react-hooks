import React, { useEffect, useReducer, memo } from 'react'
import reducer, { reset, actions, action } from './reducer'
import Board from './components/Board'
import SidePanel from './components/SidePanel'

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
    }, 1000 - state.level * 100)

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
            <p>Game is over</p>
            <p className="score">Your score is {state.score}</p>
            <p className="score">Best score is {state.bestScore}</p>
            <div className="cta">Click to restart.</div>
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
      <div className="central-zone">
        <Board
          buffer={state.buffer}
          rows={state.rows}
          cols={state.cols}
          shape={state.currentShape}
        />
        <SidePanel
          shape={state.nextShape}
          score={state.score}
          level={state.level}
        />
      </div>
    </div>
  )
}
export default memo(App)
