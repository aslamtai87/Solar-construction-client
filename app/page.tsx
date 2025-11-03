"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/signin";
  }, []);
  return <div className="p-2 flex gap-2"></div>;
}
