"use client"

import { useState } from "react"
import type { ExoplanetData } from "@/types/exoplanet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AnalysisTableProps {
  data: ExoplanetData[]
  selectedId: string | null
  onSelectRow: (ticId: string, sector: number) => void
}

const columnDescriptions: Record<string, string> = {
  id: "Unique identifier of the star in the mission catalog.",
  sector: "Number of the sky sector observed by the TESS telescope.",
  probability: "Estimated probability that the object is a real exoplanet.",
  status: "Validation status of the candidate: confirmed, candidate, or false positive.",
  teff: "Effective temperature of the star in kelvin; indicates how hot its surface is.",
  logg: "Stellar surface gravity (in base 10 logarithm); helps distinguish star types.",
  feh: "Metallicity: iron-to-hydrogen ratio, measures the chemical richness of the star.",
  radius: "Radius of the star in solar radii (compared to the Sun).",
  mass: "Mass of the star in solar masses (compared to the Sun).",
  gaiaRuwe: "Quality indicator of Gaia's astrometric fit; high values may suggest binarity or errors.",
  dvr: "Difference between observed and expected radial velocity; used to detect orbital variations.",
  dvrUncertainty: "Uncertainty associated with the DVR measurement.",
  dvrFlag: "Quality mark or warning about DVR reliability.",
  period: "Time it takes the planet to complete one orbit (in days).",
  duration: "Duration of the observed transit (in hours).",
  depth: "Percentage of light that decreases during transit; indicates the relative size of the planet.",
}

const ColumnHeader = ({ label, description }: { label: string; description: string }) => (
  <div className="flex items-center gap-1.5">
    <span>{label}</span>
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-zinc-900 border-white/20 text-sm text-white">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)

export function AnalysisTable({ data, selectedId, onSelectRow }: AnalysisTableProps) {
  const [showStellarParams, setShowStellarParams] = useState(false)
  const [showGaiaRuwe, setShowGaiaRuwe] = useState(false)
  const [showSpocDvr, setShowSpocDvr] = useState(false)
  const [showTce, setShowTce] = useState(false)

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-muted-foreground">
          No analyses performed yet. Select a target from the Analysis tab to begin.
        </p>
      </div>
    )
  }

  const formatId = (ticId: string) => {
    // Remove TIC prefix if present and add space after other prefixes
    const withoutTic = ticId.replace(/^TIC\s*/, "")
    // Add space after KIC, EPIC, or other prefixes
    return withoutTic.replace(/^(KIC|EPIC|[A-Z]+)(\d)/, "$1 $2")
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
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <ColumnHeader label="ID" description={columnDescriptions.id} />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <ColumnHeader label="Sector" description={columnDescriptions.sector} />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <ColumnHeader label="Probability" description={columnDescriptions.probability} />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <ColumnHeader label="Status" description={columnDescriptions.status} />
                </th>
                {showStellarParams && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Teff (K)" description={columnDescriptions.teff} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Log g" description={columnDescriptions.logg} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="[Fe/H]" description={columnDescriptions.feh} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Radius (R☉)" description={columnDescriptions.radius} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Mass (M☉)" description={columnDescriptions.mass} />
                    </th>
                  </>
                )}
                {showGaiaRuwe && (
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    <ColumnHeader label="Gaia RUWE" description={columnDescriptions.gaiaRuwe} />
                  </th>
                )}
                {showSpocDvr && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="DVR" description={columnDescriptions.dvr} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="DVR Uncertainty" description={columnDescriptions.dvrUncertainty} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="DVR Flag" description={columnDescriptions.dvrFlag} />
                    </th>
                  </>
                )}
                {showTce && (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Period (d)" description={columnDescriptions.period} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Duration (h)" description={columnDescriptions.duration} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <ColumnHeader label="Depth (%)" description={columnDescriptions.depth} />
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.ticId}
                  onClick={() => onSelectRow(item.ticId, item.sector)}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${
                    selectedId === `${item.ticId}/${item.sector}` ? "bg-teal-600/20" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-sm">{formatId(item.ticId)}</td>
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
