import { getProductBySlug } from "@/get-api-data/product";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: `${product.title} | CozyCommerce`,
    description: product.shortDescription,
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound(); // Redirect to 404 page if product not found
  }

  // Use the first variant image as the main image, or a placeholder
  const mainImage = product.productVariants?.[0]?.image || "/images/products/product-1-bg-1.png";

  return (
    <>
      <Breadcrumb pageName="Product Details" />

      <section className="overflow-hidden py-20">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="w-full">
              <Image
                src={mainImage}
                alt={product.title}
                width={700}
                height={800}
                className="rounded-lg object-cover w-full"
              />
            </div>

            {/* Product Info */}
            <div className="w-full">
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-2xl font-semibold text-primary mb-6">
                ${product.price}
              </p>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description || product.shortDescription}</p>
              </div>
              <div className="mb-6">
                  <p><span className="font-semibold">SKU:</span> {product.sku || 'N/A'}</p>
                  <p><span className="font-semibold">Category:</span> {product.category?.title || 'N/A'}</p>
                  <p><span className="font-semibold">Tags:</span> {product.tags?.join(', ') || 'N/A'}</p>
              </div>

              {/* Add to Cart Button etc. would go here */}
              <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
