import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import { Toaster } from "@/components/ui/toaster"
import { routes } from "./routes"

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App