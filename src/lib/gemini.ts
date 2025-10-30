const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Simple in-memory cache
const cache = new Map<string, any>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCacheKey(data: any): string {
  return JSON.stringify(data);
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Fallback career data
const fallbackCareers = [
  { name: "Software Developer", match: 95, category: "Technology", description: "Design and develop software applications.", salary: "$70,000-$120,000", growth: "22% (Much faster than average)", education: "Bachelor's degree" },
  { name: "Data Scientist", match: 88, category: "Analytics", description: "Analyze complex data for business decisions.", salary: "$80,000-$130,000", growth: "35% (Much faster than average)", education: "Bachelor's degree" },
  { name: "UX Designer", match: 82, category: "Design", description: "Create user-friendly interfaces.", salary: "$60,000-$100,000", growth: "13% (Faster than average)", education: "Bachelor's degree" },
  { name: "Marketing Specialist", match: 78, category: "Marketing", description: "Develop marketing campaigns.", salary: "$45,000-$75,000", growth: "10% (Faster than average)", education: "Bachelor's degree" },
  { name: "Project Manager", match: 75, category: "Management", description: "Manage projects and teams.", salary: "$65,000-$110,000", growth: "7% (As fast as average)", education: "Bachelor's degree" }
];

export async function generateCareerMatches(assessmentData: any, count: number = 5): Promise<any[]> {
  try {
    console.log(`🚀 Generating ${count} career matches with Gemini 2.5 Flash...`);
    
    // Check cache first
    const cacheKey = getCacheKey({ assessmentData, count, type: 'careers' });
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log('✅ Using cached career matches');
      return cached;
    }
    
    const prompt = `Assessment: ${JSON.stringify(assessmentData)}

Generate ${count} career matches. Return JSON only:
[{"name":"Career","match":85,"category":"Tech","description":"Brief desc","salary":"$60K-$90K","growth":"5%","education":"Bachelor's"}]`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 1000
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    console.log('✅ Gemini API response received');
    
    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const careers = JSON.parse(jsonMatch[0]);
      const result = careers.length > 0 ? careers : fallbackCareers;
      
      // Cache the result
      setCache(cacheKey, result);
      
      return result;
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('❌ Gemini API failed:', error);
    console.log('Using career database');
    return fallbackCareers;
  }
}

export async function generateAdditionalCareerMatches(
  assessmentData: any, 
  existingCareers: string[], 
  count: number = 5
): Promise<any[]> {
  try {
    console.log(`🚀 Generating ${count} additional career matches with Gemini 2.5 Flash...`);
    
    // Create cache key
    const cacheKey = `additional_${JSON.stringify(assessmentData)}_${existingCareers.join(',')}_${count}`;
    
    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log('📦 Using cached additional career matches');
      return cached;
    }
    
    const prompt = `Assessment: ${JSON.stringify(assessmentData)}
Avoid: ${existingCareers.join(', ')}

Generate ${count} different careers. JSON only:
[{"name":"Career","match":75,"category":"Field","description":"Brief","salary":"$50K-$80K","growth":"3%","education":"Degree"}]`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 1000
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log('Raw Gemini response:', generatedText);

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }

    const careers = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${careers.length} career matches`);
    
    // Cache the result
    setCache(cacheKey, careers);
    
    return careers;
    
  } catch (error) {
    console.error('❌ Error generating additional career matches:', error);
    throw error;
  }
}

export async function generateCareerRoadmap(careerName: string): Promise<any> {
  try {
    console.log('🚀 Generating roadmap for', careerName, 'with Gemini 2.5 Flash...');
    
    const prompt = `Create a detailed career roadmap for: ${careerName}

Return ONLY a valid JSON object with this structure:
{
  "phases": [
    {
      "title": "Phase Name",
      "timeframe": "Time period",
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}

No other text or explanation.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('❌ Gemini roadmap failed:', error);
    console.log('Using career roadmap template');
    return {
      phases: [
        {
          title: "Getting Started",
          timeframe: "0-6 months",
          steps: [
            "Research the field and requirements",
            "Identify key skills needed",
            "Begin foundational learning",
            "Connect with professionals in the field"
          ]
        },
        {
          title: "Skill Development",
          timeframe: "6-18 months",
          steps: [
            "Complete relevant courses or certifications",
            "Build a portfolio of projects",
            "Gain practical experience through internships",
            "Develop both technical and soft skills"
          ]
        },
        {
          title: "Career Launch",
          timeframe: "18+ months",
          steps: [
            "Apply for entry-level positions",
            "Network within the industry",
            "Continue learning and staying updated",
            "Seek mentorship and career guidance"
          ]
        }
      ]
    };
  }
}

export async function generateCareerOverview(careerName: string): Promise<string> {
  try {
    console.log(`🚀 Generating overview for ${careerName} with Gemini 2.5 Flash...`);
    
    const prompt = `Write a comprehensive 3-paragraph overview of the career: ${careerName}

Include:
- What the job entails day-to-day
- Skills and qualities needed  
- Future outlook and opportunities

Write in a professional, informative tone. Do not include any formatting or markdown.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    return text.trim();
  } catch (error) {
    console.error('❌ Gemini overview failed:', error);
    console.log('Using career overview template');
    return `${careerName} is a dynamic and evolving career field that offers numerous opportunities for professional growth and development. This role typically involves working with cutting-edge technologies and methodologies to solve complex problems and deliver innovative solutions.

Professionals in this field need a combination of technical expertise, analytical thinking, and strong communication skills. The ability to adapt to changing technologies and continuous learning are essential qualities for success. Collaboration with cross-functional teams and stakeholders is often a key component of the role.

The future outlook for ${careerName} remains positive, with growing demand across various industries. As organizations continue to embrace digital transformation and innovation, opportunities in this field are expected to expand significantly. Career advancement often includes roles in leadership, specialization, or entrepreneurship.`;
  }
}
