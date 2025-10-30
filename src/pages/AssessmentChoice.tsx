import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Clock, Target, Zap, Brain } from "lucide-react";

const AssessmentChoice = () => {
  const navigate = useNavigate();

  const handleAssessmentChoice = (type: 'short' | 'long') => {
    navigate(`/assessment?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Assessment</h1>
          <p className="text-xl text-muted-foreground">
            Select the assessment type that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Short Assessment */}
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary relative flex flex-col h-full">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="w-3 h-3 mr-1" />
                Quick
              </Badge>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">Short Assessment</h3>
              </div>
              <p className="text-muted-foreground">
                Perfect for getting started quickly and discovering your top career matches
              </p>
            </div>

            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">5 focused questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">3-5 minutes to complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">5 career matches generated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Good accuracy for general guidance</span>
              </div>
            </div>

            <Button 
              onClick={() => handleAssessmentChoice('short')}
              className="w-full h-12"
              size="lg"
            >
              Start Quick Assessment
            </Button>
          </Card>

          {/* Long Assessment */}
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-accent relative flex flex-col h-full">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Brain className="w-3 h-3 mr-1" />
                Detailed
              </Badge>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-accent" />
                <h3 className="text-2xl font-bold">Comprehensive Assessment</h3>
              </div>
              <p className="text-muted-foreground">
                In-depth analysis for highly accurate and personalized career recommendations
              </p>
            </div>

            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">12 comprehensive questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">8-12 minutes to complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">8-10 career matches generated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">High accuracy with detailed insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">Includes personality & work style analysis</span>
              </div>
            </div>

            <Button 
              onClick={() => handleAssessmentChoice('long')}
              className="w-full h-12 bg-accent hover:bg-accent/90"
              size="lg"
            >
              Start Comprehensive Assessment
            </Button>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Both assessments can be retaken anytime. You can always upgrade from short to comprehensive later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentChoice;