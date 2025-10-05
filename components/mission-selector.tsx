"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Satellite } from "lucide-react"
import Image from "next/image"

type Mission = "kepler" | "k2" | "tess"

interface MissionTarget {
  id: string
  sector?: number
  campaign?: number
}

interface MissionSelectorProps {
  onSelectTarget: (targetId: string, mission: Mission, sector?: number) => void
}

const missionInfo = {
  kepler: {
    name: "Kepler",
    prefix: "KIC",
    image: "/kepler-space-telescope.jpg",
    description:
      "NASA's Kepler mission (2009-2013) monitored over 150,000 stars in a single field of view, discovering thousands of exoplanets through the transit method.",
  },
  k2: {
    name: "K2",
    prefix: "EPIC",
    image: "/k2-mission-space-telescope.jpg",
    description:
      "K2 (2014-2018) was Kepler's extended mission, observing different fields along the ecliptic plane and discovering additional exoplanets across various stellar environments.",
  },
  tess: {
    name: "TESS",
    prefix: "TIC",
    image: "/tess-transiting-exoplanet-survey-satellite.jpg",
    description:
      "TESS (2018-present) surveys the entire sky in sectors, monitoring hundreds of thousands of bright stars to find transiting exoplanets around nearby stars.",
  },
}

// Mock data for demonstration
const generateMockTargets = (mission: Mission, count = 100): MissionTarget[] => {
  const prefix = missionInfo[mission].prefix
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${10000000 + i * 12345}`,
    sector: mission === "tess" ? Math.floor(Math.random() * 69) + 1 : undefined,
    campaign: mission === "k2" ? Math.floor(Math.random() * 19) + 1 : undefined,
  }))
}

export function MissionSelector({ onSelectTarget }: MissionSelectorProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const targets = selectedMission ? generateMockTargets(selectedMission) : []
  const filteredTargets = targets.filter((target) => target.id.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalPages = Math.ceil(filteredTargets.length / itemsPerPage)
  const paginatedTargets = filteredTargets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleMissionChange = (mission: Mission) => {
    setSelectedMission(mission)
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleTargetSelect = (target: MissionTarget) => {
    onSelectTarget(target.id, selectedMission!, target.sector || target.campaign)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-2xl shadow-primary/10 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Satellite className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-primary">Select Mission</h2>
        </div>

        <div className="max-w-md">
          <Label htmlFor="mission" className="mb-3 block text-base font-semibold">
            Space Telescope Mission
          </Label>
          <Select value={selectedMission || undefined} onValueChange={(value) => handleMissionChange(value as Mission)}>
            <SelectTrigger className="bg-secondary border-2 border-primary/20 rounded-xl h-12 text-base focus:border-primary">
              <SelectValue placeholder="Choose a mission..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kepler">Kepler</SelectItem>
              <SelectItem value="k2">K2</SelectItem>
              <SelectItem value="tess">TESS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMission && (
        <div className="space-y-6">
          {/* Mission Info Header */}
          <div className="rounded-2xl border-2 border-primary/20 bg-card/50 overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={missionInfo[selectedMission].image || "/placeholder.svg"}
                alt={missionInfo[selectedMission].name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-primary mb-2">{missionInfo[selectedMission].name} Mission</h3>
              <p className="text-muted-foreground leading-relaxed">{missionInfo[selectedMission].description}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="rounded-xl border-2 border-primary/20 bg-card p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search ${missionInfo[selectedMission].prefix} IDs...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 bg-secondary border-2 border-primary/20 rounded-xl h-12 text-base focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Targets Table */}
          <div className="rounded-xl border-2 border-primary/20 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Target ID</th>
                    {selectedMission === "tess" && (
                      <th className="px-6 py-4 text-left text-sm font-semibold">Sector</th>
                    )}
                    {selectedMission === "k2" && (
                      <th className="px-6 py-4 text-left text-sm font-semibold">Campaign</th>
                    )}
                    <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTargets.map((target) => (
                    <tr key={target.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">
                        {target.id.replace(/^(KIC|EPIC|TIC)(\d)/, "$1 $2")}
                      </td>
                      {selectedMission === "tess" && <td className="px-6 py-4 text-sm">{target.sector}</td>}
                      {selectedMission === "k2" && <td className="px-6 py-4 text-sm">{target.campaign}</td>}
                      <td className="px-6 py-4 text-right">
                        <Button
                          onClick={() => handleTargetSelect(target)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 rounded-lg font-semibold"
                        >
                          Analyze
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTargets.length)} of {filteredTargets.length} targets
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
