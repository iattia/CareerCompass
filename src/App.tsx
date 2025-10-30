import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import AssessmentChoice from "@/pages/AssessmentChoice";
import Assessment from "@/pages/Assessment";
import Dashboard from "@/pages/Dashboard";
import CareerDetail from "@/pages/CareerDetail";
import Jobs from "@/pages/Jobs";
import Mentorship from "@/pages/Mentorship";
import Scholarships from "@/pages/Scholarships";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/assessment-choice" element={<AssessmentChoice />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career/:careerName" element={<CareerDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
