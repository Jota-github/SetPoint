"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Play, Plus, Shirt, Trash2, User, Volleyball } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

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
    starters: Array(6).fill(null).map(() => ({ number: "", name: "" })) as Player[],
    substitutes: [] as Player[],
    firstServer: 0,
  })
  const [teamB, setTeamB] = useState({
    starters: Array(6).fill(null).map(() => ({ number: "", name: "" })) as Player[],
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

  const removeSubstitute = (index: number) => {
    const newSubstitutes = currentTeam.substitutes.filter((_, i) => i !== index)
    setCurrentTeam({ ...currentTeam, substitutes: newSubstitutes })
  }

  const setFirstServer = (index: number) => {
    setCurrentTeam({ ...currentTeam, firstServer: index })
  }

  const handleSave = () => {
    const serverANumber = teamA.starters[teamA.firstServer]?.number || "?"
    const serverBNumber = teamB.starters[teamB.firstServer]?.number || "?"

    // --- MUDANÇA AQUI: Criando listas de números separados por vírgula ---
    const playersAList = teamA.starters.map(p => p.number || "?").join(",")
    const playersBList = teamB.starters.map(p => p.number || "?").join(",")

    const params = new URLSearchParams({
      teamA: teamAName,
      teamB: teamBName,
      numSets: numSets,
      pointsPerSet: pointsPerSet,
      gameType: "championship",
      serverA: serverANumber,
      serverB: serverBNumber,
      playersA: playersAList, // Lista Time A
      playersB: playersBList  // Lista Time B
    })
    router.push(`/scoreboard?${params.toString()}`)
  }

  const renderTeamForm = (teamType: "A" | "B") => {
    const teamData = teamType === "A" ? teamA : teamB
    const isCurrent = activeTab === teamType
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Shirt className="w-4 h-4" /> Titulares (Ordem de Rodízio)
            </Label>
            <Badge variant="outline" className="text-xs font-normal bg-muted/50">
              Selecione quem começa sacando
            </Badge>
          </div>
          
          <div className="grid gap-3">
            {teamData.starters.map((player, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="relative">
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-50 w-4 text-right select-none">
                    {index + 1}
                  </span>
                  <Input
                    type="number"
                    value={player.number}
                    onChange={(e) => isCurrent && updateStarter(index, "number", e.target.value)}
                    className="w-16 text-center font-mono font-medium"
                    placeholder="Nº"
                    min="0"
                    max="99"
                  />
                </div>
                <Input
                  type="text"
                  value={player.name}
                  onChange={(e) => isCurrent && updateStarter(index, "name", e.target.value)}
                  className="flex-1"
                  placeholder={`Jogador posição ${index + 1}`}
                />
                <Button
                  type="button"
                  variant={teamData.firstServer === index ? "default" : "outline"}
                  size="icon"
                  className={`shrink-0 transition-all ${
                    teamData.firstServer === index 
                      ? (teamType === "A" ? "bg-primary hover:bg-primary/90" : "bg-orange-500 hover:bg-orange-600 text-white hover:text-white") 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => isCurrent && setFirstServer(index)}
                  title="Definir como primeiro sacador"
                >
                  <Volleyball className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4" /> Reservas
          </Label>
          
          <div className="grid gap-3">
            {teamData.substitutes.map((substitute, index) => (
              <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                <Input
                  type="number"
                  value={substitute.number}
                  onChange={(e) => isCurrent && updateSubstitute(index, "number", e.target.value)}
                  className="w-16 text-center font-mono"
                  placeholder="Nº"
                  min="0"
                  max="99"
                />
                <Input
                  type="text"
                  value={substitute.name}
                  onChange={(e) => isCurrent && updateSubstitute(index, "name", e.target.value)}
                  className="flex-1"
                  placeholder="Nome do Reserva"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => isCurrent && removeSubstitute(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed hover:border-primary hover:text-primary transition-colors"
            onClick={() => isCurrent && addSubstitute()}
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar Reserva
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4 md:p-8 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-4 md:top-8 md:left-8 hover:bg-background/50 z-10"
        onClick={() => router.back()}
        title="Voltar"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-muted w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Escalação dos Times</CardTitle>
          <CardDescription>
            A ordem abaixo definirá o rodízio do saque.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "A" | "B")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="A" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-semibold"
              >
                {teamAName}
              </TabsTrigger>
              <TabsTrigger 
                value="B"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all font-semibold"
              >
                {teamBName}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="A" className="mt-0">
              {renderTeamForm("A")}
            </TabsContent>
            
            <TabsContent value="B" className="mt-0">
              {renderTeamForm("B")}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="p-6 pt-2 bg-muted/20 border-t rounded-b-xl">
          <Button 
            onClick={handleSave} 
            size="lg" 
            className="w-full text-lg h-12 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Iniciar Jogo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}