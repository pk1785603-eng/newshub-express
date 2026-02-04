import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import PostPage from "./pages/PostPage";
import LiveStreamPage from "./pages/LiveStreamPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePosts from "./pages/admin/ManagePosts";
import PostEditor from "./pages/admin/PostEditor";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageYouTube from "./pages/admin/ManageYouTube";
import LiveStreamSettings from "./pages/admin/LiveStreamSettings";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdmin();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes (no header/footer) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/posts" element={
                <ProtectedRoute><ManagePosts /></ProtectedRoute>
              } />
              <Route path="/admin/posts/new" element={
                <ProtectedRoute><PostEditor /></ProtectedRoute>
              } />
              <Route path="/admin/posts/edit/:id" element={
                <ProtectedRoute><PostEditor /></ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute><ManageCategories /></ProtectedRoute>
              } />
              <Route path="/admin/youtube" element={
                <ProtectedRoute><ManageYouTube /></ProtectedRoute>
              } />
              <Route path="/admin/live" element={
                <ProtectedRoute><LiveStreamSettings /></ProtectedRoute>
              } />
              
              {/* Public Routes (with header/footer) */}
              <Route path="*" element={
                <div className="flex flex-col min-h-screen">
                  <Header isDark={isDark} toggleTheme={toggleTheme} />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/category/:slug" element={<CategoryPage />} />
                      <Route path="/post/:slug" element={<PostPage />} />
                      <Route path="/live-stream" element={<LiveStreamPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
