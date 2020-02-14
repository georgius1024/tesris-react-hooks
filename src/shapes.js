export function L1(orientation) {
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

export function L2(orientation) {
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

export function S1(orientation) {
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

export function S2(orientation) {
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
        [1, 1]
      ]
    default:
  }
}

export function box(orientation) {
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

export function E(orientation) {
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
