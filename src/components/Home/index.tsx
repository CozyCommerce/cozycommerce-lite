import Newsletter from "../Common/Newsletter";
import BestSeller from "./BestSeller";
import Categories from "./Categories";
import CountDown from "./Countdown";
import Hero from "./Hero";
import FooterFeature from "./Hero/FooterFeature";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Testimonials from "./Testimonials";
import { Prisma } from "@prisma/client";

// Infer the type from the Prisma call's return value
type ProductWithDetails = Prisma.PromiseReturnType<typeof import('@/get-api-data/product').getNewArrivalsProduct>[0];

interface HomeProps {
  newProducts: ProductWithDetails[];
  bestSellingProducts: ProductWithDetails[];
}

const Home = ({ newProducts, bestSellingProducts }: HomeProps) => {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival newProducts={newProducts} />
      <PromoBanner />
      <BestSeller bestSellingProducts={bestSellingProducts} />
      <CountDown />
      <Testimonials />
      <Newsletter />
      <FooterFeature />
    </main>
  );
};

export default Home;
