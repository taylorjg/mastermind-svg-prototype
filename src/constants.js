import * as U from './utils'

export const C = {
  R: '#FF0000',
  G: '#00FF00',
  B: '#0000FF',
  Y: '#FFFF00',
  BL: '#000000',
  WH: '#FFFFFF'
}

export const COLOURS = Object.values(C)

export const P = {
  R: 'R',
  G: 'G',
  B: 'B',
  Y: 'Y',
  BL: 'BL',
  WH: 'WH'
}

export const ALL_PEGS = Object.values(P)

export const ALL_CODES =
  Array.from(function* () {
    for (const p0 of ALL_PEGS)
      for (const p1 of ALL_PEGS)
        for (const p2 of ALL_PEGS)
          for (const p3 of ALL_PEGS)
            yield [p0, p1, p2, p3]
  }())

export const ALL_SCORES =
  Array.from(function* () {
    for (const blacks of U.range(5))
      for (const whites of U.range(5))
        yield { blacks, whites }
  }())
    .filter(fb => fb.blacks + fb.whites <= 4)
    .filter(fb => !(fb.blacks === 3 && fb.whites === 1))

export const INITIAL_GUESS = [P.R, P.R, P.G, P.G]

export const PEG_TO_COLOUR = {
  [P.R]: C.R,
  [P.G]: C.G,
  [P.B]: C.B,
  [P.Y]: C.Y,
  [P.BL]: C.BL,
  [P.WH]: C.WH,
}

export const COLOUR_TO_PEG = {
  [C.R]: P.R,
  [C.G]: P.G,
  [C.B]: P.B,
  [C.Y]: P.Y,
  [C.BL]: P.BL,
  [C.WH]: P.WH,
}
