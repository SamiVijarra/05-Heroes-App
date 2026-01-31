import { use, useMemo } from "react"
import { useSearchParams } from "react-router"

import {
  Heart,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"

import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs"

import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { FavoriteHeroContext } from "@/heroes/contex/FavoriteHeroContext"




export const HomePage = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const {favoriteCount, favorites} = use(FavoriteHeroContext);

  const activeTab = searchParams.get('tab') ?? 'all';

  const page = searchParams.get('page') ?? '1';

  const limit = searchParams.get('limit') ?? '6';

  const category = searchParams.get('category') ?? 'all';

  const selectedTab = useMemo(() => {
  const validTabs = ['all', 'favorites', 'heroes', 'villains'];
    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab]);
  
  const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);

  const {data: summary} = useHeroSummary();


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
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'all');
                  prev.set('category', 'all');
                  prev.set('page', '1');
                return prev;
                })
              }
            >
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              value="favorites" 
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'favorites');
                return prev;
                })
              }
            >
              <Heart className="h-4 w-4" />
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              value="heroes"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'heroes');
                  prev.set('category', 'hero');
                  prev.set('page', '1');
                return prev;
                })
              }
            >
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('tab', 'villains');
                  prev.set('category', 'villain');
                  prev.set('page', '1');
                return prev;
                })
              }
            >
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="favorites">
            <h1>Favorites</h1>
            <HeroGrid heroes={favorites}/>
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
        {
          selectedTab !== 'favorites' && (
            <CustomPagination totalPages={heroesResponse?.pages ?? 1}/>
          )
        }
        
      </>
    </>
  )
}
