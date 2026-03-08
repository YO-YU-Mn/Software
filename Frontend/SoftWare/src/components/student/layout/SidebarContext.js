/**
 * SidebarContext.js
 *
 * Replaces the prop-drilling pattern (open / setOpen) used in the web version.
 * Wrap your layout with <SidebarProvider> and consume with useSidebar().
 *
 * Usage:
 *   // In your root layout / navigator
 *   import { SidebarProvider } from './SidebarContext';
 *   <SidebarProvider><App /></SidebarProvider>
 *
 *   // Inside Header or Sidebar
 *   import { useSidebar } from './SidebarContext';
 *   const { open, toggle } = useSidebar();
 */

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const close  = () => setOpen(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return ctx;
}
