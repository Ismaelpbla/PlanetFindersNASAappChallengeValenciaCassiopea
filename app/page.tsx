"use client"

import { useState } from "react"
import { DashboardPanel } from "@/components/dashboard-panel"
import { ResultsPanel } from "@/components/results-panel"
import { AboutPanel } from "@/components/about-panel"
import { AnalysisInput } from "@/components/analysis-input"
import { AnalysisTable } from "@/components/analysis-table"
import type { ExoplanetData } from "@/types/exoplanet"
import { analyzeStarWithExoMiner } from "@/lib/mock-analysis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExoMinerDashboard() {
  const [activeTab, setActiveTab] = useState("analysis")
  const [analyzedData, setAnalyzedData] = useState<ExoplanetData[]>([])
  const [selectedStar, setSelectedStar] = useState<string | null>(null)

  const handleAnalyze = async (ticId: string, sector: number) => {
    const result = await analyzeStarWithExoMiner(ticId, sector)
    setAnalyzedData((prev) => [result, ...prev])
    setSelectedStar(result.ticId)
  }

  const handleSelectRow = (ticId: string) => {
    setSelectedStar(ticId)
    setActiveTab("dashboard")
  }

  const selectedData = analyzedData.find((d) => d.ticId === selectedStar)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-8 py-8">
        <h1 className="text-5xl font-bold text-balance leading-tight">
          ExoMiner <span className="text-primary">Exoplanet Detection</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          AI-powered exoplanet discovery using NASA's TESS mission data
        </p>
      </header>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[
                { id: "analysis", label: "Analysis" },
                { id: "dashboard", label: "Dashboard" },
                { id: "results", label: "Results" },
                { id: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-base font-semibold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {analyzedData.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Selected Star:</span>
                <Select value={selectedStar || undefined} onValueChange={setSelectedStar}>
                  <SelectTrigger className="w-[220px] bg-card border-2 border-primary/30 rounded-xl shadow-lg hover:border-primary/60 transition-all font-semibold">
                    <SelectValue placeholder="Select a star" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 border-primary/30 rounded-xl shadow-2xl">
                    {analyzedData.map((data) => (
                      <SelectItem
                        key={data.ticId}
                        value={data.ticId}
                        className="rounded-lg hover:bg-primary/20 font-medium"
                      >
                        {data.ticId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-8 max-w-[1600px] mx-auto">
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <AnalysisInput onAnalyze={handleAnalyze} />
            <AnalysisTable data={analyzedData} selectedId={selectedStar} onSelectRow={handleSelectRow} />
          </div>
        )}
        {activeTab === "dashboard" && <DashboardPanel starId={selectedStar} data={selectedData} />}
        {activeTab === "results" && <ResultsPanel data={analyzedData} />}
        {activeTab === "about" && <AboutPanel />}
      </main>
    </div>
  )
}
