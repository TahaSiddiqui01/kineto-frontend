"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

function QueryProvider(props: React.PropsWithChildren) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    )
}

export default QueryProvider