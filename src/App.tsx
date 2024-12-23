import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Toaster } from "sonner"
import { routes } from "./routes"
import { RouterProvider } from "react-router-dom"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  )
}

export default App