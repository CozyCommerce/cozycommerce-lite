"use client";
import { CloseLine } from "@/assets/icons";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { closeCartSidebar } from "@/redux/features/ui-slice";
import EmptyCart from "./EmptyCart";
import SingleItem from "./SingleItem";
import { formatPrice } from "@/utils/formatePrice";
import { useRouter } from "next/navigation";

const CartSidebarModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, totalAmount } = useAppSelector((state) => state.cart);
  const { isCartSidebarOpen } = useAppSelector((state) => state.ui);

  const cartCount = cartItems.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        !event.target.closest(".modal-content")
      ) {
        dispatch(closeCartSidebar());
      }
    }

    if (isCartSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartSidebarOpen, dispatch]);

  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
    dispatch(closeCartSidebar());
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-9999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
          isCartSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => dispatch(closeCartSidebar())} // Close on overlay click
      ></div>

      <div
        className={`${
          isCartSidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed z-999999 w-full h-screen max-w-[470px] ease-linear duration-300 shadow-1 bg-white px-4 sm:px-7.5 lg:px-10 top-0 right-0 modal-content flex flex-col`}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-10 border-b border-gray-3 mb-7.5">
          <h2 className="text-lg font-medium text-dark sm:text-2xl">
            Cart View ({cartCount})
          </h2>
          <button
            onClick={() => dispatch(closeCartSidebar())}
            aria-label="button for close modal"
            className="flex items-center justify-center duration-150 ease-in text-dark-5 hover:text-dark"
          >
            <CloseLine />
          </button>
        </div>

        <div className="h-[66vh] overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-6">
            {cartCount > 0 ? (
              <>
                {cartItems.map((item) => (
                  <SingleItem key={item.id} item={item} />
                ))}
              </>
            ) : (
              <EmptyCart />
            )}
          </div>
        </div>

        {cartCount > 0 && (
          <div className="border-t border-gray-3 bg-white pt-5 pb-4 sm:pb-7.5 lg:pb-11 sticky bottom-0 mt-auto">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="text-base font-normal text-dark-3 ">Subtotal:</p>
              <p className="text-xl font-medium text-dark">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                onClick={() => dispatch(closeCartSidebar())}
                href="/cart"
                className="flex justify-center w-full px-6 py-3 text-base font-medium text-white duration-200 ease-out rounded-lg bg-blue hover:bg-blue-dark"
              >
                View Cart
              </Link>
              <button
                onClick={handleCheckout}
                className="flex justify-center w-full px-6 py-3 text-base font-medium text-white duration-200 ease-out rounded-lg bg-dark hover:bg-opacity-95"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebarModal;
