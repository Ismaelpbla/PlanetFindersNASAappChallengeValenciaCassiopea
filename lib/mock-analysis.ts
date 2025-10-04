import type { ExoplanetData } from "@/types/exoplanet"

// Simula el análisis de una estrella con ExoMiner
export async function analyzeStarWithExoMiner(ticId: string, sector: number): Promise<ExoplanetData> {
  // Simular delay de análisis
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generar datos simulados basados en el TIC ID
  const seed = Number.parseInt(ticId.replace(/\D/g, "")) || Math.random() * 10000

  const rand = Math.random()
  let probability: number

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

  let status: ExoplanetData["status"]
  if (probability > 0.99) status = "exoplanet"
  else if (probability >= 0.5) status = "candidate"
  else status = "false-positive"

  let planetType: ExoplanetData["planetType"] | undefined
  const radius = 0.8 + Math.random() * 12 // Extended range for different planet types

  if (status === "exoplanet") {
    if (radius < 1.5) {
      planetType = "Terrestre"
    } else if (radius < 2.5) {
      planetType = "Super Tierra"
    } else if (radius < 6) {
      planetType = "Tipo Neptuno"
    } else {
      planetType = "Gigante Gaseoso"
    }
  }

  // Generar curva de luz simulada
  const lightCurve = Array.from({ length: 100 }, (_, i) => ({
    time: i,
    flux: 100 + Math.sin(i / 10 + seed) * 2 + (Math.random() - 0.5) * 0.5 - (i > 40 && i < 50 ? 3 : 0),
  }))

  // Generar fase plegada
  const foldedPhase = Array.from({ length: 50 }, (_, i) => ({
    phase: i / 25,
    flux: 100 + Math.sin(i / 5) * 2 - (i > 20 && i < 30 ? 3 : 0),
  }))

  // Features de importancia
  const features = [
    { name: "Profundidad del tránsito", importance: 0.35 + Math.random() * 0.15 },
    { name: "Duración", importance: 0.25 + Math.random() * 0.1 },
    { name: "Diferencia par/impar", importance: 0.15 + Math.random() * 0.1 },
    { name: "Desplazamiento centroide", importance: 0.1 + Math.random() * 0.05 },
    { name: "Forma del tránsito", importance: 0.08 + Math.random() * 0.05 },
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
    stellarParameters,
    gaiaRuwe,
    spocDvr,
    tce,
    lightCurve,
    foldedPhase,
    features,
    analyzedAt: new Date(),
  }
}
