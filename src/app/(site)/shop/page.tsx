import { getAllProducts } from "@/get-api-data/product";
import ProductItem from "@/components/Common/ProductItem";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata = {
  title: "Shop | CozyCommerce",
};

const ShopPage = async () => {
  const products = await getAllProducts();

  return (
    <>
      <Breadcrumb pageName="Shop" />

      <section className="overflow-hidden pb-20">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">All Products</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {products.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
