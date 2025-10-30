import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCareerRoadmap, generateCareerOverview } from "@/lib/gemini";
import { generateJobSearchLinks, type JobListing } from "@/lib/jobSearch";
import { formatBoldText } from "@/lib/formatText";
import { ArrowLeft, Loader2, ExternalLink, DollarSign, TrendingUp, GraduationCap, MapPin, Building } from "lucide-react";
import type { Career } from "@/types";

const CareerDetail = () => {
  const { careerName } = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [overview, setOverview] = useState<string>("");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCareerData = async () => {
      if (!careerName) return;

      const saved = localStorage.getItem("careerMatches");
      if (saved) {
        const careers: Career[] = JSON.parse(saved);
        const decodedCareerName = decodeURIComponent(careerName);
        
        // Try exact match first
        let found = careers.find((c) => c.name === decodedCareerName);
        
        // If not found, try case-insensitive match
        if (!found) {
          found = careers.find((c) => c.name.toLowerCase() === decodedCareerName.toLowerCase());
        }
        
        // If still not found, try partial match
        if (!found) {
          found = careers.find((c) => c.name.includes(decodedCareerName) || decodedCareerName.includes(c.name));
        }
        
        if (found) {
          setCareer(found);
        } else {
          // Create a career object if not found in localStorage
          const placeholderCareer: Career = {
            name: decodedCareerName,
            match: 0,
            description: "Career information not available. Please take the assessment first.",
            category: "Unknown",
            salary: "N/A",
            growth: "N/A",
            education: "N/A"
          };
          setCareer(placeholderCareer);
        }
      } else {
        // If no careers in localStorage, create a placeholder career
        const decodedCareerName = decodeURIComponent(careerName);
        const placeholderCareer: Career = {
          name: decodedCareerName,
          match: 0,
          description: "No career data found. Please take the assessment first to get personalized career matches.",
          category: "Unknown",
          salary: "N/A",
          growth: "N/A",
          education: "N/A"
        };
        setCareer(placeholderCareer);
      }

      try {
        // Load overview and roadmap
        const [overviewText, roadmapData] = await Promise.all([
          generateCareerOverview(careerName),
          generateCareerRoadmap(careerName),
        ]);

        setOverview(overviewText);
        setRoadmap(roadmapData);

        // Generate job search links
        const jobLinks = generateJobSearchLinks(careerName, "New York");
        setJobs(jobLinks);
      } catch (error) {
        console.error("Error loading career data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCareerData();
  }, [careerName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Career not found</h2>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Matches
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-3">{career.name}</h1>
              <Badge variant="secondary" className="text-lg px-4 py-1">{career.category}</Badge>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{career.match}%</div>
              <div className="text-sm text-muted-foreground">Your Match</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm text-muted-foreground">Salary Range</div>
                  <div className="font-bold">{career.salary}</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Job Growth</div>
                  <div className="font-bold">{career.growth}</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm text-muted-foreground">Education</div>
                  <div className="font-bold">{career.education}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="jobs">Job Listings ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Career Overview</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {formatBoldText(overview)}
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Your Career Roadmap</h2>
              {roadmap && roadmap.phases && (
                <div className="relative">
                  {roadmap.phases.map((phase: any, index: number) => (
                    <div key={index} className="relative pl-8 pb-12 last:pb-0">
                      <div className="absolute left-0 top-0 h-full w-px bg-primary">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">
                            {formatBoldText(phase.title)}
                          </h3>
                          <Badge variant="outline">{phase.timeframe}</Badge>
                        </div>
                        <ul className="space-y-2">
                          {phase.steps.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-muted-foreground">
                                {formatBoldText(step)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="space-y-4">
              <Card className="p-6 bg-accent/10 border-accent/20 mb-4">
                <h3 className="font-semibold mb-2">Browse {career.name} Jobs on Top Platforms</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click any link below to explore current job openings for {career.name} positions in New York.
                </p>
              </Card>
              
              {jobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{job.source}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search results from {job.source} for {career.name} positions. Click below to view all available opportunities.
                  </p>
                  <Button variant="default" size="sm" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      View Jobs on {job.source} <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CareerDetail;
