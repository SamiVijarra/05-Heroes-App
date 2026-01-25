import {
  Heart,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { useState } from "react"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs"
import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.action"
import { useQuery } from "@tanstack/react-query"



export const HomePage = () => {
  
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'heroes' | 'villains'>('all');
  
  const { data: heroesResponse } = useQuery({
    queryKey: ['heroes'],
    queryFn: () => getHeroesByPageAction(),
    staleTime: 1000 * 60 * 5,
  });
  console.log({ heroesResponse });


  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Unisverso de SuperHéroes"
          description="Descubre, explora y administra superhéroes y villanos"
        />
        <CustomBreadcrumbs currentPage="SuperHéroes"/>

        {/* Stats Dashboard */}
        <HeroStats/>

        {/* Controls */}

        {/* Advanced Filters */}
        
        {/* Tabs */}
        <Tabs value={activeTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => setActiveTab('all')}>All Characters (16)</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2"
            onClick={() => setActiveTab('favorites')}>
              <Heart className="h-4 w-4" />
              Favorites (3)
            </TabsTrigger>
            <TabsTrigger value="heroes" onClick={() => setActiveTab('heroes')}>Heroes (12)</TabsTrigger>
            <TabsTrigger value="villains" onClick={() => setActiveTab('villains')}>Villains (2)</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="favorites">
            <h1>Favorites</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []}/>
          </TabsContent>
          <TabsContent value='heroes'>
            <h1>Heroes</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []}/>
          </TabsContent>
          <TabsContent value='villains'>
            <h1>Villains</h1>
            <HeroGrid heroes={heroesResponse?.heroes ?? []}/>
          </TabsContent>
        </Tabs>
        {/* Pagination */}
        <CustomPagination totalPages={8}/>
      </>
    </>
  )
}
