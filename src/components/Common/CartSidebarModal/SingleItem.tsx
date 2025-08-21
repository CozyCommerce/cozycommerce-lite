import { TrashIcon } from "@/assets/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeFromCart } from "@/redux/features/cart-slice";
import { closeCartSidebar } from "@/redux/features/ui-slice";
import { CartItem } from "@/redux/features/cart-slice";
import { formatPrice } from "@/utils/formatePrice";

interface SingleItemProps {
    item: CartItem;
}

const SingleItem = ({ item }: SingleItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleProductClick = () => {
    router.push(`/product/${item.slug}`);
    dispatch(closeCartSidebar());
  };  

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 w-22.5 h-22.5 shrink-0">
          <Image src={item.image} alt={item.title} width={64} height={64} />
        </div>

        <div>
          <h3 className="mb-1 text-base font-medium duration-200 ease-out text-dark hover:text-blue">
            <button onClick={handleProductClick} className="text-start">
              {item.title} (x{item.quantity})
            </button>
          </h3>
          <p className="font-normal text-custom-sm">Price: {formatPrice(item.price)}</p>
        </div>
      </div>

      <div>
        <button
          onClick={handleRemoveFromCart}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg w-[38px] h-[38px] bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
