"use client"

import { Telescope, Cpu, UserCheck, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function AboutPanel() {
  const steps = [
    {
      icon: Telescope,
      number: "01",
      title: "Observation & Data Acquisition",
      sections: [
        {
          subtitle: "Space Missions",
          description:
            "NASA satellites like Kepler and TESS continuously record light curves from thousands of stars in space.",
        },
        {
          subtitle: "Transit Signal",
          description: "Periodic dips in brightness indicate a planet transiting in front of its host star.",
        },
      ],
    },
    {
      icon: Cpu,
      number: "02",
      title: "Processing & Automated Classification (AI)",
      sections: [
        {
          subtitle: "Data Preparation",
          description:
            "Light curves are cleaned (removing noise and variability) and hundreds of features and patterns are extracted for analysis.",
        },
        {
          subtitle: "ML Classification",
          description:
            "Advanced Machine Learning algorithms (like Ensemble models or Gradient Boosted Trees) analyze these features to automatically identify and classify the most probable exoplanet candidates.",
        },
      ],
    },
    {
      icon: UserCheck,
      number: "03",
      title: "Vetting & Human Validation",
      sections: [
        {
          subtitle: "Need for Vetting",
          description:
            "Despite AI precision, transit detection has a high false positive rate (like eclipsing binaries). AI only selects the most important cases for review.",
        },
        {
          subtitle: "Expert Review",
          description:
            "Expert astronomers perform manual validation (vetting) of candidates, inspecting light curves through visual tools to rule out false positive hypotheses.",
        },
      ],
    },
    {
      icon: CheckCircle2,
      number: "04",
      title: "Final Classification",
      sections: [
        {
          subtitle: "Archive Status",
          description:
            "The Kepler Object of Interest (KOI) receives its final classification, maintained in the data archive:",
        },
      ],
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">How ExoMiner Works</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From light to exoplanet: the complete pipeline for discovering worlds beyond our solar system
        </p>
      </div>

      <div className="space-y-16">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-10 h-10 text-teal-400" />
                  </div>
                  <div className="text-6xl font-bold text-white/5">{step.number}</div>
                </div>

                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold text-balance">{step.title}</h3>

                  {step.sections.map((section, sIndex) => (
                    <div key={sIndex} className="space-y-2">
                      <h4 className="text-lg font-semibold text-teal-400">{section.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                    </div>
                  ))}

                  {index === 3 && (
                    <div className="grid gap-4 mt-6">
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                        <div>
                          <div className="font-bold text-emerald-400 mb-1">CONFIRMED</div>
                          <div className="text-sm text-emerald-300/70">
                            Exoplanet confirmed with high statistical certainty
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2" />
                        <div>
                          <div className="font-bold text-red-400 mb-1">FALSE POSITIVE</div>
                          <div className="text-sm text-red-300/70">Signal ruled out as false positive</div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2" />
                        <div>
                          <div className="font-bold text-yellow-400 mb-1">CANDIDATE</div>
                          <div className="text-sm text-yellow-300/70">Candidate pending additional validation</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
