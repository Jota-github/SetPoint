"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface Player {
  number: string
  name: string
}

export default function CampeonatoSetup() {
  const searchParams = useSearchParams()
  const teamAName = searchParams.get("teamA") || "Time A"
  const teamBName = searchParams.get("teamB") || "Time B"
  const numSets = searchParams.get("numSets") || "3"
  const pointsPerSet = searchParams.get("pointsPerSet") || "25"

  const [activeTab, setActiveTab] = useState<"A" | "B">("A")
  const [teamA, setTeamA] = useState({
    starters: Array(6)
      .fill(null)
      .map(() => ({ number: "", name: "" })) as Player[],
    substitutes: [] as Player[],
    firstServer: 0,
  })
  const [teamB, setTeamB] = useState({
    starters: Array(6)
      .fill(null)
      .map(() => ({ number: "", name: "" })) as Player[],
    substitutes: [] as Player[],
    firstServer: 0,
  })
  const router = useRouter()

  const currentTeam = activeTab === "A" ? teamA : teamB
  const setCurrentTeam = activeTab === "A" ? setTeamA : setTeamB

  const updateStarter = (index: number, field: "number" | "name", value: string) => {
    const newStarters = [...currentTeam.starters]
    newStarters[index] = { ...newStarters[index], [field]: value }
    setCurrentTeam({ ...currentTeam, starters: newStarters })
  }

  const updateSubstitute = (index: number, field: "number" | "name", value: string) => {
    const newSubstitutes = [...currentTeam.substitutes]
    newSubstitutes[index] = { ...newSubstitutes[index], [field]: value }
    setCurrentTeam({ ...currentTeam, substitutes: newSubstitutes })
  }

  const addSubstitute = () => {
    setCurrentTeam({
      ...currentTeam,
      substitutes: [...currentTeam.substitutes, { number: "", name: "" }],
    })
  }

  const setFirstServer = (index: number) => {
    setCurrentTeam({ ...currentTeam, firstServer: index })
  }

  const handleSave = () => {
    // --- MUDANÇA AQUI ---
    // Adicionado gameType: "championship"
    const params = new URLSearchParams({
      teamA: teamAName,
      teamB: teamBName,
      numSets: numSets,
      pointsPerSet: pointsPerSet,
      gameType: "championship",
    })
    router.push(`/scoreboard?${params.toString()}`)
    // --- FIM DA MUDANÇA ---
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Configurar Times</h1>

        {/* Tab Interface */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("A")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "A"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            {teamAName}
          </button>
          <button
            onClick={() => setActiveTab("B")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "B"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-orange-300"
            }`}
          >
            {teamBName}
          </button>
        </div>

        {/* Team Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          {/* Starting 6 */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Jogadores Titulares (Starting 6)</h2>
          <div className="space-y-3 mb-6">
            {currentTeam.starters.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="number"
                  value={player.number}
                  onChange={(e) => updateStarter(index, "number", e.target.value)}
                  className="w-16 px-2 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-center"
                  placeholder="N°"
                  min="0"
                  max="99"
                />
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updateStarter(index, "name", e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  placeholder="Nome do Jogador"
                />
                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-600 mb-1">Saque</label>
                  <input
                    type="radio"
                    name={`firstServer-${activeTab}`}
                    checked={currentTeam.firstServer === index}
                    onChange={() => setFirstServer(index)}
                    className="w-5 h-5 text-teal-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Substitutes */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservas</h2>
          <div className="space-y-3 mb-4">
            {currentTeam.substitutes.map((substitute, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="number"
                  value={substitute.number}
                  onChange={(e) => updateSubstitute(index, "number", e.target.value)}
                  className="w-16 px-2 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-center"
                  placeholder="N°"
                  min="0"
                  max="99"
                />
                <input
                  type="text"
                  value={substitute.name}
                  onChange={(e) => updateSubstitute(index, "name", e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  placeholder="Nome do Jogador"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSubstitute}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-500 transition-colors font-medium"
          >
            + Adicionar Reserva
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl font-semibold py-4 rounded-xl transition-colors shadow-lg"
        >
          Salvar Times e Iniciar Jogo
        </button>
      </div>
    </div>
  )
}