"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Scoreboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamAName = searchParams.get("teamA") || "Time A"
  const teamBName = searchParams.get("teamB") || "Time B"
  const targetScore = searchParams.get("points") || "25"

  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [setsA, setSetsA] = useState(0)
  const [setsB, setSetsB] = useState(0)
  const [servingTeam, setServingTeam] = useState<"A" | "B">("A")
  const [serverNumberA, setServerNumberA] = useState(7)
  const [serverNumberB, setServerNumberB] = useState(3)

  const addPoint = (team: "A" | "B") => {
    if (team === "A") {
      setScoreA(scoreA + 1)
    } else {
      setScoreB(scoreB + 1)
    }
  }

  const subtractPoint = (team: "A" | "B") => {
    if (team === "A" && scoreA > 0) {
      setScoreA(scoreA - 1)
    } else if (team === "B" && scoreB > 0) {
      setScoreB(scoreB - 1)
    }
  }

  const toggleServe = () => {
    setServingTeam(servingTeam === "A" ? "B" : "A")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-white/70 hover:text-white text-sm z-10"
      >
        ← Voltar
      </button>

      {/* Main scoreboard container */}
      <div className="w-full h-screen flex">
        {/* Team A - Left Side (Blue) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black border-r-4 border-blue-500">
          <h2 className="text-white text-3xl font-bold mb-2">{teamAName}</h2>
          <div
            className={`text-lg font-semibold mb-6 transition-opacity cursor-pointer ${
              servingTeam === "A" ? "text-blue-400 opacity-100" : "text-white/30 opacity-40"
            }`}
            onClick={toggleServe}
          >
            SAQUE: <span className="font-bold">N° {serverNumberA}</span>
          </div>
          <div className="text-blue-500 text-9xl font-bold mb-12">{scoreA}</div>
          <div className="flex gap-6">
            <button
              onClick={() => addPoint("A")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-5xl font-bold w-24 h-24 rounded-2xl transition-colors"
            >
              +
            </button>
            <button
              onClick={() => subtractPoint("A")}
              className="bg-blue-500/30 hover:bg-blue-500/50 text-white text-5xl font-bold w-24 h-24 rounded-2xl transition-colors"
            >
              −
            </button>
          </div>
        </div>

        {/* Team B - Right Side (Orange) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black border-l-4 border-orange-500">
          <h2 className="text-white text-3xl font-bold mb-2">{teamBName}</h2>
          <div
            className={`text-lg font-semibold mb-6 transition-opacity cursor-pointer ${
              servingTeam === "B" ? "text-orange-400 opacity-100" : "text-white/30 opacity-40"
            }`}
            onClick={toggleServe}
          >
            SAQUE: <span className="font-bold">N° {serverNumberB}</span>
          </div>
          <div className="text-orange-500 text-9xl font-bold mb-12">{scoreB}</div>
          <div className="flex gap-6">
            <button
              onClick={() => addPoint("B")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-5xl font-bold w-24 h-24 rounded-2xl transition-colors"
            >
              +
            </button>
            <button
              onClick={() => subtractPoint("B")}
              className="bg-orange-500/30 hover:bg-orange-500/50 text-white text-5xl font-bold w-24 h-24 rounded-2xl transition-colors"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* Sets Counter - Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-8 py-4 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">
            Sets: {setsA} - {setsB}
          </div>
          <div className="text-sm text-gray-400">Jogando até: {targetScore}</div>
        </div>
      </div>
    </div>
  )
}
