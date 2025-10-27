"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// --- MUDANÇA AQUI ---
// 1. Importar o ícone de 'Refresh' (Reiniciar)
import { RefreshCcw } from "lucide-react"

export default function Scoreboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const teamAName = searchParams.get("teamA") || "Time A"
  const teamBName = searchParams.get("teamB") || "Time B"
  const targetScore = parseInt(searchParams.get("pointsPerSet") || "25", 10)
  const maxSets = parseInt(searchParams.get("numSets") || "5", 10)
  const setsToWin = Math.ceil(maxSets / 2)
  const gameType = searchParams.get("gameType") || "quick"

  const [isGameFinished, setIsGameFinished] = useState(false)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [setsA, setSetsA] = useState(0)
  const [setsB, setSetsB] = useState(0)
  const [servingTeam, setServingTeam] = useState<"A" | "B">("A")
  const [serverNumberA, setServerNumberA] = useState(7)
  const [serverNumberB, setServerNumberB] = useState(3)

  // --- MUDANÇA AQUI ---
  // 2. Estado para controlar o modal de reinicialização
  const [showResetModal, setShowResetModal] = useState(false)
  // --- FIM DA MUDANÇA ---

  const checkWinCondition = (scoreA: number, scoreB: number, target: number) => {
    const teamAWon = scoreA >= target && scoreA - scoreB >= 2
    const teamBWon = scoreB >= target && scoreB - scoreA >= 2
    return teamAWon || teamBWon
  }

  const addPoint = (team: "A" | "B") => {
    if (isGameFinished) return
    if (checkWinCondition(scoreA, scoreB, targetScore)) return

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

  const awardSetToTeam = (team: "A" | "B") => {
    if (isGameFinished) return

    const isWinningSetA = team === "A" && setsA + 1 === setsToWin
    const isWinningSetB = team === "B" && setsB + 1 === setsToWin

    if (isWinningSetA || isWinningSetB) {
      const winnerName = isWinningSetA ? teamAName : teamBName
      const confirmed = window.confirm(
        `Confirmar set para ${winnerName}?\n\nIsso encerrará a partida.`
      )
      if (!confirmed) return
    }

    if (team === "A") {
      const newSetsA = setsA + 1
      setSetsA(newSetsA)
      if (newSetsA === setsToWin) setIsGameFinished(true)
    } else {
      const newSetsB = setsB + 1
      setSetsB(newSetsB)
      if (newSetsB === setsToWin) setIsGameFinished(true)
    }
    setScoreA(0)
    setScoreB(0)
  }

  // --- NOVAS FUNÇÕES ---
  // 3. Função para reiniciar apenas os pontos do set atual
  const handleResetSet = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja reiniciar a contagem deste set?\nOs pontos voltarão a 0-0."
    )
    if (confirmed) {
      setScoreA(0)
      setScoreB(0)
    }
    setShowResetModal(false) // Fecha o modal independentemente da escolha
  }

  // 4. Função para reiniciar a partida inteira
  const handleResetMatch = () => {
    const confirmed = window.confirm(
      "TEM CERTEZA QUE DESEJA REINICIAR A PARTIDA?\nTodo o progresso (sets e pontos) será perdido."
    )
    if (confirmed) {
      setScoreA(0)
      setScoreB(0)
      setSetsA(0)
      setSetsB(0)
      setIsGameFinished(false)
    }
    setShowResetModal(false) // Fecha o modal independentemente da escolha
  }
  // --- FIM DAS NOVAS FUNÇÕES ---

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* --- MUDANÇA AQUI --- */}
      {/* 5. Agrupar botões de Voltar e Reiniciar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => router.push("/")}
          className="text-white/70 hover:text-white text-sm py-2 px-3 bg-gray-900/50 rounded-md"
        >
          ← Voltar
        </button>
        <button
          onClick={() => setShowResetModal(true)} // Abre o modal
          className="text-white/70 hover:text-white text-sm p-2 bg-gray-900/50 rounded-md"
          aria-label="Reiniciar partida"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
      {/* --- FIM DA MUDANÇA --- */}

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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl border border-gray-700 w-80 sm:w-96">
        <div className="text-center">
          <div className="flex items-center justify-between text-2xl font-bold mb-1">
            <button
              onClick={() => awardSetToTeam("A")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors"
              aria-label="Dar set para Time A"
              disabled={isGameFinished}
            >
              + SET
            </button>
            <span className="text-base sm:text-2xl">
              Sets: {setsA} - {setsB}{" "}
              {gameType === "championship" && `(Melhor de ${maxSets})`}
            </span>
            <button
              onClick={() => awardSetToTeam("B")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors"
              aria-label="Dar set para Time B"
              disabled={isGameFinished}
            >
              + SET
            </button>
          </div>
          <div className="text-sm text-gray-400">Jogando até: {targetScore}</div>
          {isGameFinished && (
            <div className="text-lg font-bold text-green-400 mt-2">
              FIM DE JOGO
            </div>
          )}
        </div>
      </div>

      {/* --- MUDANÇA AQUI --- */}
      {/* 6. Modal de Reinicialização */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowResetModal(false)} // Fecha o modal ao clicar fora
        >
          <div
            className="bg-gray-800 text-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
          >
            <h2 className="text-2xl font-bold text-center mb-6">Reiniciar</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleResetSet}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-semibold py-4 rounded-xl transition-colors"
              >
                Reiniciar Contagem do Set
              </button>
              <button
                onClick={handleResetMatch}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-4 rounded-xl transition-colors"
              >
                Reiniciar Partida Inteira
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- FIM DA MUDANÇA --- */}
    </div>
  )
}