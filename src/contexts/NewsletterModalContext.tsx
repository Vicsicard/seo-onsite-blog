'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NewsletterModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const NewsletterModalContext = createContext<NewsletterModalContextType | undefined>(undefined);

export function NewsletterModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <NewsletterModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </NewsletterModalContext.Provider>
  );
}

export function useNewsletterModal() {
  const context = useContext(NewsletterModalContext);
  if (context === undefined) {
    throw new Error('useNewsletterModal must be used within a NewsletterModalProvider');
  }
  return context;
}
