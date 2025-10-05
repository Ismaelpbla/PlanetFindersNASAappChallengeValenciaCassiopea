export interface ExoplanetData {
  ticId: string
  sector: number
  probability: number
  period: number
  transitDepth: number
  radius: number
  magnitude: number
  ra: number
  dec: number
  status: "exoplanet" | "candidate" | "false-positive"
  planetType?: "Terrestrial" | "Super Earth" | "Neptune-Like" | "Gas Giant"
  falsePositiveType?:
    | "Eclipsing Binary"
    | "Background Eclipsing Binary"
    | "Grazing Eclipsing Binary"
    | "Instrumental Artifact"
    | "Stellar Variability"
    | "Contamination"
  stellarParameters: {
    teff: number
    logg: number
    feh: number
    radius: number
    mass: number
  }
  gaiaRuwe: number
  spocDvr: {
    dvr: number
    dvrUncertainty: number
    dvrFlag: string
  }
  tce: {
    period: number
    duration: number
    depth: number
  }
  lightCurve: { time: number; flux: number }[]
  phaseDays: { phase: number; flux: number }[]
  phaseHours: { phase: number; flux: number }[]
  features: {
    name: string
    importance: number
  }[]
  analyzedAt: Date
}
