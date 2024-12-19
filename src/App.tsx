import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { router } from "./routes"
import { RouterProvider } from "@tanstack/react-router"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouterProvider router={router} />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App