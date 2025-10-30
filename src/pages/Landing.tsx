import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const stats = [
    {
      value: "50%",
      label: "of college students change majors at least once",
      source: "National Center for Education Statistics",
      icon: Users,
    },
    {
      value: "20-50%",
      label: "of students enter college undecided",
      source: "Penn State University",
      icon: Target,
    },
    {
      value: "75%",
      label: "of students cite parental influence on career choice",
      source: "Student Poll Research",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12" />
              CareerCompass
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Your Journey to Finding Your Passion Starts Here
            </p>
            <p className="text-lg text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
              Discover career paths tailored for NYC high school students through AI-powered assessments and real opportunities
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <Link to="/assessment-choice">
              <Button size="lg" variant="secondary" className="text-lg px-12 py-6">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 bg-white/95 backdrop-blur border-0 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <p className="text-xs text-muted-foreground italic">Source: {stat.source}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why CareerCompass?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Assessment</h3>
              <p className="text-muted-foreground">
                Take a comprehensive skills and interests assessment to find careers that truly match your unique profile
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Real Job Listings</h3>
              <p className="text-muted-foreground">
                Access hundreds of actual job postings and internships in the NYC area relevant to your interests
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Career Roadmaps</h3>
              <p className="text-muted-foreground">
                Get step-by-step guidance from high school to career success with detailed roadmaps for each path
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Mentorship Board</h3>
              <p className="text-muted-foreground">
                Connect with peers and mentors through our Q&A forum to get answers to your career questions
              </p>
            </Card>
            <Link to="/scholarships">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-xl font-semibold mb-3">Scholarship Database</h3>
                <p className="text-muted-foreground">
                  Discover scholarships and financial aid opportunities to support your education and career goals
                </p>
              </Card>
            </Link>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">NYC-Focused</h3>
              <p className="text-muted-foreground">
                Tailored specifically for New York City students with local opportunities and resources
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
