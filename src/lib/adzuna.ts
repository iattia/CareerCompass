const ADZUNA_APP_ID = '5c8eae0c';
const ADZUNA_API_KEY = 'e2b6989bf5e8562cca3932e2a09f5bd7';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  url: string;
  created: string;
  category: string;
}

// Sample job data when API is unavailable
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Software Developer',
    company: 'Tech Corp',
    location: 'New York, NY',
    salary_min: 80000,
    salary_max: 120000,
    description: 'We are looking for a talented software developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
    url: 'https://example.com/job/1',
    created: new Date().toISOString(),
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Marketing Specialist',
    company: 'Marketing Inc',
    location: 'New York, NY',
    salary_min: 60000,
    salary_max: 80000,
    description: 'Join our marketing team to create compelling campaigns and drive brand awareness. Experience with digital marketing tools preferred.',
    url: 'https://example.com/job/2',
    created: new Date().toISOString(),
    category: 'Marketing'
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'Data Solutions',
    location: 'New York, NY',
    salary_min: 70000,
    salary_max: 95000,
    description: 'Analyze large datasets to extract meaningful insights and support business decisions. Proficiency in SQL and Python required.',
    url: 'https://example.com/job/3',
    created: new Date().toISOString(),
    category: 'Analytics'
  },
  {
    id: '4',
    title: 'Graphic Designer',
    company: 'Creative Studio',
    location: 'New York, NY',
    salary_min: 55000,
    salary_max: 75000,
    description: 'Create visual content for various media including websites, print materials, and social media. Strong portfolio required.',
    url: 'https://example.com/job/4',
    created: new Date().toISOString(),
    category: 'Design'
  },
  {
    id: '5',
    title: 'Sales Representative',
    company: 'Sales Pro',
    location: 'New York, NY',
    salary_min: 50000,
    salary_max: 90000,
    description: 'Build relationships with clients and drive sales growth. Commission-based compensation with excellent earning potential.',
    url: 'https://example.com/job/5',
    created: new Date().toISOString(),
    category: 'Sales'
  }
];

export async function searchJobs(
  query: string, 
  location: string = 'New York', 
  page: number = 1
): Promise<{ jobs: Job[]; total: number }> {
// Filter sample jobs based on search query
  const filterSampleJobs = (searchQuery: string) => {
    return sampleJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Due to CORS restrictions in browser environment, we'll use sample data
  // In a production environment, this API call would be made from a backend server
  try {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredJobs = filterSampleJobs(query);
    
    // Add some variety to mock data based on query
    let enhancedJobs = [...filteredJobs];
    
    if (query.toLowerCase().includes('software') || query.toLowerCase().includes('developer')) {
      enhancedJobs.push({
        id: 'dev-1',
        title: 'Frontend Developer',
        company: 'StartupTech',
        location: location,
        salary_min: 75000,
        salary_max: 105000,
        description: 'Join our team to build amazing user interfaces using React, TypeScript, and modern web technologies.',
        url: 'https://example.com/frontend-dev',
        created: new Date().toISOString(),
        category: 'Technology'
      });
    }
    
    if (query.toLowerCase().includes('design') || query.toLowerCase().includes('graphic')) {
      enhancedJobs.push({
        id: 'design-1',
        title: 'UX/UI Designer',
        company: 'Design Hub',
        location: location,
        salary_min: 65000,
        salary_max: 85000,
        description: 'Create beautiful and functional user experiences for web and mobile applications.',
        url: 'https://example.com/ux-designer',
        created: new Date().toISOString(),
        category: 'Design'
      });
    }
    
    if (query.toLowerCase().includes('data') || query.toLowerCase().includes('analyst')) {
      enhancedJobs.push({
        id: 'data-1',
        title: 'Junior Data Scientist',
        company: 'DataCorp',
        location: location,
        salary_min: 75000,
        salary_max: 100000,
        description: 'Work with machine learning models and big data to derive business insights.',
        url: 'https://example.com/data-scientist',
        created: new Date().toISOString(),
        category: 'Analytics'
      });
    }
    
    // Remove duplicates and limit results
    const uniqueJobs = enhancedJobs.filter((job, index, self) => 
      index === self.findIndex(j => j.id === job.id)
    );
    
    return {
      jobs: uniqueJobs.slice(0, 20),
      total: uniqueJobs.length,
    };
    
  } catch (error) {
    console.warn('Using job database due to API limitations');
    
    const filteredJobs = filterSampleJobs(query);
    return {
      jobs: filteredJobs.slice(0, 20),
      total: filteredJobs.length,
    };
  }
}
