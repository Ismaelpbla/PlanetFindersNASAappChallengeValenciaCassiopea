"use client"

import { useState } from "react"
import type { ExoplanetData } from "@/types/exoplanet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface AnalysisTableProps {
  data: ExoplanetData[]
  selectedId: string | null
  onSelectRow: (ticId: string) => void
}

export function AnalysisTable({ data, selectedId, onSelectRow }: AnalysisTableProps) {
  const [showStellarParams, setShowStellarParams] = useState(false)
  const [showGaiaRuwe, setShowGaiaRuwe] = useState(false)
  const [showSpocDvr, setShowSpocDvr] = useState(false)
  const [showTce, setShowTce] = useState(false)

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-muted-foreground">No analyses performed yet. Enter a TIC ID and sector to begin.</p>
      </div>
    )
  }

  const getStatusBadge = (status: ExoplanetData["status"]) => {
    const variants = {
      exoplanet: { label: "Exoplanet", className: "bg-emerald-600/20 text-emerald-400 border-emerald-600/50" },
      candidate: { label: "Candidate", className: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50" },
      "false-positive": { label: "False Positive", className: "bg-red-600/20 text-red-400 border-red-600/50" },
    }
    const variant = variants[status]
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="stellar-params"
            checked={showStellarParams}
            onCheckedChange={(checked) => setShowStellarParams(checked as boolean)}
            className="border-white/50 data-[state=unchecked]:bg-white/10"
          />
          <Label htmlFor="stellar-params" className="cursor-pointer text-sm font-medium">
            Stellar Parameters
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="gaia-ruwe"
            checked={showGaiaRuwe}
            onCheckedChange={(checked) => setShowGaiaRuwe(checked as boolean)}
            className="border-white/50 data-[state=unchecked]:bg-white/10"
          />
          <Label htmlFor="gaia-ruwe" className="cursor-pointer text-sm font-medium">
            Gaia RUWE
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="spoc-dvr"
            checked={showSpocDvr}
            onCheckedChange={(checked) => setShowSpocDvr(checked as boolean)}
            className="border-white/50 data-[state=unchecked]:bg-white/10"
          />
          <Label htmlFor="spoc-dvr" className="cursor-pointer text-sm font-medium">
            SPOC DVR
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="tce"
            checked={showTce}
            onCheckedChange={(checked) => setShowTce(checked as boolean)}
            className="border-white/50 data-[state=unchecked]:bg-white/10"
          />
          <Label htmlFor="tce" className="cursor-pointer text-sm font-medium">
            TCE
          </Label>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium">TIC ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Sector</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Probability</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                {showStellarParams && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">Teff (K)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Log g</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">[Fe/H]</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Radius (R☉)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Mass (M☉)</th>
                  </>
                )}
                {showGaiaRuwe && <th className="px-4 py-3 text-left text-sm font-medium">Gaia RUWE</th>}
                {showSpocDvr && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">DVR</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">DVR Uncertainty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">DVR Flag</th>
                  </>
                )}
                {showTce && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">Period (d)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Duration (h)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Depth (%)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.ticId}
                  onClick={() => onSelectRow(item.ticId)}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${
                    selectedId === item.ticId ? "bg-teal-600/20" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-sm">{item.ticId}</td>
                  <td className="px-4 py-3 text-sm">{item.sector}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="font-semibold">{(item.probability * 100).toFixed(2)}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(item.status)}</td>
                  {showStellarParams && (
                    <>
                      <td className="px-4 py-3 text-sm">{item.stellarParameters.teff.toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm">{item.stellarParameters.logg.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{item.stellarParameters.feh.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{item.stellarParameters.radius.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{item.stellarParameters.mass.toFixed(2)}</td>
                    </>
                  )}
                  {showGaiaRuwe && <td className="px-4 py-3 text-sm">{item.gaiaRuwe.toFixed(2)}</td>}
                  {showSpocDvr && (
                    <>
                      <td className="px-4 py-3 text-sm">{item.spocDvr.dvr.toFixed(3)}</td>
                      <td className="px-4 py-3 text-sm">{item.spocDvr.dvrUncertainty.toFixed(3)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            item.spocDvr.dvrFlag === "PASS"
                              ? "bg-emerald-600/20 text-emerald-400 border-emerald-600/50"
                              : "bg-yellow-600/20 text-yellow-400 border-yellow-600/50"
                          }
                        >
                          {item.spocDvr.dvrFlag}
                        </Badge>
                      </td>
                    </>
                  )}
                  {showTce && (
                    <>
                      <td className="px-4 py-3 text-sm">{item.tce.period.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{item.tce.duration.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{(item.tce.depth * 100).toFixed(2)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
