import { createStore } from 'redux'
import { createAction, createReducer, assignAll } from 'redux-act'

const setDimentions = createAction('Set board dimentions', (...args) =>
  Array.from(args)
)
const clearFullRows = createAction('Clear full rows')
const setCellValue = createAction('Set cell value', (...args) =>
  Array.from(args)
)

const initialState = {
  buffer: new Uint8Array(0),
  shape: {
    kind: '',
    rotation: 0,
    color: 0,
    col: 0,
    row: 0
  },
  rows: 0,
  cols: 0
}

function replaced(buffer, offs, value) {
  const result = new Uint8Array(buffer)
  result[offs] = value
  return result
}

function arrayChunkSplit(buffer, size) {
  const result = []
  for (let offs = 0; offs < buffer.length; offs += size) {
    result.push(buffer.slice(offs, offs + size))
  }
  return result
}

function scanFullRows(buffer, rows, cols) {
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

const boardReducer = createReducer(
  {
    [setDimentions]: (state, payload) => ({
      ...state,
      buffer: new Uint8Array(payload[0] * payload[1]),
      rows: payload[0],
      cols: payload[1]
    }),
    [setCellValue]: (state, payload) => ({
      ...state,
      buffer: replaced(
        state.buffer,
        payload[0] * state.cols + payload[1],
        payload[2]
      )
    }),
    [clearFullRows]: state => ({
      ...state,
      buffer: scanFullRows(state.buffer, state.rows, state.cols)
    })
  },
  initialState
)

const store = createStore(
  boardReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

assignAll([setDimentions, setCellValue, clearFullRows], store)

export { setDimentions, setCellValue, clearFullRows }
export default store
