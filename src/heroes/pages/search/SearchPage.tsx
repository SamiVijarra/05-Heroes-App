import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";

export const SearchPage = () => {
  return (
    <>
      <CustomJumbotron
                title="Búsqueda de SuperHéroes"
                description="Descubre, explora y administra superhéroes y villanos"
      />
      <HeroStats />
      <SearchControls/>
    </>
  );
};

export default SearchPage