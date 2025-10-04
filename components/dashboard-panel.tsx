"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { ExoplanetData } from "@/types/exoplanet"
import { Telescope, Globe, Orbit, Sparkles } from "lucide-react"

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

  const statusColor = getStatusColor(data.probability)
  const statusText = getStatusText(data.probability)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8 lg:col-span-1">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Telescope className="w-6 h-6 text-primary" />
            Target Star
          </h3>
          <div className="relative aspect-square bg-black rounded-2xl overflow-hidden border-2 border-primary/20">
            <img src="/star-field.webp" alt="Star field" className="w-full h-full object-cover" />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-3xl font-bold">{data.ticId}</h2>
            <p className="text-base text-muted-foreground mt-1">Sector {data.sector}</p>
          </div>
        </Card>

        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8 lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" />
            Detection Status
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-semibold">Classification</span>
                <span className={`px-6 py-2 rounded-full text-base font-bold ${statusColor} text-white shadow-lg`}>
                  {statusText}
                </span>
              </div>
              {data.planetType && (
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-semibold">Planet Type</span>
                  <span className="text-2xl font-bold text-primary">{data.planetType}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-semibold">ExoMiner Probability</span>
                <span className="text-4xl font-bold text-primary">{(data.probability * 100).toFixed(2)}%</span>
              </div>
              <div className="h-6 bg-secondary rounded-full overflow-hidden border-2 border-primary/20">
                <div
                  className={`h-full ${statusColor} rounded-full transition-all shadow-lg`}
                  style={{ width: `${data.probability * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
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

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Telescope className="w-6 h-6 text-primary" />
          Stellar Parameters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Effective Temperature</div>
            <div className="text-2xl font-bold text-primary">{data.stellarParameters.teff.toFixed(5)} K</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Surface Gravity</div>
            <div className="text-2xl font-bold text-primary">log g = {data.stellarParameters.logg.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Metallicity</div>
            <div className="text-2xl font-bold text-primary">[Fe/H] = {data.stellarParameters.feh.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Stellar Radius</div>
            <div className="text-2xl font-bold text-primary">{data.stellarParameters.radius.toFixed(5)} R☉</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Stellar Mass</div>
            <div className="text-2xl font-bold text-primary">{data.stellarParameters.mass.toFixed(5)} M☉</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Right Ascension</div>
            <div className="text-2xl font-bold text-primary">{data.ra.toFixed(5)}°</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Declination</div>
            <div className="text-2xl font-bold text-primary">{data.dec.toFixed(5)}°</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Magnitude</div>
            <div className="text-2xl font-bold text-primary">{data.magnitude.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Gaia RUWE</div>
            <div className="text-2xl font-bold text-primary">{data.gaiaRuwe.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">SPOC DVR</div>
            <div className="text-2xl font-bold text-primary">{data.spocDvr.dvr.toFixed(5)}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6 text-accent" />
          Planet Parameters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Orbital Period</div>
            <div className="text-2xl font-bold text-accent">{data.tce.period.toFixed(5)} days</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Transit Duration</div>
            <div className="text-2xl font-bold text-accent">{data.tce.duration.toFixed(5)} hours</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Transit Depth</div>
            <div className="text-2xl font-bold text-accent">{(data.tce.depth * 100).toFixed(5)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Planet Radius</div>
            <div className="text-2xl font-bold text-accent">{data.radius.toFixed(5)} R⊕</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Orbit className="w-6 h-6 text-chart-3" />
            Light Curve
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.lightCurve}>
              <XAxis
                dataKey="time"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                label={{ value: "Time (days)", position: "insideBottom", offset: -5, fill: "#999" }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                domain={[95, 105]}
                label={{ value: "Flux", angle: -90, position: "insideLeft", fill: "#999" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="flux" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Orbit className="w-6 h-6 text-chart-3" />
            Folded Phase
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.foldedPhase}>
              <XAxis
                dataKey="phase"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                label={{ value: "Phase", position: "insideBottom", offset: -5, fill: "#999" }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                domain={[0, 100]}
                ticks={[0, 35, 70]}
                label={{ value: "Flux", angle: -90, position: "insideLeft", fill: "#999" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="flux" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-8">
        <h3 className="text-2xl font-bold mb-6">Model Explainability</h3>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          Feature importance scores from the ExoMiner neural network model
        </p>
        <div className="space-y-6">
          {data.features.map((feature) => (
            <div key={feature.name}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">{feature.name}</span>
                <span className="text-base text-muted-foreground font-mono font-bold">
                  {(feature.importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-10 bg-secondary rounded-full overflow-hidden border-2 border-primary/20">
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
