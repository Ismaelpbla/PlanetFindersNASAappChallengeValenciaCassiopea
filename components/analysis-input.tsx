"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Code2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface AnalysisInputProps {
  onAnalyze: (
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
  ) => Promise<void>
}

export function AnalysisInput({ onAnalyze }: AnalysisInputProps) {
  const [ticId, setTicId] = useState("")
  const [sector, setSector] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [devStatus, setDevStatus] = useState<"exoplanet" | "candidate" | "false-positive">("exoplanet")
  const [devPlanetType, setDevPlanetType] = useState<"Terrestrial" | "Super Earth" | "Neptune-Like" | "Gas Giant">(
    "Terrestrial",
  )
  const [devFPType, setDevFPType] = useState<
    | "Eclipsing Binary"
    | "Background Eclipsing Binary"
    | "Grazing Eclipsing Binary"
    | "Instrumental Artifact"
    | "Stellar Variability"
    | "Contamination"
  >("Eclipsing Binary")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticId || !sector) return

    setIsAnalyzing(true)
    try {
      const devOptions = devMode
        ? {
            status: devStatus,
            planetType: devStatus === "exoplanet" ? devPlanetType : undefined,
            falsePositiveType: devStatus === "false-positive" ? devFPType : undefined,
          }
        : undefined

      await onAnalyze(ticId, Number.parseInt(sector), devOptions)
      setTicId("")
      setSector("")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-2xl shadow-primary/10 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Analyze New Star</h2>
        <div className="flex items-center gap-3">
          <Checkbox
            id="devMode"
            checked={devMode}
            onCheckedChange={(checked) => setDevMode(checked as boolean)}
            className="border-2 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="devMode" className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <Code2 className="h-4 w-4" />
            Developer Mode
          </Label>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="ticId" className="mb-3 block text-base font-semibold">
              TIC ID
            </Label>
            <Input
              id="ticId"
              type="text"
              placeholder="e.g. 12345679"
              value={ticId}
              onChange={(e) => setTicId(e.target.value)}
              className="bg-secondary border-2 border-primary/20 rounded-xl h-12 text-base focus:border-primary"
              disabled={isAnalyzing}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sector" className="mb-3 block text-base font-semibold">
              Sector
            </Label>
            <Input
              id="sector"
              type="number"
              placeholder="e.g. 1"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="bg-secondary border-2 border-primary/20 rounded-xl h-12 text-base focus:border-primary"
              disabled={isAnalyzing}
            />
          </div>
          <Button
            type="submit"
            disabled={!ticId || !sector || isAnalyzing}
            className="bg-primary hover:bg-primary/90 min-w-[140px] h-12 rounded-xl text-base font-bold shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {devMode && (
          <div className="rounded-xl border-2 border-orange-500/30 bg-orange-500/5 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-bold text-orange-500">Developer Controls</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="devStatus" className="mb-2 block text-sm font-semibold">
                  Status
                </Label>
                <Select value={devStatus} onValueChange={(value: any) => setDevStatus(value)}>
                  <SelectTrigger className="bg-secondary border-2 border-orange-500/20 rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exoplanet">Exoplanet</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="false-positive">False Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {devStatus === "exoplanet" && (
                <div>
                  <Label htmlFor="devPlanetType" className="mb-2 block text-sm font-semibold">
                    Planet Type
                  </Label>
                  <Select value={devPlanetType} onValueChange={(value: any) => setDevPlanetType(value)}>
                    <SelectTrigger className="bg-secondary border-2 border-orange-500/20 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terrestrial">Terrestrial</SelectItem>
                      <SelectItem value="Super Earth">Super Earth</SelectItem>
                      <SelectItem value="Neptune-Like">Neptune-Like</SelectItem>
                      <SelectItem value="Gas Giant">Gas Giant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {devStatus === "false-positive" && (
                <div>
                  <Label htmlFor="devFPType" className="mb-2 block text-sm font-semibold">
                    False Positive Type
                  </Label>
                  <Select value={devFPType} onValueChange={(value: any) => setDevFPType(value)}>
                    <SelectTrigger className="bg-secondary border-2 border-orange-500/20 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eclipsing Binary">Eclipsing Binary</SelectItem>
                      <SelectItem value="Background Eclipsing Binary">Background Eclipsing Binary</SelectItem>
                      <SelectItem value="Grazing Eclipsing Binary">Grazing Eclipsing Binary</SelectItem>
                      <SelectItem value="Instrumental Artifact">Instrumental Artifact</SelectItem>
                      <SelectItem value="Stellar Variability">Stellar Variability</SelectItem>
                      <SelectItem value="Contamination">Contamination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
