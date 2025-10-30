import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { auth, getUserProfile, saveUserProfile } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { RefreshCcw, LogOut, Plus, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAdditionalCareerMatches } from "@/lib/gemini";
import { formatBoldText } from "@/lib/formatText";
import type { Career } from "@/types";

const Dashboard = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate("/auth");
        return;
      }

      // Try to load from Firebase first
      try {
        const profile = await getUserProfile(user.uid);
        if (profile && profile.careers) {
          // Sort careers by match percentage in descending order
          const sortedCareers = [...profile.careers].sort((a, b) => b.match - a.match);
          setCareers(sortedCareers);
          setAssessmentData(profile.answers);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }

      // Fallback to localStorage
      const saved = localStorage.getItem("careerMatches");
      const savedAssessment = localStorage.getItem("assessmentAnswers");
      if (saved) {
        const parsedCareers = JSON.parse(saved);
        // Sort careers by match percentage in descending order
        const sortedCareers = [...parsedCareers].sort((a, b) => b.match - a.match);
        setCareers(sortedCareers);
        
        if (savedAssessment) {
          setAssessmentData(JSON.parse(savedAssessment));
        }
      } else {
        navigate("/assessment");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };

  const handleLoadMore = async () => {
    if (!assessmentData) {
      toast({
        title: "Cannot load more careers",
        description: "Assessment data not found. Please retake the assessment.",
        variant: "destructive"
      });
      return;
    }

    setLoadingMore(true);
    try {
      const existingCareerNames = careers.map(career => career.name);
      const additionalCareers = await generateAdditionalCareerMatches(
        assessmentData, 
        existingCareerNames, 
        5
      );
      
      const allCareers = [...careers, ...additionalCareers];
      const sortedCareers = allCareers.sort((a, b) => b.match - a.match);
      
      setCareers(sortedCareers);
      
      // Update Firebase and localStorage
      if (currentUser) {
        await saveUserProfile(currentUser.uid, { 
          answers: assessmentData, 
          careers: sortedCareers 
        });
      }
      localStorage.setItem("careerMatches", JSON.stringify(sortedCareers));
      
      toast({
        title: "Success!",
        description: `Added ${additionalCareers.length} more career matches.`,
      });
      
    } catch (error) {
      console.error("Error loading more careers:", error);
      toast({
        title: "Error",
        description: "Failed to load more careers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleFavorite = async (careerIndex: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking favorite
    
    const updatedCareers = careers.map((career, index) => 
      index === careerIndex 
        ? { ...career, isFavorite: !career.isFavorite }
        : career
    );
    
    setCareers(updatedCareers);
    
    // Update Firebase and localStorage
    if (currentUser && assessmentData) {
      await saveUserProfile(currentUser.uid, { 
        answers: assessmentData, 
        careers: updatedCareers 
      });
    }
    localStorage.setItem("careerMatches", JSON.stringify(updatedCareers));
    
    const career = updatedCareers[careerIndex];
    toast({
      title: career.isFavorite ? "Added to Favorites" : "Removed from Favorites",
      description: `${career.name} has been ${career.isFavorite ? 'added to' : 'removed from'} your favorites.`,
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Your Career Matches</h1>
            <p className="text-muted-foreground text-lg">
              Based on your assessment, here are careers that align with your skills, interests, and values.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/assessment-choice")}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retake Assessment
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {careers.map((career, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary relative"
              onClick={() => navigate(`/career/${encodeURIComponent(career.name)}`)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 p-2 h-8 w-8 hover:bg-transparent ${career.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={(e) => toggleFavorite(index, e)}
              >
                <Heart className={`h-4 w-4 ${career.isFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <div className="flex justify-between items-start mb-4 pr-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{career.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{career.category}</Badge>
                    {career.isFavorite && (
                      <Badge variant="outline" className="text-red-500 border-red-200">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{career.match}%</div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              </div>

              <Progress value={career.match} className="mb-4" />

              <p className="text-sm text-muted-foreground mb-4">
                {formatBoldText(career.description)}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-muted-foreground">Salary Range</div>
                  <div className="font-bold text-accent">{career.salary}</div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Job Growth</div>
                  <div className="font-bold">{career.growth}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-semibold text-muted-foreground">Education</div>
                  <div>{career.education}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {assessmentData && careers.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleLoadMore} 
              disabled={loadingMore}
              size="lg"
              variant="outline"
              className="px-8"
            >
              {loadingMore ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating More Careers...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Load More Career Paths
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Discover {careers.length >= 10 ? 'even more' : 'additional'} career opportunities that match your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
