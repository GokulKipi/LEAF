// ModalContext.js

import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, setIsModalOpen, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};
