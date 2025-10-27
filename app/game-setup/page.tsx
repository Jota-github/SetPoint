"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GameSetup() {
  const router = useRouter()
  const [teamAName, setTeamAName] = useState("")
  const [teamBName, setTeamBName] = useState("")
  const [numSets, setNumSets] = useState("3")
  const [pointsPerSet, setPointsPerSet] = useState("25")
  const [firstServe, setFirstServe] = useState("A")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      teamA: teamAName,
      teamB: teamBName,
      numSets,
      pointsPerSet,
      firstServe,
    })
    router.push(`/campeonato?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações do Jogo</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team A Name */}
          <div>
            <label htmlFor="teamA" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Time A
            </label>
            <input
              type="text"
              id="teamA"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Digite o nome do Time A"
              required
            />
          </div>

          {/* Team B Name */}
          <div>
            <label htmlFor="teamB" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Time B
            </label>
            <input
              type="text"
              id="teamB"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Digite o nome do Time B"
              required
            />
          </div>

          {/* Number of Sets */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-sm font-medium text-gray-700 px-2">Número de Sets</legend>
            <div className="space-y-3 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="numSets"
                  value="3"
                  checked={numSets === "3"}
                  onChange={(e) => setNumSets(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">Melhor de 3</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="numSets"
                  value="5"
                  checked={numSets === "5"}
                  onChange={(e) => setNumSets(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">Melhor de 5</span>
              </label>
            </div>
          </fieldset>

          {/* Points per Set */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-sm font-medium text-gray-700 px-2">Pontos por Set</legend>
            <div className="space-y-3 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pointsPerSet"
                  value="21"
                  checked={pointsPerSet === "21"}
                  onChange={(e) => setPointsPerSet(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">21 Pontos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pointsPerSet"
                  value="25"
                  checked={pointsPerSet === "25"}
                  onChange={(e) => setPointsPerSet(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">25 Pontos</span>
              </label>
            </div>
          </fieldset>

          {/* First Serve */}
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-sm font-medium text-gray-700 px-2">Saque Inicial</legend>
            <div className="space-y-3 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="firstServe"
                  value="A"
                  checked={firstServe === "A"}
                  onChange={(e) => setFirstServe(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">Time A</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="firstServe"
                  value="B"
                  checked={firstServe === "B"}
                  onChange={(e) => setFirstServe(e.target.value)}
                  className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700">Time B</span>
              </label>
            </div>
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl font-semibold py-4 rounded-xl transition-colors shadow-lg mt-8"
          >
            Configurar Times
          </button>
        </form>
      </div>
    </div>
  )
}
