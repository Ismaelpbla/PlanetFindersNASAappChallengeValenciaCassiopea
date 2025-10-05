"use client"

import type { ExoplanetData } from "@/types/exoplanet"
import { AnalysisTable } from "@/components/analysis-table"

interface HistoryPanelProps {
  data: ExoplanetData[]
  selectedId: string | null
  onSelectRow: (ticId: string, sector: number) => void
}

export function HistoryPanel({ data, selectedId, onSelectRow }: HistoryPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-2xl shadow-primary/10 p-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Analysis History</h2>
        <p className="text-muted-foreground">
          View all previously analyzed stars and their detection results. Click on any row to view detailed information
          in the Dashboard tab.
        </p>
      </div>

      <AnalysisTable data={data} selectedId={selectedId} onSelectRow={onSelectRow} />
    </div>
  )
}
