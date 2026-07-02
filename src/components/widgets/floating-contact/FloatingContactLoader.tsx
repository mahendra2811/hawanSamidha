"use client";

import dynamic from "next/dynamic";

// next/dynamic + ssr:false must run inside a Client Component in the App
// Router — this loader is the Client Component; the root layout imports it
// normally, keeping FloatingContact itself out of the server-rendered HTML
// and out of the initial critical bundle.
const FloatingContact = dynamic(() => import("./FloatingContact"), { ssr: false });

export function FloatingContactLoader() {
  return <FloatingContact />;
}
