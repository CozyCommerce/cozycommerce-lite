import { getAllProducts } from "@/get-api-data/product";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Manage Products | CozyCommerce",
};

// This is a server component, so we can fetch data directly
const ManageProductsPage = async () => {
  const products = await getAllProducts();

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Manage Products</h1>
        <Link href="/admin/products/new" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition">
          + Add New Product
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Image</th>
              <th className="text-left p-4 font-semibold">Title</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Quantity</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  <Image
                    src={product.productVariants?.[0]?.image || "/images/products/product-1-bg-1.png"}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="p-4">{product.title}</td>
                <td className="p-4">${product.price.toString()}</td>
                <td className="p-4">{product.quantity}</td>
                <td className="p-4">
                  <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:underline mr-4">
                    Edit
                  </Link>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageProductsPage;
