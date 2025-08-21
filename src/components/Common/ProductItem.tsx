"use client";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { EyeIcon } from "@/assets/icons";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import CheckoutBtn from "../Shop/CheckoutBtn";
import WishlistButton from "../Wishlist/AddWishlistButton";
import { formatPrice } from "@/utils/formatePrice";
import Tooltip from "./Tooltip";
import { calculateDiscountPercentage } from "@/utils/calculateDiscountPercentage";
import { Prisma } from "@prisma/client";

// Using inferred type for consistency
type ProductWithDetails = Prisma.PromiseReturnType<
  typeof import("@/get-api-data/product").getNewArrivalsProduct
>[0];

type Props = {
  bgClr?: string;
  item: ProductWithDetails;
};

const ProductItem = ({ item, bgClr = "[#F6F7FB]" }: Props) => {
  const defaultVariant = item?.productVariants.find(
    (variant) => variant.isDefault
  );
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  const isAlreadyAdded = cartItems.some((cartItem) => cartItem.id === item.id);

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    // We need to handle potential non-serializable data if we dispatch the whole item
    // For now, we can create a serializable version or dispatch only necessary fields
    const serializableItem = {
      ...item,
      price: item.price.toString(), // Convert Decimal to string
      discountedPrice: item.discountedPrice?.toString() ?? null,
      updatedAt: item.updatedAt.toISOString(),
      reviews: item.reviews || 0,
    };
    dispatch(updateQuickView(serializableItem));
  };

  // add to cart
  const handleAddToCart = () => {
    if (item.quantity > 0) {
      dispatch(
        addItemToCart({
          id: item.id,
          title: item.title,
          slug: item.slug,
          image: defaultVariant?.image || "",
          price: item.discountedPrice?.toNumber() || item.price.toNumber(),
          quantity: 1, // Add one item at a time
          availableQuantity: item.quantity,
          color: defaultVariant?.color || "",
          size: defaultVariant?.size || "",
        })
      );
      toast.success("Product added to cart!");
    } else {
      toast.error("This product is out of stock!");
    }
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        slug: item.slug,
        image: defaultVariant?.image || "",
        price: item.discountedPrice?.toNumber() || item.price.toNumber(),
        quantity: item.quantity,
        color: defaultVariant?.color || "",
      })
    );
  };

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden border border-gray-3 flex items-center justify-center rounded-xl bg-${bgClr} min-h-[270px] mb-4`}
      >
        <Link href={`/product/${item.slug}`}>
          <Image
            src={defaultVariant?.image || "/images/products/product-1-bg-1.png"}
            alt={item.title || "product-image"}
            width={250}
            height={250}
          />
        </Link>
        <div className="absolute top-2 right-2">
          {item.quantity < 1 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
              Out of Stock
            </span>
          ) : item?.discountedPrice && item.discountedPrice.gt(0) ? (
            <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-blue">
              {calculateDiscountPercentage(
                item.discountedPrice.toNumber(),
                item.price.toNumber()
              )}
              % OFF
            </span>
          ) : null}
        </div>

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <Tooltip content="Quick View" placement="top">
            <button
              className="border border-gray-3 h-[38px] w-[38px] rounded-lg flex items-center justify-center text-dark bg-white hover:text-blue"
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
            >
              <EyeIcon />
            </button>
          </Tooltip>

          {isAlreadyAdded ? (
            <CheckoutBtn />
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={item.quantity < 1}
              className="inline-flex px-5 py-2 font-medium h-[38px] text-white duration-200 ease-out rounded-lg text-custom-sm bg-blue hover:bg-blue-dark"
            >
              {item.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
          {/* wishlist button */}
          <WishlistButton
            item={item}
            handleItemToWishList={handleItemToWishList}
          />
        </div>
      </div>

      <h3 className="font-semibold text-dark ease-out text-base duration-200 hover:text-blue mb-1.5 line-clamp-1">
        <Link href={`/product/${item.slug}`}> {item.title} </Link>
      </h3>

      <span className="flex items-center gap-2 text-base font-medium">
        {item.discountedPrice && item.discountedPrice.gt(0) && (
          <span className="line-through text-dark-4">
            {formatPrice(item.price.toNumber())}
          </span>
        )}
        <span className="text-dark">
          {formatPrice(
            item.discountedPrice?.toNumber() || item.price.toNumber()
          )}
        </span>
      </span>
    </div>
  );
};

export default ProductItem;
