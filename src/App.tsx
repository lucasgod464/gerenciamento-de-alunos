import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import Companies from "./pages/SuperAdmin/Companies"
import Emails from "./pages/SuperAdmin/Emails"

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/super-admin/companies" element={<Companies />} />
        <Route path="/super-admin/emails" element={<Emails />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App