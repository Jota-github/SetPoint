"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showQuickGameModal, setShowQuickGameModal] = useState(false)
  const [pointsPerSet, setPointsPerSet] = useState(25)
  const router = useRouter()

  const handleStartQuickGame = () => {
    // --- MUDANÇA AQUI ---
    // Adicionado &gameType=quick
    router.push(`/scoreboard?teamA=Time A&teamB=Time B&pointsPerSet=${pointsPerSet}&numSets=5&gameType=quick`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">SetPoint</h1>

        {/* New Game Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-2xl p-12 mb-8 transition-colors shadow-lg"
        >
          <div className="text-8xl font-light">+</div>
        </button>

        {/* Saved Games Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Meus Jogos Salvos</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm min-h-32">{/* Empty state for saved games */}</div>
      </div>

      {/* First Modal - Game Type Selection */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowModal(false)
                setShowQuickGameModal(true)
              }}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl font-semibold py-6 rounded-xl mb-4 transition-colors"
            >
              Novo Jogo Rápido
            </button>
            <button
              onClick={() => router.push("/game-setup")}
              className="w-full border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-xl font-semibold py-6 rounded-xl transition-colors"
            >
              Campeonato
            </button>
          </div>
        </div>
      )}

      {showQuickGameModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setShowQuickGameModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pontos do Set</h2>

            <div className="mb-6">
              <label htmlFor="maxPoints" className="block text-gray-700 font-medium mb-3 text-lg">
                Definir pontuação máxima:
              </label>
              <input
                id="maxPoints"
                type="number"
                value={pointsPerSet}
                onChange={(e) => setPointsPerSet(Number(e.target.value))}
                className="w-full text-4xl font-bold text-center border-2 border-gray-300 rounded-xl p-4 focus:outline-none focus:border-teal-500"
                min="1"
              />
            </div>

            <button
              onClick={handleStartQuickGame}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xl font-semibold py-6 rounded-xl transition-colors"
            >
              Iniciar Jogo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}