import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign, Calendar } from "lucide-react";
import type { Scholarship } from "@/types";
import { getScholarships } from "@/lib/scholarships";

const Scholarships = () => {
  const [page, setPage] = useState(1);
  const [displayedScholarships, setDisplayedScholarships] = useState<Scholarship[]>(() => {
    const { scholarships } = getScholarships(1, 6);
    return scholarships;
  });
  const [hasMore, setHasMore] = useState(() => {
    const { hasMore } = getScholarships(1, 6);
    return hasMore;
  });

  const loadMore = () => {
    const nextPage = page + 1;
    const { scholarships, hasMore: more } = getScholarships(nextPage, 6);
    setDisplayedScholarships([...displayedScholarships, ...scholarships]);
    setPage(nextPage);
    setHasMore(more);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Scholarship Opportunities</h1>
          <p className="text-muted-foreground text-lg">
            Discover financial aid opportunities to support your education and career goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayedScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-3">{scholarship.title}</h3>
                <div className="flex gap-4 mb-3">
                  <div className="flex items-center gap-2 text-accent">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-bold text-lg">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Due: {scholarship.deadline}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{scholarship.description}</p>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">Eligibility Requirements:</div>
                <div className="space-y-1">
                  {scholarship.eligibility.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant="default" asChild>
                <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button onClick={loadMore} size="lg" variant="default">
              Load More Scholarships
            </Button>
          </div>
        )}

        <Card className="mt-8 p-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-bold mb-3">Need Help Finding More Scholarships?</h3>
          <p className="text-muted-foreground mb-4">
            Visit these additional resources to find thousands more scholarship opportunities:
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Fastweb.com
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              Scholarships.com
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              CollegeBoard BigFuture
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              NYC Department of Education
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Scholarships;
