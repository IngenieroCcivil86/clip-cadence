import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Canal from "./pages/Canal";
import EditProject from "./pages/EditProject";
import CreateScene from "./pages/CreateScene";
import VideoPage from "./pages/VideoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/canal/:id" element={
              <ProtectedRoute>
                <Canal />
              </ProtectedRoute>
            } />
            <Route path="/canal/:id/edit/:videoId" element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            } />
            <Route path="/canal/:id/create/:videoId/:sceneId" element={
              <ProtectedRoute>
                <CreateScene />
              </ProtectedRoute>
            } />
            <Route path="/video/:id" element={
              <ProtectedRoute>
                <VideoPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
