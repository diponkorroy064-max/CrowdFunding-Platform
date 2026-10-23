"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer completely on all dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return <Footer />;
}
