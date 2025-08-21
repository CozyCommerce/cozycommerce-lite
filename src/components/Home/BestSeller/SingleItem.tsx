"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import toast from "react-hot-toast";
import ActionBtn from "./ActionBtn";
import { Prisma } from "@prisma/client";
import { formatPrice } from "@/utils/formatePrice";

type ProductWithDetails = Prisma.PromiseReturnType<
  typeof import("@/get-api-data/product").getBestSellingProducts
>[0];

const SingleItem = ({ item }: { item: ProductWithDetails }) => {
  const defaultVariant = item?.productVariants.find(
    (variant) => variant.isDefault
  );
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useAppSelector((state) => state.cart);
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const isAlradyAdded = cartItems.some((cartItem) => cartItem.id === item.id);

  const isAlradyWishListed = Object.values(wishlistItems ?? {}).some(
    (wishlistItem) => wishlistItem.id === item.id
  )
    ? true
    : false;

  const cartItem = {
    id: item.id,
    name: item.title,
    price: item.discountedPrice ? item.discountedPrice : item.price,
    currency: "usd",
    image: defaultVariant?.image ? defaultVariant.image : "",
    price_id: null,
    slug: item?.slug,
    availableQuantity: item.quantity,
    color: defaultVariant?.color ? defaultVariant.color : "",
    size: defaultVariant?.size ? defaultVariant.size : "",
  };

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    const serializableItem = {
      ...item,
      updatedAt:
        item.updatedAt instanceof Date
          ? item.updatedAt.toISOString()
          : item.updatedAt,
    };
    dispatch(updateQuickView(serializableItem));
    openModal();
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
        image: defaultVariant?.image ? defaultVariant.image : "",
        price: item.discountedPrice ? item.discountedPrice : item.price,
        quantity: item.quantity,
        color: defaultVariant?.color ? defaultVariant.color : "",
      })
    );
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl bg-[#F6F7FB] min-h-[403px]">
        <div className="text-center px-4 py-7.5">
          <h3 className="font-semibold text-lg text-dark ease-out duration-200 hover:text-blue mb-1.5">
            <Link href={`/product/${item?.slug}`}>{item.title}</Link>
          </h3>

          <span className="flex items-center justify-center gap-2 text-base font-medium">
            <span className="text-dark">
              {formatPrice(item.discountedPrice || item.price)}
            </span>
            {item.discountedPrice && (
              <span className="line-through text-dark-4 ">
                {formatPrice(item.price)}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <Link href={`/product/${item?.slug}`}>
            <Image
              src={defaultVariant?.image || ""}
              alt={item.title || "product-image"}
              width={280}
              height={280}
            />
          </Link>
        </div>

        <div className="absolute right-0 bottom-0  w-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0 translate-x-full">
          <ActionBtn
            handleClick={handleQuickViewUpdate}
            text="Quick View"
            icon={"quick-view"}
          />

          {isAlradyAdded ? (
            <ActionBtn text="Checkout" icon="check-out" />
          ) : (
            <ActionBtn
              handleClick={() => {
                handleAddToCart();
              }}
              text="Add to cart"
              icon="cart"
              isDisabled={item.quantity < 1 ? true : false}
            />
          )}

          <ActionBtn
            handleClick={handleItemToWishList}
            text="Add to Wishlist"
            icon="wishlist"
            addedToWishlist={isAlradyWishListed}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
