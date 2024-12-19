import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import Companies from "./pages/SuperAdmin/Companies"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/super-admin/companies" element={<Companies />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App