"use client";
import { ModalProvider } from "../context/QuickViewModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <ModalProvider>
        <PreviewSliderProvider>
          {children}
          <QuickViewModal />
          <CartSidebarModal />
          <PreviewSliderModal />
        </PreviewSliderProvider>
      </ModalProvider>
    </ReduxProvider>
  );
};

export default Providers;
