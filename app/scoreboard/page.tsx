"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RefreshCcw, Home, RotateCw, Timer, X, ArrowLeftRight, Shirt, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface SetResult {
  scoreA: number
  scoreB: number
}

// Componente Visual da Camisa
const JerseyIcon = ({ number, position, isServer }: { number: string, position: number, isServer: boolean }) => (
  <div className="flex flex-col items-center justify-center relative group">
    <span className="absolute -top-4 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
      Pos {position}
    </span>
    
    <div className="relative flex items-center justify-center">
      <Shirt 
        className={`w-16 h-16 ${isServer ? "fill-yellow-100 text-yellow-600" : "fill-white text-gray-800"} stroke-[1.5] drop-shadow-md transition-all`} 
      />
      
      <span className="absolute text-xl font-black text-gray-900 tracking-tighter transform -translate-y-1">
        {number}
      </span>

      {isServer && (
        <div className="absolute -right-2 -bottom-1 bg-yellow-500 rounded-full p-1 animate-pulse">
          <span className="sr-only">Sacando</span>
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  </div>
)

// Componente da Quadra (Rotação)
const CourtRotation = ({ teamName, players, serverIndex }: { teamName: string, players: string[], serverIndex: number }) => {
  const getPlayerAtPos = (posOffset: number) => {
    const actualIndex = (serverIndex + posOffset) % players.length
    return players[actualIndex] || "?"
  }
  
  return (
    <Card className="p-4 bg-slate-50 border-2 border-slate-200 w-full max-w-sm mx-auto">
      <div className="text-center font-bold text-lg mb-4 text-slate-800 uppercase tracking-wider border-b pb-2 border-slate-200">
        {teamName}
      </div>
      
      <div className="grid grid-cols-3 gap-y-10 gap-x-4 py-4 relative">
        <div className="absolute -top-2 left-0 right-0 h-1 bg-slate-300/50 flex justify-center items-center">
          <span className="bg-slate-50 px-2 text-[10px] text-slate-400 font-medium">REDE / NET</span>
        </div>

        {/* Front Row (4, 3, 2) */}
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(3)} position={4} isServer={false} /></div>
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(2)} position={3} isServer={false} /></div>
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(1)} position={2} isServer={false} /></div>

        {/* Back Row (5, 6, 1) */}
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(4)} position={5} isServer={false} /></div>
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(5)} position={6} isServer={false} /></div>
        <div className="flex justify-center"><JerseyIcon number={getPlayerAtPos(0)} position={1} isServer={true} /></div>
      </div>
    </Card>
  )
}

export default function Scoreboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const teamAName = searchParams.get("teamA") || "Time A"
  const teamBName = searchParams.get("teamB") || "Time B"
  const targetScore = parseInt(searchParams.get("pointsPerSet") || "25", 10)
  const maxSets = parseInt(searchParams.get("numSets") || "5", 10)
  const gameType = searchParams.get("gameType") || "quick"
  
  const initialPlayersA = (searchParams.get("playersA") || "").split(",").filter(Boolean)
  const initialPlayersB = (searchParams.get("playersB") || "").split(",").filter(Boolean)
  const initialSubsA = (searchParams.get("subsA") || "").split(",").filter(Boolean)
  const initialSubsB = (searchParams.get("subsB") || "").split(",").filter(Boolean)
  
  const initialServerAStr = searchParams.get("serverA") || "0"
  const initialServerBStr = searchParams.get("serverB") || "0"

  const setsToWin = Math.ceil(maxSets / 2)

  const [isGameFinished, setIsGameFinished] = useState(false)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [setsA, setSetsA] = useState(0)
  const [setsB, setSetsB] = useState(0)
  const [servingTeam, setServingTeam] = useState<"A" | "B">("A")
  const [setHistory, setSetHistory] = useState<SetResult[]>([])

  const [courtA, setCourtA] = useState<string[]>(initialPlayersA.length ? initialPlayersA : ["1","2","3","4","5","6"])
  const [benchA, setBenchA] = useState<string[]>(initialSubsA)
  const [courtB, setCourtB] = useState<string[]>(initialPlayersB.length ? initialPlayersB : ["1","2","3","4","5","6"])
  const [benchB, setBenchB] = useState<string[]>(initialSubsB)

  const [subsCountA, setSubsCountA] = useState(0)
  const [subsCountB, setSubsCountB] = useState(0)
  
  const [showResetModal, setShowResetModal] = useState(false)
  const [showSubModal, setShowSubModal] = useState<"A" | "B" | null>(null)
  const [showRotationModal, setShowRotationModal] = useState(false)
  
  const [selectedOut, setSelectedOut] = useState<string | null>(null)
  const [selectedIn, setSelectedIn] = useState<string | null>(null)

  const [serverIndexA, setServerIndexA] = useState(() => {
    const idx = initialPlayersA.indexOf(initialServerAStr)
    return idx >= 0 ? idx : 0
  })
  const [serverIndexB, setServerIndexB] = useState(() => {
    const idx = initialPlayersB.indexOf(initialServerBStr)
    return idx >= 0 ? idx : 0
  })

  const [timeoutsA, setTimeoutsA] = useState(2)
  const [timeoutsB, setTimeoutsB] = useState(2)
  const [isTimeoutActive, setIsTimeoutActive] = useState(false)
  const [timeoutTimeLeft, setTimeoutTimeLeft] = useState(60)
  const [timeoutRequestingTeam, setTimeoutRequestingTeam] = useState<string>("")

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimeoutActive && timeoutTimeLeft > 0) {
      interval = setInterval(() => {
        setTimeoutTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeoutTimeLeft === 0) {
      setIsTimeoutActive(false)
    }
    return () => clearInterval(interval)
  }, [isTimeoutActive, timeoutTimeLeft])

  const handleSubstitution = () => {
    if (!selectedOut || !selectedIn || !showSubModal) return

    const isTeamA = showSubModal === "A"
    const currentCourt = isTeamA ? courtA : courtB
    const currentBench = isTeamA ? benchA : benchB
    const currentSubsCount = isTeamA ? subsCountA : subsCountB

    if (currentSubsCount >= 6) {
      alert("Limite de substituições (6) atingido neste set!")
      return
    }

    const newCourt = currentCourt.map(p => p === selectedOut ? selectedIn : p)
    const newBench = currentBench.filter(p => p !== selectedIn).concat(selectedOut)

    if (isTeamA) {
      setCourtA(newCourt)
      setBenchA(newBench)
      setSubsCountA(prev => prev + 1)
    } else {
      setCourtB(newCourt)
      setBenchB(newBench)
      setSubsCountB(prev => prev + 1)
    }

    setSelectedOut(null)
    setSelectedIn(null)
    setShowSubModal(null)
  }

  const handleTimeout = (team: "A" | "B") => {
    if (isGameFinished) return
    if (team === "A" && timeoutsA > 0) {
      setTimeoutsA(prev => prev - 1)
      startTimeoutCounter(teamAName)
    } else if (team === "B" && timeoutsB > 0) {
      setTimeoutsB(prev => prev - 1)
      startTimeoutCounter(teamBName)
    }
  }

  const startTimeoutCounter = (teamName: string) => {
    setTimeoutRequestingTeam(teamName)
    setTimeoutTimeLeft(60)
    setIsTimeoutActive(true)
  }

  const checkWinCondition = (scoreA: number, scoreB: number, target: number) => {
    const teamAWon = scoreA >= target && scoreA - scoreB >= 2
    const teamBWon = scoreB >= target && scoreB - scoreA >= 2
    return teamAWon || teamBWon
  }

  const addPoint = (teamWhoScored: "A" | "B") => {
    if (isGameFinished || isTimeoutActive) return
    if (checkWinCondition(scoreA, scoreB, targetScore)) return

    if (teamWhoScored === servingTeam) {
      if (teamWhoScored === "A") setScoreA(scoreA + 1)
      else setScoreB(scoreB + 1)
    } else {
      if (teamWhoScored === "A") {
        setScoreA(scoreA + 1)
        setServingTeam("A")
        setServerIndexA((prev) => (prev + 1) % (courtA.length || 1))
      } else {
        setScoreB(scoreB + 1)
        setServingTeam("B")
        setServerIndexB((prev) => (prev + 1) % (courtB.length || 1))
      }
    }
  }

  const subtractPoint = (team: "A" | "B") => {
    if (isTimeoutActive) return
    if (team === "A" && scoreA > 0) setScoreA(scoreA - 1)
    if (team === "B" && scoreB > 0) setScoreB(scoreB - 1)
  }

  const toggleServe = () => {
    setServingTeam(servingTeam === "A" ? "B" : "A")
  }

  const manualRotate = (team: "A" | "B") => {
    if (team === "A") setServerIndexA((prev) => (prev + 1) % (courtA.length || 1))
    else setServerIndexB((prev) => (prev + 1) % (courtB.length || 1))
  }

  const finishGame = (finalSetsA: number, finalSetsB: number, finalHistory: SetResult[]) => {
    const matchData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      teamA: teamAName,
      teamB: teamBName,
      setsA: finalSetsA,
      setsB: finalSetsB,
      winner: finalSetsA > finalSetsB ? teamAName : teamBName,
      setHistory: finalHistory,
      gameType: gameType === "championship" ? "Campeonato" : "Rápido",
      playersA: initialPlayersA,
      subsA: initialSubsA,
      playersB: initialPlayersB,
      subsB: initialSubsB
    }

    const existingHistory = JSON.parse(localStorage.getItem("match-history") || "[]")
    localStorage.setItem("match-history", JSON.stringify([matchData, ...existingHistory]))

    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const awardSetToTeam = (team: "A" | "B") => {
    if (isGameFinished) return

    const isWinningSetA = team === "A" && setsA + 1 === setsToWin
    const isWinningSetB = team === "B" && setsB + 1 === setsToWin

    if (isWinningSetA || isWinningSetB) {
      const winnerName = isWinningSetA ? teamAName : teamBName
      const confirmed = window.confirm(`Confirmar vitória da partida para ${winnerName}?`)
      if (!confirmed) return
    }

    const currentSetResult = { scoreA, scoreB }
    const updatedHistory = [...setHistory, currentSetResult]
    setSetHistory(updatedHistory)

    let newSetsA = setsA
    let newSetsB = setsB

    if (team === "A") {
      newSetsA = setsA + 1
      setSetsA(newSetsA)
    } else {
      newSetsB = setsB + 1
      setSetsB(newSetsB)
    }

    if (newSetsA === setsToWin || newSetsB === setsToWin) {
      setIsGameFinished(true)
      finishGame(newSetsA, newSetsB, updatedHistory)
    } else {
      setScoreA(0)
      setScoreB(0)
      setTimeoutsA(2)
      setTimeoutsB(2)
      setSubsCountA(0)
      setSubsCountB(0)
    }
  }

  const handleResetMatch = () => {
    if (confirm("TEM CERTEZA? Todo o progresso será perdido.")) {
      setScoreA(0)
      setScoreB(0)
      setSetsA(0)
      setSetsB(0)
      setSetHistory([])
      setTimeoutsA(2)
      setTimeoutsB(2)
      setSubsCountA(0)
      setSubsCountB(0)
      setIsGameFinished(false)
    }
    setShowResetModal(false)
  }

  const currentPlayerNumberA = courtA.length > 0 ? courtA[serverIndexA] : "?"
  const currentPlayerNumberB = courtB.length > 0 ? courtB[serverIndexB] : "?"

  return (
    <div className="min-h-screen w-screen bg-black overflow-hidden fixed inset-0">
      <div className={`
        w-full h-full flex items-center justify-center
        md:relative 
        origin-center 
        md:transform-none
        ${isMobile ? 'rotate-90 w-[100vh] h-[100vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
      `}>
        
        {/* Controles Superiores */}
        <div className="absolute top-4 left-4 z-30 flex gap-2">
          <button onClick={() => router.push("/")} className="text-white/70 hover:text-white p-2 bg-gray-900/50 rounded-md">
            <Home size={20} />
          </button>
          <button onClick={() => setShowResetModal(true)} className="text-white/70 hover:text-white p-2 bg-gray-900/50 rounded-md">
            <RefreshCcw size={20} />
          </button>
        </div>

        {/* Placar - Layout Lado a Lado */}
        <div className="w-full h-full flex flex-row">
          
          {/* Time A (Esquerda) */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black border-r-4 border-blue-500/30 relative h-full">
            {servingTeam === "A" && !isGameFinished && (
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-pulse" />
            )}
            
            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={() => handleTimeout("A")} 
                  disabled={timeoutsA === 0 || isGameFinished}
                  className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 text-xs font-bold"
                >
                  <Timer size={14} /> TEMPO
                </button>
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${timeoutsA >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${timeoutsA >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`} />
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={() => setShowSubModal("A")} 
                  disabled={subsCountA >= 6 || isGameFinished}
                  className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 text-xs font-bold"
                >
                  <ArrowLeftRight size={14} /> SUB
                </button>
                <span className="text-[10px] text-gray-400 font-mono">{subsCountA}/6</span>
              </div>
            </div>

            <h2 className="text-white text-xl md:text-4xl font-bold mb-2 text-center px-4 truncate w-full">{teamAName}</h2>
            
            <div className="flex items-center gap-2 mb-2 md:mb-6">
              <div onClick={toggleServe} className={`text-sm md:text-lg font-semibold cursor-pointer transition-all ${servingTeam === "A" ? "text-blue-400 scale-110" : "text-white/30"}`}>
                {servingTeam === "A" && "🏐"} SAQUE: N° <span className="text-lg md:text-2xl">{currentPlayerNumberA}</span>
              </div>
              <button onClick={() => manualRotate("A")} className="text-white/20 hover:text-blue-400 p-1" title="Rodar manualmente">
                <RotateCw size={14} />
              </button>
            </div>

            <div className="text-blue-500 text-[8rem] md:text-[14rem] font-bold mb-4 md:mb-8 leading-none select-none">{scoreA}</div>
            
            <div className="flex gap-4 z-10">
              <button onClick={() => addPoint("A")} className="bg-blue-600 active:bg-blue-700 text-white text-3xl md:text-4xl font-bold w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg hover:scale-105 transition-transform touch-manipulation">+</button>
              <button onClick={() => subtractPoint("A")} className="bg-gray-800 active:bg-gray-700 text-white text-3xl md:text-4xl font-bold w-12 h-12 md:w-20 md:h-20 rounded-full shadow-lg hover:scale-105 transition-transform touch-manipulation">−</button>
            </div>
          </div>

          {/* Time B (Direita) */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black border-l-4 border-orange-500/30 relative h-full">
            {servingTeam === "B" && !isGameFinished && (
              <div className="absolute inset-0 bg-orange-500/5 pointer-events-none animate-pulse" />
            )}

            <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-20 pl-16 md:pl-0">
              <div className="flex flex-col items-start gap-1">
                <button 
                  onClick={() => handleTimeout("B")} 
                  disabled={timeoutsB === 0 || isGameFinished}
                  className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 text-xs font-bold"
                >
                  <Timer size={14} /> TEMPO
                </button>
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${timeoutsB >= 1 ? 'bg-orange-500' : 'bg-gray-700'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${timeoutsB >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`} />
                </div>
              </div>

              <div className="flex flex-col items-start gap-1">
                <button 
                  onClick={() => setShowSubModal("B")} 
                  disabled={subsCountB >= 6 || isGameFinished}
                  className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 text-xs font-bold"
                >
                  <ArrowLeftRight size={14} /> SUB
                </button>
                <span className="text-[10px] text-gray-400 font-mono">{subsCountB}/6</span>
              </div>
            </div>

            <h2 className="text-white text-xl md:text-4xl font-bold mb-2 text-center px-4 truncate w-full">{teamBName}</h2>
            
            <div className="flex items-center gap-2 mb-2 md:mb-6">
              <div onClick={toggleServe} className={`text-sm md:text-lg font-semibold cursor-pointer transition-all ${servingTeam === "B" ? "text-orange-400 scale-110" : "text-white/30"}`}>
                {servingTeam === "B" && "🏐"} SAQUE: N° <span className="text-lg md:text-2xl">{currentPlayerNumberB}</span>
              </div>
              <button onClick={() => manualRotate("B")} className="text-white/20 hover:text-orange-400 p-1" title="Rodar manualmente">
                <RotateCw size={14} />
              </button>
            </div>

            <div className="text-orange-500 text-[8rem] md:text-[14rem] font-bold mb-4 md:mb-8 leading-none select-none">{scoreB}</div>
            
            <div className="flex gap-4 z-10">
              <button onClick={() => addPoint("B")} className="bg-orange-600 active:bg-orange-700 text-white text-3xl md:text-4xl font-bold w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg hover:scale-105 transition-transform touch-manipulation">+</button>
              <button onClick={() => subtractPoint("B")} className="bg-gray-800 active:bg-gray-700 text-white text-3xl md:text-4xl font-bold w-12 h-12 md:w-20 md:h-20 rounded-full shadow-lg hover:scale-105 transition-transform touch-manipulation">−</button>
            </div>
          </div>
        </div>

        {/* Painel Central Flutuante (REDUZIDO) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto z-20 pointer-events-none">
          <div className="bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-xl border border-gray-700/50 flex flex-col items-center gap-1 pointer-events-auto">
            {isGameFinished ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="text-green-400 font-bold text-lg mb-1">FIM</div>
                <div className="text-white text-[10px]">Salvando...</div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between w-full gap-3">
                  <button onClick={() => awardSetToTeam("A")} className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 text-[10px] font-bold py-1 px-2 rounded hover:scale-105 transition-all">SET A</button>
                  <div className="text-center">
                    <div className="text-2xl font-bold tracking-widest leading-none">{setsA} - {setsB}</div>
                    <div className="text-[8px] text-gray-400 uppercase tracking-wider">Sets</div>
                  </div>
                  <button onClick={() => awardSetToTeam("B")} className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 border border-orange-500/50 text-[10px] font-bold py-1 px-2 rounded hover:scale-105 transition-all">SET B</button>
                </div>
                {setHistory.length > 0 && (
                  <>
                    <div className="h-px w-full bg-gray-700 my-1" />
                    <div className="flex gap-1 text-[9px] text-gray-400 overflow-x-auto max-w-[120px] justify-center">
                      {setHistory.map((set, i) => (
                        <span key={i} className="bg-gray-800 px-1 rounded">{set.scoreA}-{set.scoreB}</span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* BOTÃO DE ROTAÇÃO (MOVIDO PARA BAIXO E CENTRALIZADO) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <button 
            onClick={() => setShowRotationModal(true)} 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg border border-white/10 active:scale-95"
          >
            <Eye size={16} />
            VER ROTAÇÃO
          </button>
        </div>

        {/* OVERLAY DE TEMPO TÉCNICO */}
        {isTimeoutActive && (
          <div className={`fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 animate-in fade-in duration-200 ${isMobile ? '-rotate-90 w-[100vh] h-[100vw]' : ''}`}>
            <div className="text-white/50 font-semibold text-xl mb-4">TEMPO SOLICITADO POR</div>
            <div className="text-white font-bold text-4xl md:text-6xl mb-12 text-center px-4">
              {timeoutRequestingTeam}
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 rounded-full border-4 border-white/10 animate-pulse"></div>
              <div className="text-[8rem] md:text-[12rem] font-mono font-bold text-white tabular-nums leading-none">
                {timeoutTimeLeft}
              </div>
            </div>
            <button onClick={() => setIsTimeoutActive(false)} className="mt-12 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors">
              <X size={24} /> <span className="font-semibold">Encerrar Tempo</span>
            </button>
          </div>
        )}

        {/* MODAL DE ROTAÇÃO VISUAL */}
        <Dialog open={showRotationModal} onOpenChange={setShowRotationModal}>
          <DialogContent className="max-w-4xl bg-white text-black max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl md:text-2xl">Rotação em Quadra</DialogTitle>
              <DialogDescription className="text-center text-xs md:text-base">
                Posicionamento atual (Rede no Topo)
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-4">
              <CourtRotation teamName={teamAName} players={courtA} serverIndex={serverIndexA} />
              <CourtRotation teamName={teamBName} players={courtB} serverIndex={serverIndexB} />
            </div>
            <DialogFooter>
              <Button onClick={() => setShowRotationModal(false)} className="w-full">Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL DE SUBSTITUIÇÃO */}
        <Dialog open={!!showSubModal} onOpenChange={() => setShowSubModal(null)}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Substituição - {showSubModal === "A" ? teamAName : teamBName}</DialogTitle>
              <DialogDescription className="text-center text-gray-400">
                Selecione quem sai e quem entra.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-400 text-center">SAI (Quadra)</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(showSubModal === "A" ? courtA : courtB).map((player, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOut(player)}
                      className={`p-2 rounded-md border ${selectedOut === player ? "border-red-500 bg-red-500/20 text-white" : "border-gray-700 bg-gray-800 text-gray-300"} transition-all hover:bg-gray-700`}
                    >
                      #{player} (Pos {((idx - (showSubModal === "A" ? serverIndexA : serverIndexB) + 6) % 6) + 1})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-400 text-center">ENTRA (Banco)</h4>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {(showSubModal === "A" ? benchA : benchB).length > 0 ? (
                    (showSubModal === "A" ? benchA : benchB).map((player, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIn(player)}
                        className={`p-2 rounded-md border ${selectedIn === player ? "border-green-500 bg-green-500/20 text-white" : "border-gray-700 bg-gray-800 text-gray-300"} transition-all hover:bg-gray-700`}
                      >
                        #{player}
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-4">Sem reservas</div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button 
                onClick={handleSubstitution} 
                disabled={!selectedOut || !selectedIn}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold"
              >
                Confirmar Troca
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Reset */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowResetModal(false)}>
            <div className="bg-gray-900 text-white rounded-xl p-6 max-w-xs w-full border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-center mb-4">Reiniciar Jogo?</h2>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setScoreA(0); setScoreB(0); setShowResetModal(false); }} className="bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold">Zerar Pontos do Set</button>
                <button onClick={handleResetMatch} className="bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold">Reiniciar Partida Inteira</button>
                <button onClick={() => setShowResetModal(false)} className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg mt-2">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}