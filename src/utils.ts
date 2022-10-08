export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const map = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  clampFlag = true
) => {
  const v = ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin

  return clampFlag ? clamp(v, toMin, toMax) : v
}

let seed = 0

export const seedRandom = (s: number) => {
  seed = s
}

export const random = () => {
  const x = Math.sin(seed) * 10000
  seed += 1

  return x - Math.floor(x)
}
