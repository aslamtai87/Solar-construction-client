"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { useState } from "react";

const QueryProvider = ({children}:{children:React.ReactNode})=>{
    const [queryClient] = useState(()=>new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 60 * 5,
            },
            mutations: {
                retry: 0,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider;