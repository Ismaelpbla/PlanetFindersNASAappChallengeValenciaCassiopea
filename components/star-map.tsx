"use client"

import { Card } from "@/components/ui/card"
import type { ExoplanetData } from "@/types/exoplanet"

interface StarMapProps {
  selectedStar: string | null
  onSelectStar: (starId: string) => void
  data: ExoplanetData[]
}

export function StarMap({ selectedStar, onSelectStar, data }: StarMapProps) {
  const stars = data.map((item, index) => ({
    id: item.ticId,
    x: (item.ra / 360) * 100,
    y: ((item.dec + 90) / 180) * 100,
    type: item.status,
    probability: item.probability,
  }))

  const selectedData = data.find((d) => d.ticId === selectedStar)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Star Map Visualization */}
      <Card className="bg-black/40 border-white/10 p-6">
        <div className="relative aspect-[4/3] bg-black/60 rounded-lg overflow-hidden">
          {/* Background stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Interactive stars */}
          {stars.map((star) => (
            <button
              key={star.id}
              onClick={() => onSelectStar(star.id)}
              className={`absolute w-3 h-3 rounded-full transition-all hover:scale-150 ${
                star.type === "exoplanet"
                  ? "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]"
                  : star.type === "candidate"
                    ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                    : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]"
              } ${selectedStar === star.id ? "scale-150 ring-2 ring-white" : ""}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
            />
          ))}

          {/* Axis labels */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-muted-foreground">
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
            <span>120</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400" />
            <span className="text-sm">Exoplanet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-sm">Candidate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-sm">False Positive</span>
          </div>
        </div>
      </Card>

      {/* Selected Star Info */}
      <Card className="bg-black/40 border-white/10 p-6">
        <h2 className="text-3xl font-bold mb-6">{selectedStar || "Select a star"}</h2>

        {selectedStar && selectedData && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg text-muted-foreground">Probability</span>
                <span className="text-2xl font-bold border border-white/20 rounded px-3 py-1">
                  {(selectedData.probability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full"
                  style={{ width: `${selectedData.probability * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Sector</div>
                <div className="font-mono">{selectedData.sector}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Magnitude</div>
                <div className="font-mono">{selectedData.magnitude.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">RA</div>
                <div className="font-mono">{selectedData.ra.toFixed(2)}°</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">DEC</div>
                <div className="font-mono">{selectedData.dec.toFixed(2)}°</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Period</div>
                <div className="font-mono">{selectedData.period.toFixed(2)} days</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Radius</div>
                <div className="font-mono">{selectedData.radius.toFixed(2)} R⊕</div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
