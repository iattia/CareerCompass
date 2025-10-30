import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { searchJobs, type Job } from "@/lib/jobAPIs";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Search, MapPin, Building, ExternalLink, Loader2, Heart, Sparkles } from "lucide-react";
import type { Career } from "@/types";

const Jobs = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("New York");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [sources, setSources] = useState<string[]>([]);
  const [favoriteCareers, setFavoriteCareers] = useState<Career[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.careers) {
            const favorites = profile.careers.filter((career: Career) => career.isFavorite);
            setFavoriteCareers(favorites);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
      
      // Also check localStorage for favorites
      const saved = localStorage.getItem("careerMatches");
      if (saved) {
        const parsedCareers = JSON.parse(saved);
        const favorites = parsedCareers.filter((career: Career) => career.isFavorite);
        setFavoriteCareers(favorites);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    if (!query.trim() && !location.trim()) {
      toast({
        title: "Search required",
        description: "Please enter a job title or location to search",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await searchJobs(query.trim() || "entry level", location.trim() || "New York");
      setJobs(result.jobs);
      setTotal(result.total);
      setSources(result.sources);
      
      if (result.jobs.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try different search terms or location.",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${result.total} job${result.total !== 1 ? 's' : ''} matching your criteria`,
        });
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
      toast({
        title: "Search error",
        description: "Error searching for jobs. Please try again.",
        variant: "destructive",
      });
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const searchFavoriteCareer = async (careerName: string) => {
    setQuery(careerName);
    setLoading(true);
    try {
      const result = await searchJobs(careerName, location);
      setJobs(result.jobs);
      setTotal(result.total);
      setSources(result.sources);
      
      toast({
        title: "Favorite career search",
        description: `Found ${result.total} jobs for ${careerName}`,
      });
    } catch (error) {
      console.error("Error searching favorite career:", error);
      toast({
        title: "Search error",
        description: "Error searching for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Job Listings</h1>
          <p className="text-muted-foreground text-lg">
            Explore job opportunities in your area
          </p>

        </div>

        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for jobs (e.g., software engineer, graphic designer)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full"
              />
            </div>
            <div className="w-64">
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </Card>

        {/* Favorite Careers Quick Search */}
        {favoriteCareers.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h3 className="text-lg font-semibold">Quick Search: Your Favorite Careers</h3>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click any of your favorite career paths to instantly search for related jobs
            </p>
            <div className="flex flex-wrap gap-2">
              {favoriteCareers.map((career, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => searchFavoriteCareer(career.name)}
                  disabled={loading}
                  className="border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Heart className="w-3 h-3 mr-1 fill-current text-red-500" />
                  {career.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {career.match}%
                  </Badge>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {total > 0 && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {jobs.length} of {total.toLocaleString()} jobs
            </p>
            {sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Sources:</span>
                {sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source === 'career-db' ? 'CareerCompass' : 
                     source === 'remotive' ? 'Remotive' :
                     source === 'findwork' ? 'Findwork' :
                     source === 'jsearch' ? 'JSearch' : source}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to find your next opportunity?</h3>
            <p className="text-muted-foreground">
              Enter a job title and location above, then click search to explore available positions.
            </p>
          </div>
        )}

        <div className="space-y-4">
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
                {(job.salary_min || job.salary_max) && (
                  <div className="text-right">
                    <div className="font-bold text-accent">
                      ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">per year</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
              <div className="flex items-center justify-between">
                <Badge>{job.category}</Badge>
                <Button variant="outline" size="sm" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    View Job <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
