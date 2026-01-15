import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";

export const SearchPage = () => {
  return (
    <>
      <CustomJumbotron
                title="Búsqueda de SuperHéroes"
                description="Descubre, explora y administra superhéroes y villanos"
      />
      <CustomBreadcrumbs currentPage="Buscador de Héroes"
        breadcrumbs={[
          { label: 'Home1', to: '/' },
          { label: 'Home2', to: '/'},
          { label: 'Home3', to: '/'},
      ]}/>
      <HeroStats />
      <SearchControls/>
    </>
  );
};

export default SearchPage