"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Trophy, Trash2, History, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MatchHistory {
  id: string
  date: string
  teamA: string
  teamB: string
  setsA: number
  setsB: number
  winner: string
  gameType: string
  setHistory: Array<{ scoreA: number; scoreB: number }>
  playersA?: string[]
  subsA?: string[]
  playersB?: string[]
  subsB?: string[]
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showQuickGameModal, setShowQuickGameModal] = useState(false)
  const [pointsPerSet, setPointsPerSet] = useState(25)
  const [history, setHistory] = useState<MatchHistory[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedHistory = localStorage.getItem("match-history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Erro ao carregar histórico", e)
      }
    }
  }, [])

  const clearHistory = () => {
    if (confirm("Deseja apagar todo o histórico de jogos?")) {
      localStorage.removeItem("match-history")
      setHistory([])
    }
  }

  const handleStartQuickGame = () => {
    router.push(`/scoreboard?teamA=Time A&teamB=Time B&pointsPerSet=${pointsPerSet}&numSets=5&gameType=quick`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  const printMatch = (match: MatchHistory) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <html>
        <head>
          <title>Súmula - ${match.teamA} vs ${match.teamB}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .subtitle { color: #666; margin-top: 5px; }
            
            .score-box { display: flex; justify-content: center; align-items: center; gap: 40px; margin: 30px 0; font-size: 20px; }
            .team-score { text-align: center; }
            .big-score { font-size: 48px; font-weight: bold; }
            
            .sets-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .sets-table th, .sets-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
            .sets-table th { background-color: #f5f5f5; }
            
            .rosters { display: flex; gap: 30px; }
            .team-list { flex: 1; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
            .team-list h3 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .player-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
            .player-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: bold; }
            .sub-tag { background: #e0e0e0; color: #666; }
            
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">SÚMULA DE JOGO - SETPOINT</h1>
            <p class="subtitle">${formatDate(match.date)} • ${match.gameType}</p>
          </div>

          <div class="score-box">
            <div class="team-score">
              <div>${match.teamA}</div>
              <div class="big-score">${match.setsA}</div>
            </div>
            <div>X</div>
            <div class="team-score">
              <div>${match.teamB}</div>
              <div class="big-score">${match.setsB}</div>
            </div>
          </div>

          <table class="sets-table">
            <thead>
              <tr>
                <th>Equipes</th>
                ${match.setHistory.map((_, i) => `<th>Set ${i + 1}</th>`).join('')}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:bold">${match.teamA}</td>
                ${match.setHistory.map(s => `<td>${s.scoreA}</td>`).join('')}
                <td>${match.setHistory.reduce((a, b) => a + b.scoreA, 0)} pts</td>
              </tr>
              <tr>
                <td style="font-weight:bold">${match.teamB}</td>
                ${match.setHistory.map(s => `<td>${s.scoreB}</td>`).join('')}
                <td>${match.setHistory.reduce((a, b) => a + b.scoreB, 0)} pts</td>
              </tr>
            </tbody>
          </table>

          <div class="rosters">
            <div class="team-list">
              <h3>${match.teamA}</h3>
              <p><strong>Titulares:</strong></p>
              <ul class="player-list">
                ${(match.playersA && match.playersA.length > 0) ? match.playersA.map(p => `<li class="player-tag">#${p}</li>`).join('') : '<li>Sem informação</li>'}
              </ul>
              <p style="margin-top:15px"><strong>Reservas:</strong></p>
              <ul class="player-list">
                ${(match.subsA && match.subsA.length > 0) ? match.subsA.map(p => `<li class="player-tag sub-tag">#${p}</li>`).join('') : '<li>-</li>'}
              </ul>
            </div>
            <div class="team-list">
              <h3>${match.teamB}</h3>
              <p><strong>Titulares:</strong></p>
              <ul class="player-list">
                ${(match.playersB && match.playersB.length > 0) ? match.playersB.map(p => `<li class="player-tag">#${p}</li>`).join('') : '<li>Sem informação</li>'}
              </ul>
              <p style="margin-top:15px"><strong>Reservas:</strong></p>
              <ul class="player-list">
                ${(match.subsB && match.subsB.length > 0) ? match.subsB.map(p => `<li class="player-tag sub-tag">#${p}</li>`).join('') : '<li>-</li>'}
              </ul>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">SetPoint</h1>
          <p className="text-muted-foreground text-lg">Marcador de Vôlei Profissional</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl p-8 shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center gap-3 group"
            >
              <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold">Novo Jogo</span>
            </button>
            
            <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col justify-center items-center text-center gap-2">
              <span className="text-4xl font-bold text-primary">{history.length}</span>
              <span className="text-muted-foreground font-medium">Partidas Jogadas</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="w-5 h-5" /> Histórico de Partidas
            </h2>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" /> Limpar
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Nenhuma partida registrada ainda.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-background">{match.gameType}</Badge>
                      
                      {/* AQUI ESTÁ O BOTÃO DE IMPRIMIR */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => printMatch(match)} 
                          className="h-7 text-xs gap-1.5 border-primary/20 hover:bg-primary/5 hover:text-primary"
                        >
                          <Printer className="w-3.5 h-3.5" /> 
                          Súmula
                        </Button>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                          <Calendar className="w-3 h-3" /> {formatDate(match.date)}
                        </span>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex-1 text-center ${match.winner === match.teamA ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        <div className="text-lg md:text-xl">{match.teamA}</div>
                        {match.winner === match.teamA && <Badge className="mt-1 text-[10px] h-5">Vencedor</Badge>}
                      </div>

                      <div className="px-4 flex flex-col items-center">
                        <div className="text-3xl font-bold text-foreground">
                          {match.setsA} - {match.setsB}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Sets</div>
                      </div>

                      <div className={`flex-1 text-center ${match.winner === match.teamB ? "text-orange-500 font-bold" : "text-muted-foreground"}`}>
                        <div className="text-lg md:text-xl">{match.teamB}</div>
                        {match.winner === match.teamB && <Badge variant="secondary" className="mt-1 text-[10px] h-5 text-orange-600 bg-orange-100">Vencedor</Badge>}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-center gap-2 flex-wrap">
                      {match.setHistory.map((set, index) => (
                        <div key={index} className="flex flex-col items-center bg-muted/50 px-3 py-1.5 rounded-md min-w-[60px]">
                          <span className="text-[10px] text-muted-foreground mb-1">Set {index + 1}</span>
                          <span className="text-sm font-mono font-medium">
                            {set.scoreA}-{set.scoreB}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center mb-2">Escolha o Modo</h3>
            <button
              onClick={() => {
                setShowModal(false)
                setShowQuickGameModal(true)
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Jogo Rápido
            </button>
            <button
              onClick={() => router.push("/game-setup")}
              className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-4 rounded-xl transition-colors"
            >
              Campeonato
            </button>
          </div>
        </div>
      )}

      {showQuickGameModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 backdrop-blur-sm"
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
                className="w-full text-4xl font-bold text-center border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                min="1"
              />
            </div>

            <button
              onClick={handleStartQuickGame}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xl font-semibold py-4 rounded-xl transition-colors shadow-lg"
            >
              Iniciar Jogo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}