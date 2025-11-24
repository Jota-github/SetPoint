"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trophy, Users, Play, Volleyball, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function GameSetup() {
  const router = useRouter()
  const [teamAName, setTeamAName] = useState("")
  const [teamBName, setTeamBName] = useState("")
  // Inicializando com valores padrão comuns, mas como string para edição
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
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4 md:p-8 relative">
      {/* Botão Voltar */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-4 md:top-8 md:left-8 hover:bg-background/50"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <Card className="w-full max-w-lg shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Configurar Partida</CardTitle>
          <CardDescription>
            Defina os times e as regras personalizadas para o jogo.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Seção dos Times */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Identificação dos Times</span>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teamA">Nome do Time A (Casa)</Label>
                  <Input
                    id="teamA"
                    value={teamAName}
                    onChange={(e) => setTeamAName(e.target.value)}
                    placeholder="Ex: Águias do Vôlei"
                    className="focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamB">Nome do Time B (Visitante)</Label>
                  <Input
                    id="teamB"
                    value={teamBName}
                    onChange={(e) => setTeamBName(e.target.value)}
                    placeholder="Ex: Trovão Azul"
                    className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção das Regras (AGORA EDITÁVEL) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Volleyball className="w-4 h-4" />
                <span>Regras do Jogo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Sets */}
                <div className="grid gap-2">
                  <Label htmlFor="numSets">Máximo de Sets</Label>
                  <Input
                    id="numSets"
                    type="number"
                    min="1"
                    max="99"
                    value={numSets}
                    onChange={(e) => setNumSets(e.target.value)}
                    placeholder="Ex: 3, 5"
                    className="focus-visible:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Ex: 3 para "Melhor de 3"</p>
                </div>

                {/* Input Pontos */}
                <div className="grid gap-2">
                  <Label htmlFor="pointsPerSet">Pontos por Set</Label>
                  <Input
                    id="pointsPerSet"
                    type="number"
                    min="1"
                    max="999"
                    value={pointsPerSet}
                    onChange={(e) => setPointsPerSet(e.target.value)}
                    placeholder="Ex: 25"
                    className="focus-visible:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Pontuação alvo do set</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção do Saque */}
            <div className="space-y-3">
              <Label className="text-base">Quem começa sacando?</Label>
              <RadioGroup 
                value={firstServe} 
                onValueChange={setFirstServe} 
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="A" id="serve-a" className="peer sr-only" />
                  <Label
                    htmlFor="serve-a"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all text-center h-full"
                  >
                    <span className="text-lg font-bold mb-1">Time A</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{teamAName || "Indefinido"}</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="B" id="serve-b" className="peer sr-only" />
                  <Label
                    htmlFor="serve-b"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-500 cursor-pointer transition-all text-center h-full"
                  >
                    <span className="text-lg font-bold mb-1">Time B</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{teamBName || "Indefinido"}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

          </CardContent>
          <CardFooter className="pt-2 pb-8">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg h-12 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Avançar para Escalação
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}