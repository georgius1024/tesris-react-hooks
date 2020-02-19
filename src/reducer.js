import shapeFactory from './shapes'
import {
  validPlacement,
  flattenedBuffer,
  countFilledRows,
  cleanFilledRows
} from './placements'

const storageKey = 'best-score'

const cols = 10
const rows = 20

export const actions = [
  'INIT',
  'RESTART',
  'PAUSE',
  'RESUME',
  'DOWN',
  'LEFT',
  'RIGHT',
  'DOWN',
  'ROTATE',
  'DROP'
].reduce((list, action) => {
  list[action] = action
  return list
}, {})

export function action(type, ...payload) {
  return {
    type,
    payload
  }
}

function placeCurrentShape(state) {
  const result = { ...state, currentShape: { ...state.currentShape } }
  while (
    !validPlacement(
      result.currentShape.mask(),
      result.currentShape.row,
      result.currentShape.col,
      result.buffer,
      rows,
      cols
    )
  ) {
    result.currentShape.row += 1
    result.gameOver = true
  }
  return result
}

export function reset() {
  const state = {
    cols,
    rows,
    buffer: new Uint8Array(rows * cols),
    currentShape: shapeFactory(rows, cols),
    nextShape: shapeFactory(rows, cols),
    overflow: false,
    gameOver: false,
    gamePaused: false,
    score: 0,
    bestScore: Number(localStorage.getItem(storageKey) || 0),
    level: 0
  }
  return placeCurrentShape(state)
}

function down(current) {
  const state = { ...current }
  if (
    validPlacement(
      state.currentShape.mask(),
      state.currentShape.row - 1,
      state.currentShape.col,
      state.buffer,
      rows,
      cols
    )
  ) {
    state.currentShape = {
      ...state.currentShape,
      row: state.currentShape.row - 1
    }
    return state
  } else {
    // shape has been fallen
    state.buffer = flattenedBuffer(
      state.currentShape.mask(),
      state.currentShape.row,
      state.currentShape.col,
      state.currentShape.style,
      state.buffer,
      rows,
      cols
    )
    const filledRows = countFilledRows(state.buffer, rows, cols)
    if (filledRows) {
      switch (filledRows) {
        default:
        case 1:
          state.score = state.score + 100
          break
        case 2:
          state.score = state.score + 300
          break
        case 3:
          state.score = state.score + 400
          break
        case 4:
          state.score = state.score + 800
          break
      }
      if (state.score > state.bestScore) {
        localStorage.setItem(storageKey, state.score)
        state.bestScore = state.score
      }
      state.level = Math.min(Math.floor(state.score / 500), 9)
      state.buffer = cleanFilledRows(state.buffer, rows, cols)
    }
    state.currentShape = state.nextShape
    state.nextShape = shapeFactory(rows, cols)
    return placeCurrentShape(state)
  }
}
function move(current, dX) {
  const state = { ...current }
  if (
    validPlacement(
      state.currentShape.mask(),
      state.currentShape.row,
      state.currentShape.col + dX,
      state.buffer,
      rows,
      cols
    )
  ) {
    state.currentShape = {
      ...state.currentShape,
      col: state.currentShape.col + dX
    }
    return state
  }
  return state
}

function rotate(current) {
  const state = { ...current }
  const orientation =
    state.currentShape.orientation + 1 >= 0
      ? (state.currentShape.orientation + 1) % 4
      : 3
  let dY = 0
  let dX = 0
  const width = state.currentShape.mask(0).length
  if (width === 3) {
    if ([1, 3].includes(orientation)) {
      dX = -1
    }
    if ([0, 2].includes(orientation)) {
      dX = +1
    }
  }
  if (width === 4) {
    if ([1, 3].includes(orientation)) {
      dX = -1
      dY = +1
    }
    if ([0, 2].includes(orientation)) {
      dX = +1
      dY = -1
    }
  }
  if (
    validPlacement(
      state.currentShape.mask(orientation),
      state.currentShape.row + dY,
      state.currentShape.col + dX,
      state.buffer,
      rows,
      cols
    )
  ) {
    state.currentShape = {
      ...state.currentShape,
      orientation,
      row: state.currentShape.row + dY,
      col: state.currentShape.col + dX
    }
    return state
  }
  return state
}

function drop(current) {
  const state = { ...current }
  while (
    validPlacement(
      state.currentShape.mask(),
      state.currentShape.row - 1,
      state.currentShape.col,
      state.buffer,
      rows,
      cols
    )
  ) {
    state.currentShape = {
      ...state.currentShape,
      row: state.currentShape.row - 1
    }
  }
  return state
}

export default function reducer(state, action) {
  switch (action.type) {
    case actions.INIT:
    case actions.RESTART:
      return reset()
    case actions.PAUSE:
      return { ...state, gamePaused: true }
    case actions.RESUME:
      return { ...state, gamePaused: false }
    case actions.DOWN:
      return down(state)
    case actions.LEFT:
      return move(state, -1)
    case actions.RIGHT:
      return move(state, 1)
    case actions.ROTATE:
      return rotate(state)
    case actions.DROP:
      return drop(state)
    default:
      return state
  }
}
