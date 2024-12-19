import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { Routes } from "./routes"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App