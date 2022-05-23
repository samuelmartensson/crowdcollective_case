import React, {
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useState,
} from "react";

import Portal from "./Portal";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "../assets/icons";

type ModalTypes = "default" | "info";

type ModalProps =
  | {
      children: ReactNode;
      isOpen: boolean;
      onClose?: () => void;
      closable?: true;
      imageLoader?: boolean;
      onAnimationComplete?: () => void;
      closeOnOverlayClick?: boolean;
      closeButton?: boolean;
      type?: ModalTypes;
    }
  | {
      children: ReactNode;
      isOpen: boolean;
      onClose?: undefined;
      closable: false;
      imageLoader?: boolean;
      onAnimationComplete?: () => void;
      closeOnOverlayClick?: boolean;
      closeButton?: boolean;
      type?: ModalTypes;
    };

const Modal = ({
  children,
  isOpen = false,
  onClose = undefined,
  closeOnOverlayClick = false,
  onAnimationComplete = undefined,
  closable = true,
  imageLoader = true,
  closeButton = true,
  type = "default",
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [localOpen, setLocalOpen] = useState(true);

  const onClickOverlay = useCallback(
    (event) => {
      if (!contentRef.current?.contains(event.target)) {
        if (closeOnOverlayClick) {
          setLocalOpen(false);
          onClose && onClose();
        }
      }
    },
    [onClose, closeOnOverlayClick]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onClose && onClose();
      }
    },
    [onClose]
  );

  const onCloseButtonClick = () => {
    onClose?.();
    setLocalOpen(false);
  };

  useEffect(() => {
    if (closable) {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        setLocalOpen(true);
      };
    }
  }, [isOpen, handleKeyDown, closable]);

  return (
    <>
      <Portal selector="#modal">
        <AnimatePresence onExitComplete={onAnimationComplete}>
          {isOpen && localOpen && (
            <Container
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ ease: "easeInOut", duration: 0.15 }}
              onClick={onClickOverlay}
              type={type}
            >
              <div className="inner-modal" ref={contentRef}>
                {children}
                {closeButton && (
                  <button
                    className="close-btn"
                    type="button"
                    onClick={onCloseButtonClick}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </Container>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default Modal;

const Container = styled(motion.div)<{ type: ModalTypes }>`
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  bottom: -100px;
  background: rgba(0, 0, 0, 0.75);
  z-index: 100;
  display: flex;

  .close-btn {
    position: absolute;
    background: none;
    border: none;
    top: ${(p) => (p.type === "info" ? "-0.5rem" : "0rem")};
    right: ${(p) => (p.type === "info" ? "-0.5rem" : "0rem")};
    cursor: pointer;
    z-index: 2;

    &:hover {
      transform: scale(1.05);
    }

    svg {
      width: 34px;
      height: 34px;
    }
  }

  .inner-modal {
    margin: auto;
    position: relative;
  }
`;
