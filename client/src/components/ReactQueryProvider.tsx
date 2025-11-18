"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const ReactQueryProvider = ({ 
  children, 
  queryClient 
}: { 
  children: React.ReactNode;
  queryClient: QueryClient;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;