export function J(orientation) {
  switch (orientation) {
    case 0:
      return [
        [1, 0],
        [1, 0],
        [1, 1]
      ]
    case 1:
      return [
        [1, 1, 1],
        [1, 0, 0]
      ]
    case 2:
      return [
        [1, 1],
        [0, 1],
        [0, 1]
      ]
    case 3:
      return [
        [0, 0, 1],
        [1, 1, 1]
      ]
    default:
  }
}

export function L(orientation) {
  switch (orientation) {
    case 0:
      return [
        [1, 1],
        [1, 0],
        [1, 0]
      ]
    case 1:
      return [
        [1, 1, 1],
        [0, 0, 1]
      ]
    case 2:
      return [
        [0, 1],
        [0, 1],
        [1, 1]
      ]
    case 3:
      return [
        [1, 0, 0],
        [1, 1, 1]
      ]
    default:
  }
}

export function Z(orientation) {
  switch (orientation) {
    case 0:
    case 2:
      return [
        [1, 0],
        [1, 1],
        [0, 1]
      ]
    case 1:
    case 3:
      return [
        [0, 1, 1],
        [1, 1, 0]
      ]
    default:
  }
}

export function S(orientation) {
  switch (orientation) {
    case 0:
    case 2:
      return [
        [0, 1],
        [1, 1],
        [1, 0]
      ]
    case 1:
    case 3:
      return [
        [1, 1, 0],
        [0, 1, 1]
      ]
    default:
  }
}

export function O() {
  return [
    [1, 1],
    [1, 1]
  ]
}

export function I(orientation) {
  switch (orientation) {
    case 0:
    case 2:
      return [[1], [1], [1], [1]]
    case 1:
    case 3:
      return [[1, 1, 1, 1]]
    default:
  }
}

export function T(orientation) {
  switch (orientation) {
    case 0:
      return [
        [1, 0],
        [1, 1],
        [1, 0]
      ]
    case 1:
      return [
        [1, 1, 1],
        [0, 1, 0]
      ]
    case 2:
      return [
        [0, 1],
        [1, 1],
        [0, 1]
      ]
    case 3:
      return [
        [0, 1, 0],
        [1, 1, 1]
      ]
    default:
  }
}

function randomFunc() {
  const funcs = Object.values([J, L, Z, S, O, I, T])
  return funcs[Math.floor(Math.random() * funcs.length)]
}

export default function shapeFactory(rows, cols) {
  const func = randomFunc()
  const data = func(0)
  const height = data.length
  const width = data[0].length
  return {
    col: Math.floor((cols - width) / 2),
    row: rows - height,
    style:
      Math.floor(Math.random() * 4) * 16 + Math.floor(Math.random() * 7) + 1,
    orientation: 0,
    func,
    mask() {
      return this.func(arguments.length === 0 ? this.orientation : arguments[0])
    }
  }
}
