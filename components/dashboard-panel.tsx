"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import type { ExoplanetData } from "@/types/exoplanet"
import { Telescope, Globe, Orbit, Sparkles, AlertCircle } from "lucide-react"

interface DashboardPanelProps {
  starId: string | null
  data?: ExoplanetData
}

export function DashboardPanel({ starId, data }: DashboardPanelProps) {
  if (!starId || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground text-lg">Select a star from the analysis table to view details</p>
      </div>
    )
  }

  const getStatusColor = (probability: number) => {
    if (probability > 0.99) return "bg-emerald-500"
    if (probability >= 0.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusText = (probability: number) => {
    if (probability > 0.99) return "Validated Exoplanet"
    if (probability >= 0.5) return "Candidate"
    return "False Positive"
  }

  const getStarImage = (probability: number) => {
    if (probability > 0.99) return "/star-field.webp" // Exoplanet
    if (probability >= 0.5) return "/star-candidate.webp" // Candidate
    return "/star-false-positive.webp" // False Positive
  }

  const getPlanetImage = (type: string) => {
    const imageMap: Record<string, string> = {
      Terrestrial: "/earth-planet-blue-marble.jpg",
      "Super Earth": "/super-earth-rocky-planet.jpg",
      "Neptune-Like": "/neptune-ice-giant-blue-planet.jpg",
      "Gas Giant": "/saturn-gas-giant-rings.jpg",
    }
    return imageMap[type] || "/serene-blue-planet.png"
  }

  const statusColor = getStatusColor(data.probability)
  const statusText = getStatusText(data.probability)
  const starImage = getStarImage(data.probability)

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8 lg:col-span-1">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Telescope className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            Target Star
          </h3>
          <div className="relative aspect-square bg-black rounded-2xl overflow-hidden border-2 border-primary/20">
            <img src={starImage || "/placeholder.svg"} alt="Star field" className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 md:mt-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">{data.ticId}</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Sector {data.sector}</p>
          </div>
        </Card>

        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8 lg:col-span-2">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            Detection Status
          </h3>
          <div className="space-y-6 md:space-y-8">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <span className="text-lg md:text-xl font-semibold">Classification</span>
                <span
                  className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-bold ${statusColor} text-white shadow-lg text-center`}
                >
                  {statusText}
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <span className="text-lg md:text-xl font-semibold">ExoMiner Probability</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {(data.probability * 100).toFixed(2)}%
                </span>
              </div>
              <div className="h-5 md:h-6 bg-secondary rounded-full overflow-hidden border-2 border-primary/20">
                <div
                  className={`h-full ${statusColor} rounded-full transition-all shadow-lg`}
                  style={{ width: `${data.probability * 100}%` }}
                />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-3 leading-relaxed">
                {data.probability > 0.99
                  ? "High confidence - validated exoplanet"
                  : data.probability >= 0.5
                    ? "Moderate confidence - requires follow-up observations"
                    : "Low confidence - likely false positive"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {(data.planetType || data.falsePositiveType) && (
        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            {data.planetType ? (
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            ) : (
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            )}
            {data.planetType ? "Planet Classification" : "False Positive Type"}
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0">
              {data.planetType ? (
                <img
                  src={getPlanetImage(data.planetType) || "/placeholder.svg"}
                  alt={data.planetType}
                  className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-2xl"
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-red-500/50" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-bold text-primary mb-3 md:mb-4">
                {data.planetType || data.falsePositiveType}
              </h4>
              {data.planetType && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {data.planetType === "Terrestrial" &&
                    "Rocky planet similar to Earth, with a solid surface and potential for habitability."}
                  {data.planetType === "Super Earth" &&
                    "Larger than Earth but smaller than Neptune, with a rocky composition and thick atmosphere."}
                  {data.planetType === "Neptune-Like" &&
                    "Ice giant with a thick atmosphere of hydrogen and helium, similar to Neptune."}
                  {data.planetType === "Gas Giant" &&
                    "Large planet composed mainly of hydrogen and helium, similar to Jupiter or Saturn."}
                </p>
              )}
              {data.falsePositiveType && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {data.falsePositiveType === "Eclipsing Binary" &&
                    "A stellar system where one star eclipses another, creating a light dip that mimics a planetary transit."}
                  {data.falsePositiveType === "Background Eclipsing Binary" &&
                    "Background eclipsing binaries within the same telescope pixel, generating an apparent transit on the target star."}
                  {data.falsePositiveType === "Grazing Eclipsing Binary" &&
                    "Eclipsing binaries that don't fully overlap, causing a partial transit resembling a small planetary transit."}
                  {data.falsePositiveType === "Instrumental Artifact" &&
                    "Detector noise, telescope fluctuations, or calibration errors generating dips in the light curve."}
                  {data.falsePositiveType === "Stellar Variability" &&
                    "Stellar phenomena like starspots or pulsations producing periodic light decreases."}
                  {data.falsePositiveType === "Contamination" &&
                    "Real planetary transit on a nearby star projected onto the target star's light curve."}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Telescope className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          Stellar Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Effective Temperature</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.stellarParameters.teff.toFixed(5)} K</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Surface Gravity (log g)</div>
            <div className="text-xl md:text-2xl font-bold text-primary">
               {data.stellarParameters.logg.toFixed(5)}
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Metallicity (Fe/H)</div>
            <div className="text-xl md:text-2xl font-bold text-primary">
              {data.stellarParameters.feh.toFixed(5)}
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Stellar Radius</div>
            <div className="text-xl md:text-2xl font-bold text-primary">
              {data.stellarParameters.radius.toFixed(5)} R☉
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Stellar Mass</div>
            <div className="text-xl md:text-2xl font-bold text-primary">
              {data.stellarParameters.mass.toFixed(5)} M☉
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Right Ascension</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.ra.toFixed(5)}°</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Declination</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.dec.toFixed(5)}°</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Magnitude</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.magnitude.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Gaia RUWE</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.gaiaRuwe.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">SPOC DVR</div>
            <div className="text-xl md:text-2xl font-bold text-primary">{data.spocDvr.dvr.toFixed(5)}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          Planet Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Orbital Period</div>
            <div className="text-xl md:text-2xl font-bold text-accent">{data.tce.period.toFixed(5)} days</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Transit Duration</div>
            <div className="text-xl md:text-2xl font-bold text-accent">{data.tce.duration.toFixed(5)} hours</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Transit Depth</div>
            <div className="text-xl md:text-2xl font-bold text-accent">{(data.tce.depth * 100).toFixed(5)}%</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Planet Radius</div>
            <div className="text-xl md:text-2xl font-bold text-accent">{data.radius.toFixed(5)} R⊕</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Orbit className="w-5 h-5 md:w-6 md:h-6 text-chart-3" />
            Light Curve - Phase (Days)
          </h3>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <LineChart data={data.phaseDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="phase"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 10 }}
                label={{ value: "Phase (days)", position: "insideBottom", offset: -5, fill: "#999", fontSize: 12 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#999", fontSize: 10 }}
                domain={[0.985, 1.005]}
                label={{ value: "Relative Flux", angle: -90, position: "insideLeft", fill: "#999", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="flux" stroke="#3b82f6" strokeWidth={1} dot={{ fill: "#3b82f6", r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Orbit className="w-5 h-5 md:w-6 md:h-6 text-chart-3" />
            Light Curve - Phase (Hours)
          </h3>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <LineChart data={data.phaseHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="phase"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 10 }}
                label={{ value: "Phase (hours)", position: "insideBottom", offset: -5, fill: "#999", fontSize: 12 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#999", fontSize: 10 }}
                domain={[0.985, 1.005]}
                label={{ value: "Relative Flux", angle: -90, position: "insideLeft", fill: "#999", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="flux" stroke="#3b82f6" strokeWidth={1} dot={{ fill: "#3b82f6", r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Model Explainability</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
          Feature importance scores from the ExoMiner neural network model
        </p>
        <div className="space-y-4 md:space-y-6">
          {data.features.map((feature) => (
            <div key={feature.name}>
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="text-base md:text-lg font-semibold">{feature.name}</span>
                <span className="text-sm md:text-base text-muted-foreground font-mono font-bold">
                  {(feature.importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-8 md:h-10 bg-secondary rounded-full overflow-hidden border-2 border-primary/20">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all shadow-lg"
                  style={{ width: `${feature.importance * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
