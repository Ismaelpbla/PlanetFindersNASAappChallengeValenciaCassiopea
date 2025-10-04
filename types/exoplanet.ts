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
  planetType?: "Terrestre" | "Super Tierra" | "Tipo Neptuno" | "Gigante Gaseoso"
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
  foldedPhase: { phase: number; flux: number }[]
  features: {
    name: string
    importance: number
  }[]
  analyzedAt: Date
}
