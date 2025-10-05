import type { ExoplanetData } from "@/types/exoplanet"

// Simula el análisis de una estrella con ExoMiner
export async function analyzeStarWithExoMiner(
  ticId: string,
  sector: number,
  devOptions?: {
    status?: "exoplanet" | "candidate" | "false-positive"
    planetType?: "Terrestrial" | "Super Earth" | "Neptune-Like" | "Gas Giant"
    falsePositiveType?:
      | "Eclipsing Binary"
      | "Background Eclipsing Binary"
      | "Grazing Eclipsing Binary"
      | "Instrumental Artifact"
      | "Stellar Variability"
      | "Contamination"
  },
): Promise<ExoplanetData> {
  // Simular delay de análisis
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generar datos simulados basados en el TIC ID
  const seed = Number.parseInt(ticId.replace(/\D/g, "")) || Math.random() * 10000

  let probability: number
  let status: ExoplanetData["status"]
  let planetType: ExoplanetData["planetType"] | undefined
  let falsePositiveType: ExoplanetData["falsePositiveType"] | undefined

  if (devOptions?.status) {
    // Developer mode: use specified values
    status = devOptions.status
    planetType = devOptions.planetType
    falsePositiveType = devOptions.falsePositiveType

    // Set probability based on status
    if (status === "exoplanet") {
      probability = 0.99 + Math.random() * 0.01
    } else if (status === "candidate") {
      probability = 0.5 + Math.random() * 0.49
    } else {
      probability = Math.random() * 0.49
    }
  } else {
    // Normal mode: random generation
    const rand = Math.random()

    if (rand < 0.33) {
      // False positive: 0.00-0.49
      probability = Math.random() * 0.49
    } else if (rand < 0.66) {
      // Candidate: 0.50-0.99
      probability = 0.5 + Math.random() * 0.49
    } else {
      // Exoplanet: > 0.99
      probability = 0.99 + Math.random() * 0.01
    }

    if (probability > 0.99) status = "exoplanet"
    else if (probability >= 0.5) status = "candidate"
    else status = "false-positive"

    if (status === "exoplanet") {
      const radius = 0.8 + Math.random() * 12 // Extended range for different planet types

      if (radius < 1.5) {
        planetType = "Terrestrial"
      } else if (radius < 2.5) {
        planetType = "Super Earth"
      } else if (radius < 6) {
        planetType = "Neptune-Like"
      } else {
        planetType = "Gas Giant"
      }
    } else if (status === "false-positive") {
      const fpTypes: ExoplanetData["falsePositiveType"][] = [
        "Eclipsing Binary",
        "Background Eclipsing Binary",
        "Grazing Eclipsing Binary",
        "Instrumental Artifact",
        "Stellar Variability",
        "Contamination",
      ]
      falsePositiveType = fpTypes[Math.floor(Math.random() * fpTypes.length)]
    }
  }

  let radius: number
  if (planetType === "Terrestrial") {
    radius = 0.8 + Math.random() * 0.7 // 0.8-1.5
  } else if (planetType === "Super Earth") {
    radius = 1.5 + Math.random() * 1.0 // 1.5-2.5
  } else if (planetType === "Neptune-Like") {
    radius = 2.5 + Math.random() * 3.5 // 2.5-6.0
  } else if (planetType === "Gas Giant") {
    radius = 6.0 + Math.random() * 6.0 // 6.0-12.0
  } else {
    radius = 0.8 + Math.random() * 12
  }

  // Generar curva de luz simulada
  const lightCurve = Array.from({ length: 100 }, (_, i) => ({
    time: i,
    flux: 100 + Math.sin(i / 10 + seed) * 2 + (Math.random() - 0.5) * 0.5 - (i > 40 && i < 50 ? 3 : 0),
  }))

  const phaseDays = Array.from({ length: 100 }, (_, i) => ({
    phase: (i / 100) * 2 - 1, // -1 to 1 phase
    flux: 1.0 + (Math.random() - 0.5) * 0.002 - (Math.abs(i - 50) < 10 ? 0.01 : 0),
  }))

  const phaseHours = Array.from({ length: 80 }, (_, i) => ({
    phase: (i / 80) * 10 - 5, // -5 to 5 hours around transit
    flux: 1.0 + (Math.random() - 0.5) * 0.002 - (Math.abs(i - 40) < 8 ? 0.01 : 0),
  }))

  // Features de importancia
  const features = [
    { name: "Transit Depth", importance: 0.35 + Math.random() * 0.15 },
    { name: "Duration", importance: 0.25 + Math.random() * 0.1 },
    { name: "Odd/Even Difference", importance: 0.15 + Math.random() * 0.1 },
    { name: "Centroid Offset", importance: 0.1 + Math.random() * 0.05 },
    { name: "Transit Shape", importance: 0.08 + Math.random() * 0.05 },
  ].sort((a, b) => b.importance - a.importance)

  const stellarParameters = {
    teff: 4000 + Math.random() * 4000, // 4000-8000K
    logg: 3.5 + Math.random() * 2, // 3.5-5.5
    feh: -0.5 + Math.random() * 1, // -0.5 to 0.5
    radius: 0.5 + Math.random() * 2, // 0.5-2.5 solar radii
    mass: 0.5 + Math.random() * 1.5, // 0.5-2.0 solar masses
  }

  const gaiaRuwe = 0.8 + Math.random() * 0.8 // 0.8-1.6

  const spocDvr = {
    dvr: 0.85 + Math.random() * 0.14, // 0.85-0.99
    dvrUncertainty: 0.01 + Math.random() * 0.04, // 0.01-0.05
    dvrFlag: Math.random() > 0.2 ? "PASS" : "WARN",
  }

  const period = 2 + Math.random() * 10
  const tce = {
    period: period,
    duration: 0.1 + Math.random() * 0.3, // 0.1-0.4 hours
    depth: 0.005 + Math.random() * 0.02, // 0.5-2.5%
  }

  return {
    ticId: `TIC ${ticId}`,
    sector,
    probability,
    period,
    transitDepth: 0.5 + Math.random() * 2,
    radius,
    magnitude: 10 + Math.random() * 5,
    ra: Math.random() * 360,
    dec: (Math.random() - 0.5) * 180,
    status,
    planetType,
    falsePositiveType,
    stellarParameters,
    gaiaRuwe,
    spocDvr,
    tce,
    lightCurve,
    phaseDays,
    phaseHours,
    features,
    analyzedAt: new Date(),
  }
}
