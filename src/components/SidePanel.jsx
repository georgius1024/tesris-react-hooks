import React, { memo } from 'react'
import Shape from './Shape'

function SidePanel({ shape, score, level }) {
  return (
    <aside className="side-panel">
      <div className="score">Current score is: {score}</div>
      <div className="level">Current Level is: {level + 1}</div>
      <Shape shape={shape} />
    </aside>
  )
}

export default memo(SidePanel)
