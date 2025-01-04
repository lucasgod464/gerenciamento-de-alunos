import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { routes } from "./routes"
import { Loader } from "@/components/Loader"

const queryClient = new QueryClient()

const router = createBrowserRouter(routes)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<Loader />} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App