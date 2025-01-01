import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { routes } from "./routes"

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App