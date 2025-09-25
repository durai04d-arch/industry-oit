import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Technology from "./pages/Technology";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/" element={
                <>
                  <Navigation />
                  <Index />
                </>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigation />
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <>
                  <Navigation />
                  <Services />
                </>
              } />
              <Route path="/technology" element={
                <>
                  <Navigation />
                  <Technology />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navigation />
                  <About />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navigation />
                  <Contact />
                </>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
