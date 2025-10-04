"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AnalysisInputProps {
  onAnalyze: (ticId: string, sector: number) => Promise<void>
}

export function AnalysisInput({ onAnalyze }: AnalysisInputProps) {
  const [ticId, setTicId] = useState("")
  const [sector, setSector] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticId || !sector) return

    setIsAnalyzing(true)
    try {
      await onAnalyze(ticId, Number.parseInt(sector))
      setTicId("")
      setSector("")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-2xl shadow-primary/10 p-8">
      <h2 className="mb-6 text-3xl font-bold text-primary">Analyze New Star</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-6">
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
      </form>
    </div>
  )
}
