"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { ExoplanetData } from "@/types/exoplanet"

interface DetectionPanelProps {
  starId: string | null
  data?: ExoplanetData
}

export function DetectionPanel({ starId, data }: DetectionPanelProps) {
  if (!starId || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground text-lg">Select a star from the map or analyze a new one</p>
      </div>
    )
  }

  const getStatusColor = (probability: number) => {
    if (probability > 0.99) return "bg-emerald-500"
    if (probability >= 0.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const statusColor = getStatusColor(data.probability)

  return (
    <div className="space-y-6">
      {/* Star Info Card */}
      <Card className="bg-black/40 border-white/10 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{data.ticId}</h2>
            {data.planetType && <p className="text-lg text-teal-400">Type: {data.planetType}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">Probability</span>
              <span className="text-2xl font-bold">{(data.probability * 100).toFixed(2)}%</span>
            </div>
            <div className="h-3 bg-black/60 rounded-full overflow-hidden">
              <div
                className={`h-full ${statusColor} rounded-full transition-all`}
                style={{ width: `${data.probability * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-white/10 p-6">
          <h3 className="text-xl font-semibold mb-4">Light Curve</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.lightCurve}>
              <XAxis dataKey="time" stroke="#666" tick={{ fill: "#999", fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: "#999", fontSize: 12 }} domain={[95, 105]} />
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

        <Card className="bg-black/40 border-white/10 p-6">
          <h3 className="text-xl font-semibold mb-4">Folded Phase</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.foldedPhase}>
              <XAxis
                dataKey="phase"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                label={{ value: "0", position: "insideBottomLeft", fill: "#999" }}
              />
              <YAxis stroke="#666" tick={{ fill: "#999", fontSize: 12 }} domain={[0, 100]} ticks={[0, 35, 70]} />
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

      <Card className="bg-black/40 border-white/10 p-6">
        <h3 className="text-2xl font-semibold mb-6">Explainability</h3>
        <div className="space-y-4">
          {data.features.map((feature) => (
            <div key={feature.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{feature.name}</span>
                <span className="text-sm text-muted-foreground">{(feature.importance * 100).toFixed(0)}%</span>
              </div>
              <div className="h-8 bg-black/60 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-lg transition-all"
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
