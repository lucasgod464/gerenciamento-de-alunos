import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { router } from "./routes"
import { BrowserRouter } from "react-router-dom"

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {router}
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App