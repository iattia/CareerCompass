export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
}

export function generateJobSearchLinks(careerName: string, location: string = "New York"): JobListing[] {
  const encodedCareer = encodeURIComponent(careerName);
  const encodedLocation = encodeURIComponent(location);
  const careerSlug = careerName.toLowerCase().replace(/\s+/g, '-');

  return [
    {
      id: "indeed-1",
      title: `${careerName} - ${location}`,
      company: "Various Companies",
      location: location,
      url: `https://www.indeed.com/jobs?q=${encodedCareer}&l=${encodedLocation}`,
      source: "Indeed"
    },
    {
      id: "linkedin-1",
      title: `${careerName} Opportunities`,
      company: "Multiple Employers",
      location: location,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodedCareer}&location=${encodedLocation}`,
      source: "LinkedIn"
    },
    {
      id: "glassdoor-1",
      title: `${careerName} Jobs`,
      company: "Leading Companies",
      location: location,
      url: `https://www.glassdoor.com/Job/${location.toLowerCase().replace(/\s+/g, '-')}-${careerSlug}-jobs-SRCH_IL.0,8_IC1132348_KO9.htm`,
      source: "Glassdoor"
    }
  ];
}
