
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DirectMessagesPage from "./pages/DirectMessagesPage";
import DirectMessageChatPage from "./pages/DirectMessageChatPage";
import ChannelPage from "./pages/ChannelPage";
import GroupHomePage from "./pages/GroupHomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Layout components
import AppLayout from "./components/layout/AppLayout";
import GroupLayout from "./components/groups/GroupLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AppLayout />}>
              <Route path="/messages" element={<DirectMessagesPage />} />
              <Route path="/messages/:conversationId" element={<DirectMessageChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Group routes */}
              <Route path="/groups/:groupId" element={<GroupLayout />}>
                <Route index element={<GroupHomePage />} />
                <Route path="channels/:channelId" element={<ChannelPage />} />
              </Route>
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
