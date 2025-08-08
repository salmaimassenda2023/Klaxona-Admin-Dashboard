// app/page.tsx - Updated dashboard page
'use client'

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";


// Note: metadata export only works in server components
// If you need this to be a client component, move metadata to layout.tsx
// export const metadata: Metadata = {
//   title: "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Ecommerce() {

    // Main dashboard content
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <EcommerceMetrics />

            </div>
        </div>
    );
}