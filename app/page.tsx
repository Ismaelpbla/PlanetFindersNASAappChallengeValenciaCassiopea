"use client"

import { useState } from "react"
import { DashboardPanel } from "@/components/dashboard-panel"
import { ResultsPanel } from "@/components/results-panel"
import { AboutPanel } from "@/components/about-panel"
import { MissionSelector } from "@/components/mission-selector"
import { HistoryPanel } from "@/components/history-panel"
import type { ExoplanetData } from "@/types/exoplanet"
import { analyzeStarWithExoMiner } from "@/lib/mock-analysis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function ExoMinerDashboard() {
  const [activeTab, setActiveTab] = useState("analysis")
  const [analyzedData, setAnalyzedData] = useState<ExoplanetData[]>([])
  const [selectedStar, setSelectedStar] = useState<string | null>(null)

  const handleAnalyze = async (targetId: string, mission: string, sector?: number) => {
    // For now, we'll use the existing mock analysis with TIC format
    // In production, this would handle different mission formats
    const result = await analyzeStarWithExoMiner(targetId, sector || 1)
    setAnalyzedData((prev) => [result, ...prev])
    setSelectedStar(`${result.ticId}/${result.sector}`)
    setActiveTab("dashboard")
  }

  const handleSelectRow = (ticId: string, sector: number) => {
    const starKey = `${ticId}/${sector}`
    setSelectedStar(starKey)
    setActiveTab("dashboard")
  }

  const selectedData = analyzedData.find((d) => `${d.ticId}/${d.sector}` === selectedStar)

  const formatSelectorLabel = (data: ExoplanetData) => {
    const mission = data.ticId.startsWith("KIC") ? "Kepler" : data.ticId.startsWith("EPIC") ? "K2" : "TESS"
    // Remove TIC prefix and add space after other prefixes
    const formattedId = data.ticId.replace(/^TIC\s*/, "").replace(/^(KIC|EPIC)(\d)/, "$1 $2")
    return `${mission} / ${formattedId}`
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-4">
          <Image
            src="/casiopeai-logo.png"
            alt="CasiopeAI Logo"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance leading-tight">
              CasiopeAI <span className="text-primary">Exoplanet Detection</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg">
              AI-powered exoplanet discovery using NASA's mission data
            </p>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 sm:px-8 py-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
              {[
                { id: "analysis", label: "Analysis" },
                { id: "dashboard", label: "Dashboard" },
                { id: "history", label: "History" },
                { id: "Summary", label: "Summary" },
                { id: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {analyzedData.length > 0 && activeTab === "dashboard" && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Selected Star:</span>
                <Select value={selectedStar || undefined} onValueChange={setSelectedStar}>
                  <SelectTrigger className="w-full sm:w-[280px] bg-card border-2 border-primary/30 rounded-xl shadow-lg hover:border-primary/60 transition-all font-semibold">
                    <SelectValue placeholder="Select a star" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 border-primary/30 rounded-xl shadow-2xl">
                    {analyzedData.map((data) => (
                      <SelectItem
                        key={`${data.ticId}/${data.sector}`}
                        value={`${data.ticId}/${data.sector}`}
                        className="rounded-lg hover:bg-primary/20 font-medium"
                      >
                        {formatSelectorLabel(data)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-8 max-w-[1600px] mx-auto">
        {activeTab === "analysis" && <MissionSelector onSelectTarget={handleAnalyze} />}
        {activeTab === "dashboard" && <DashboardPanel starId={selectedStar} data={selectedData} />}
        {activeTab === "history" && (
          <HistoryPanel data={analyzedData} selectedId={selectedStar} onSelectRow={handleSelectRow} />
        )}
        {activeTab === "Summary" && <ResultsPanel data={analyzedData} />}
        {activeTab === "about" && <AboutPanel />}
      </main>
    </div>
  )
}
