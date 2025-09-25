import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import IndustrySelection from "./pages/IndustrySelection";
import UserDetails from "./pages/UserDetails";
import UserProfile from "./pages/UserProfile";

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
              <Route path="/industry-selection" element={<IndustrySelection />} />
              <Route path="/user-details" element={<UserDetails />} />
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigation />
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navigation />
                  <UserProfile />
                </ProtectedRoute>
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
