import { Card } from "@/components/ui/card"
import type { ExoplanetData } from "@/types/exoplanet"

interface ResultsPanelProps {
  data: ExoplanetData[]
}

export function ResultsPanel({ data }: ResultsPanelProps) {
  const exoplanets = data.filter((d) => d.status === "exoplanet").length
  const candidates = data.filter((d) => d.status === "candidate").length
  const falsePositives = data.filter((d) => d.status === "false-positive").length
  const total = data.length

  const results = [
    { label: "Exoplanets", value: exoplanets, color: "bg-emerald-600", textColor: "text-emerald-100" },
    { label: "False Positives", value: falsePositives, color: "bg-red-600", textColor: "text-red-100" },
    { label: "Candidates", value: candidates, color: "bg-yellow-600", textColor: "text-yellow-100" },
    { label: "Total", value: total, color: "bg-blue-600", textColor: "text-blue-100" },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((result) => (
          <Card key={result.label} className={`${result.color} border-0 p-8 text-center`}>
            <div className={`text-6xl font-bold mb-3 ${result.textColor}`}>{result.value}</div>
            <div className={`text-xl font-medium ${result.textColor}`}>{result.label}</div>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="bg-black/40 border-white/10 p-8 mt-8">
        <h3 className="text-2xl font-semibold mb-4">Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
          <div>
            <p className="mb-2">
              <span className="text-white font-semibold">{exoplanets} exoplanets</span> detected with high confidence
              (probability {">"} 99%)
            </p>
            <p className="mb-2">
              <span className="text-white font-semibold">{candidates} candidates</span> require additional analysis
              (probability 50-99%)
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="text-white font-semibold">{falsePositives} false positives</span> identified and
              discarded
            </p>
            <p className="mb-2">
              <span className="text-white font-semibold">{total} total objects</span> analyzed by ExoMiner
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
