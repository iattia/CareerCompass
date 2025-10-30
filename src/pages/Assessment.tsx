import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { generateCareerMatches } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { auth, saveUserProfile } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, Clock, Target } from "lucide-react";
import type { AssessmentAnswers } from "@/types";

const Assessment = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const assessmentType = searchParams.get('type') || 'short';
  const isLong = assessmentType === 'long';
  
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    interests: [],
    skills: [],
    workStyle: [],
    values: [],
    subjects: [],
    ...(isLong && {
      aptitudes: [],
      workValues: [],
      workEnvironment: [],
      decisionMaking: [],
      energySources: [],
      stressResponse: [],
      learningStyle: [],
      workPace: [],
      impact: [],
      workRelationships: []
    })
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const shortQuestions = {
    interests: {
      title: "What are your interests?",
      options: ["Technology", "Healthcare", "Arts & Design", "Business", "Education", "Engineering", "Science", "Social Services", "Sports & Fitness", "Media & Communication"],
    },
    skills: {
      title: "What are your strongest skills?",
      options: ["Problem Solving", "Communication", "Leadership", "Creativity", "Analytical Thinking", "Technical Skills", "Organization", "Teamwork", "Public Speaking", "Writing"],
    },
    workStyle: {
      title: "What work environment do you prefer?",
      options: ["Office Setting", "Remote Work", "Hands-on/Physical", "Collaborative", "Independent", "Fast-paced", "Structured", "Creative Freedom", "Outdoor", "Flexible Schedule"],
    },
    values: {
      title: "What do you value most in a career?",
      options: ["High Salary", "Work-Life Balance", "Helping Others", "Innovation", "Job Security", "Growth Opportunities", "Making an Impact", "Creativity", "Recognition", "Autonomy"],
    },
    subjects: {
      title: "What are your favorite school subjects?",
      options: ["Math", "Science", "English/Literature", "History", "Art", "Computer Science", "Foreign Languages", "Physical Education", "Music", "Social Studies"],
    },
  };

  const longQuestions = {
    interests: {
      title: "Which activities naturally draw your attention and interest?",
      options: ["Analyzing data patterns and solving complex puzzles", "Creating visual art, writing, or designing", "Counseling, teaching, or healthcare work", "Organizing events and leading initiatives", "Programming, engineering, or technical problem-solving", "Working outdoors or with physical materials", "Conducting research or scientific experiments", "Public speaking, journalism, or media work", "Entrepreneurship and business development", "Community service and advocacy work"],
    },
    aptitudes: {
      title: "In which areas do you naturally excel without much effort?",
      options: ["Mathematical calculations and logical reasoning", "Artistic skills and aesthetic judgment", "Understanding people's emotions and motivations", "Persuading others and negotiating", "Learning new technologies quickly", "Physical coordination and hands-on tasks", "Memorizing facts and detailed information", "Seeing patterns and making connections", "Managing multiple tasks simultaneously", "Explaining complex concepts simply"],
    },
    workValues: {
      title: "What would make you feel most fulfilled in your career?",
      options: ["Solving important problems that matter", "Having creative freedom in my approach", "Building meaningful relationships with colleagues", "Earning recognition as an expert in my field", "Having a stable, predictable income", "Making a positive difference in the world", "Having flexibility in when and where I work", "Constantly learning and growing professionally", "Having authority and decision-making power", "Maintaining a healthy work-life balance"],
    },
    workEnvironment: {
      title: "In what type of physical and social environment do you work best?",
      options: ["Quiet, private spaces with minimal interruptions", "Bustling, energetic environments with lots of interaction", "Structured settings with clear rules and procedures", "Flexible environments that change frequently", "High-tech, modern facilities with latest equipment", "Natural settings or outdoors", "Small, close-knit teams", "Large organizations with many departments", "Home or remote work settings", "Client-facing environments with public interaction"],
    },
    decisionMaking: {
      title: "How do you typically make important decisions?",
      options: ["Gather extensive data and analyze all options thoroughly", "Trust my intuition and gut feelings", "Seek input from trusted advisors and experts", "Consider the impact on all people involved", "Focus on practical outcomes and efficiency", "Look for innovative, unconventional solutions", "Follow established procedures and best practices", "Make quick decisions and adjust if needed", "Take time to reflect and consider long-term consequences", "Test small experiments before committing fully"],
    },
    subjects: {
      title: "Which academic or learning areas have consistently engaged you?",
      options: ["STEM fields (Science, Technology, Engineering, Math)", "Liberal Arts (Literature, Philosophy, History)", "Creative Arts (Visual Arts, Music, Theater)", "Social Sciences (Psychology, Sociology, Political Science)", "Business and Economics", "Health and Life Sciences", "Communications and Media Studies", "Education and Human Development", "Law and Criminal Justice", "Environmental and Earth Sciences"],
    },
    energySources: {
      title: "What types of activities give you energy rather than drain you?",
      options: ["Working alone on challenging intellectual problems", "Collaborating with others on team projects", "Teaching or mentoring someone new", "Competing to achieve the best results", "Creating something entirely new or original", "Helping others solve their problems", "Organizing and systematizing information", "Exploring new places or ideas", "Building or fixing things with my hands", "Performing or presenting in front of others"],
    },
    stressResponse: {
      title: "How do you typically respond when facing workplace stress or pressure?",
      options: ["I thrive under pressure and perform my best work", "I prefer to eliminate stressors through careful planning", "I seek support from colleagues or supervisors", "I take breaks and return with fresh perspective", "I focus intensely until the problem is solved", "I look for creative ways to work around the stress", "I maintain calm and help others stay focused too", "I delegate tasks to manage the workload better", "I use the pressure as motivation to innovate", "I prefer consistent, low-stress work environments"],
    },
    learningStyle: {
      title: "How do you prefer to acquire new knowledge and skills?",
      options: ["Reading books, articles, and detailed documentation", "Hands-on practice and experimentation", "Watching demonstrations and visual examples", "Listening to experts explain concepts", "Trial and error with immediate feedback", "Discussing ideas with peers and mentors", "Taking structured courses with clear objectives", "Learning through real-world projects", "Teaching others what I've learned", "Attending workshops and interactive sessions"],
    },
    workPace: {
      title: "What work rhythm and pace suits you best?",
      options: ["Steady, consistent pace throughout the day", "Intense bursts of activity followed by rest periods", "Flexible pace that varies based on the task", "Fast-paced environment with tight deadlines", "Slow, deliberate approach with attention to detail", "Seasonal variation with busy and quiet periods", "Project-based cycles with clear beginnings and ends", "Continuous improvement with gradual progress", "Reactive pace based on client or customer needs", "Self-directed pace with personal goal setting"],
    },
    impact: {
      title: "Through your work, how would you most like to contribute to the world?",
      options: ["Advance human knowledge through research and discovery", "Create beautiful or meaningful artistic expressions", "Directly help individuals overcome challenges", "Build systems that benefit many people", "Develop technologies that solve important problems", "Preserve and protect the natural environment", "Educate and inspire the next generation", "Create economic opportunities and prosperity", "Promote justice, fairness, and social change", "Connect people and build stronger communities"],
    },
    workRelationships: {
      title: "What type of professional relationships do you find most rewarding?",
      options: ["Deep, mentoring relationships with a few key people", "Broad network of professional connections", "Close collaboration with a small, dedicated team", "Independent work with minimal interpersonal demands", "Client relationships focused on service delivery", "Leadership relationships where I guide others", "Peer relationships with intellectual equals", "Teaching relationships where I share knowledge", "Competitive relationships that push me to excel", "Supportive relationships in a caring community"],
    },
  };

  const questions = isLong ? longQuestions : shortQuestions;
  const totalSteps = Object.keys(questions).length;

  const currentQuestion = Object.entries(questions)[step - 1];
  const [category, question] = currentQuestion;

  const handleToggle = (option: string) => {
    setAnswers((prev) => {
      const current = (prev[category as keyof AssessmentAnswers] as string[]) || [];
      if (current.includes(option)) {
        return { ...prev, [category]: current.filter((item) => item !== option) };
      }
      return { ...prev, [category]: [...current, option] };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const careerCount = isLong ? 8 : 5;
      const careers = await generateCareerMatches(answers, careerCount);
      
      // Sort careers by match percentage in descending order
      const sortedCareers = [...careers].sort((a, b) => b.match - a.match);
      
      // Save to Firebase if user is logged in
      if (currentUser) {
        await saveUserProfile(currentUser.uid, { answers, careers: sortedCareers });
        toast({
          title: "Assessment saved!",
          description: "Your career matches have been saved to your profile.",
        });
      }
      
      // Also save to localStorage as backup
      localStorage.setItem("careerMatches", JSON.stringify(sortedCareers));
      localStorage.setItem("assessmentAnswers", JSON.stringify(answers));
      localStorage.setItem("assessmentCompleted", "true");
      toast({ title: "Assessment Complete!", description: "Your career matches have been generated." });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to generate career matches. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = (answers[category as keyof AssessmentAnswers] as string[] || []).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant={isLong ? "default" : "secondary"} className="flex items-center gap-1">
              {isLong ? <Target className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isLong ? "Comprehensive" : "Quick"} Assessment
            </Badge>
          </div>
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
              <div key={num} className={`flex-1 h-2 rounded-full mx-1 transition-colors ${num <= step ? (isLong ? "bg-accent" : "bg-primary") : "bg-muted"}`} />
            ))}
          </div>
          <p className="text-center text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">{question.title}</h2>
          <p className="text-muted-foreground mb-6">Select all that apply:</p>

          <div className="space-y-4 mb-8">
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-border" onClick={() => handleToggle(option)}>
                <Checkbox checked={((answers[category as keyof AssessmentAnswers] as string[]) || []).includes(option)} onCheckedChange={() => handleToggle(option)} />
                <label className="flex-1 cursor-pointer text-sm">{option}</label>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canProceed || loading} className="ml-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : step === totalSteps ? (
                "Get My Results"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
