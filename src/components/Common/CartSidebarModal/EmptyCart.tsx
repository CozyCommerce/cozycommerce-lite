import { EmptyCartIcon } from "@/assets/icons";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { closeCartSidebar } from "@/redux/features/ui-slice";

const EmptyCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="text-center">
      <div className="mx-auto pb-7.5">
        <EmptyCartIcon className="mx-auto" />
      </div>

      <p className="pb-6">Your cart is empty!</p>

      <Link
        onClick={() => dispatch(closeCartSidebar())}
        href="/shop"
        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-lg ease-out duration-200 hover:bg-opacity-95"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
