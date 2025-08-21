import Home from "@/components/Home";
import { getNewArrivalsProduct, getBestSellingProducts } from "@/get-api-data/product";

export default async function HomePage() {
  // Fetch data on the server
  const newProducts = await getNewArrivalsProduct();
  const bestSellingProducts = await getBestSellingProducts();

  return <Home newProducts={newProducts} bestSellingProducts={bestSellingProducts} />;
}
