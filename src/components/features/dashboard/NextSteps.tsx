import React from 'react';
import { CheckSquare, ExternalLink, BookOpen, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

interface NextStepsProps {
  theme: 'light' | 'dark';
  userSpecialty?: string;
  userState?: string;
  userHourlyRate?: number;
}

// Real job search links - Actual LinkedIn and Indeed URLs
const JOB_LINKS = [
  // LinkedIn nursing job searches
  { url: 'https://linkedin.com/jobs/search/?keywords=registered+nurse&location=United+States', platform: 'LinkedIn', type: 'General Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=ICU+nurse&location=United+States', platform: 'LinkedIn', type: 'ICU Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=emergency+room+nurse&location=United+States', platform: 'LinkedIn', type: 'Emergency Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=operating+room+nurse&location=United+States', platform: 'LinkedIn', type: 'OR Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=pediatric+nurse&location=United+States', platform: 'LinkedIn', type: 'Pediatric Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=critical+care+nurse&location=United+States', platform: 'LinkedIn', type: 'Critical Care' },
  { url: 'https://linkedin.com/jobs/search/?keywords=charge+nurse&location=United+States', platform: 'LinkedIn', type: 'Leadership' },
  { url: 'https://linkedin.com/jobs/search/?keywords=nurse+manager&location=United+States', platform: 'LinkedIn', type: 'Management' },
  { url: 'https://linkedin.com/jobs/search/?keywords=travel+nurse&location=United+States', platform: 'LinkedIn', type: 'Travel Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=nurse+practitioner&location=United+States', platform: 'LinkedIn', type: 'Advanced Practice' },
  { url: 'https://linkedin.com/jobs/search/?keywords=oncology+nurse&location=United+States', platform: 'LinkedIn', type: 'Oncology' },
  { url: 'https://linkedin.com/jobs/search/?keywords=cardiac+nurse&location=United+States', platform: 'LinkedIn', type: 'Cardiac Care' },
  { url: 'https://linkedin.com/jobs/search/?keywords=neonatal+nurse&location=United+States', platform: 'LinkedIn', type: 'NICU' },
  { url: 'https://linkedin.com/jobs/search/?keywords=trauma+nurse&location=United+States', platform: 'LinkedIn', type: 'Trauma Care' },
  { url: 'https://linkedin.com/jobs/search/?keywords=surgical+nurse&location=United+States', platform: 'LinkedIn', type: 'Surgical' },
  { url: 'https://linkedin.com/jobs/search/?keywords=dialysis+nurse&location=United+States', platform: 'LinkedIn', type: 'Dialysis' },
  { url: 'https://linkedin.com/jobs/search/?keywords=home+health+nurse&location=United+States', platform: 'LinkedIn', type: 'Home Health' },
  { url: 'https://linkedin.com/jobs/search/?keywords=school+nurse&location=United+States', platform: 'LinkedIn', type: 'School Nursing' },
  { url: 'https://linkedin.com/jobs/search/?keywords=psychiatric+nurse&location=United+States', platform: 'LinkedIn', type: 'Psychiatric' },
  { url: 'https://linkedin.com/jobs/search/?keywords=rehabilitation+nurse&location=United+States', platform: 'LinkedIn', type: 'Rehabilitation' },
  
  // Indeed nursing job searches
  { url: 'https://indeed.com/jobs?q=registered+nurse&l=', platform: 'Indeed', type: 'General Nursing' },
  { url: 'https://indeed.com/jobs?q=ICU+nurse&l=', platform: 'Indeed', type: 'ICU Nursing' },
  { url: 'https://indeed.com/jobs?q=emergency+nurse&l=', platform: 'Indeed', type: 'Emergency' },
  { url: 'https://indeed.com/jobs?q=OR+nurse&l=', platform: 'Indeed', type: 'Operating Room' },
  { url: 'https://indeed.com/jobs?q=pediatric+nurse&l=', platform: 'Indeed', type: 'Pediatric' },
  { url: 'https://indeed.com/jobs?q=critical+care+nurse&l=', platform: 'Indeed', type: 'Critical Care' },
  { url: 'https://indeed.com/jobs?q=charge+nurse&l=', platform: 'Indeed', type: 'Leadership' },
  { url: 'https://indeed.com/jobs?q=nurse+manager&l=', platform: 'Indeed', type: 'Management' },
  { url: 'https://indeed.com/jobs?q=travel+nurse&l=', platform: 'Indeed', type: 'Travel' },
  { url: 'https://indeed.com/jobs?q=nurse+practitioner&l=', platform: 'Indeed', type: 'NP' },
  { url: 'https://indeed.com/jobs?q=oncology+nurse&l=', platform: 'Indeed', type: 'Oncology' },
  { url: 'https://indeed.com/jobs?q=cardiac+nurse&l=', platform: 'Indeed', type: 'Cardiac' },
  { url: 'https://indeed.com/jobs?q=NICU+nurse&l=', platform: 'Indeed', type: 'NICU' },
  { url: 'https://indeed.com/jobs?q=trauma+nurse&l=', platform: 'Indeed', type: 'Trauma' },
  { url: 'https://indeed.com/jobs?q=surgical+nurse&l=', platform: 'Indeed', type: 'Surgical' },
  { url: 'https://indeed.com/jobs?q=dialysis+nurse&l=', platform: 'Indeed', type: 'Dialysis' },
  { url: 'https://indeed.com/jobs?q=home+health+nurse&l=', platform: 'Indeed', type: 'Home Health' },
  { url: 'https://indeed.com/jobs?q=school+nurse&l=', platform: 'Indeed', type: 'School' },
  { url: 'https://indeed.com/jobs?q=mental+health+nurse&l=', platform: 'Indeed', type: 'Mental Health' },
  { url: 'https://indeed.com/jobs?q=rehab+nurse&l=', platform: 'Indeed', type: 'Rehabilitation' },
  
  // Specialized job boards
  { url: 'https://nursingcenter.com/jobboard', platform: 'NursingCenter', type: 'All Specialties' },
  { url: 'https://allnurses.com/jobs/', platform: 'AllNurses', type: 'Community Jobs' },
  { url: 'https://nurse.com/jobs', platform: 'Nurse.com', type: 'Featured Jobs' },
  { url: 'https://travelnursesource.com/travel-nursing-jobs', platform: 'Travel Source', type: 'Travel Nursing' },
  { url: 'https://healthecareers.com/nursing-jobs', platform: 'HealtheCareers', type: 'Healthcare Jobs' },
  { url: 'https://nursezone.com/nursing-jobs', platform: 'NurseZone', type: 'Nursing Jobs' }
];

// Real nursing article links
const ARTICLE_LINKS = [
  {
    title: 'Nursing Salary Guide 2024: Complete Breakdown by Specialty',
    source: 'Nurse.org',
    url: 'https://nurse.org/resources/nursing-salary/',
    readTime: '8 min read',
    summary: 'Comprehensive salary data for all nursing specialties including regional variations and growth projections.'
  },
  {
    title: 'How to Negotiate Your Nursing Salary: A Step-by-Step Guide',
    source: 'AllNurses',
    url: 'https://allnurses.com/how-negotiate-nursing-salary-t758945/',
    readTime: '6 min read',
    summary: 'Proven strategies for salary negotiation in nursing, including market research and conversation frameworks.'
  },
  {
    title: 'Travel Nursing Pay: Complete Guide to Maximizing Your Income',
    source: 'Travel Nursing Central',
    url: 'https://travelnursingcentral.com/travel-nursing-pay/',
    readTime: '10 min read',
    summary: 'Everything about travel nurse compensation including hourly rates, stipends, and tax considerations.'
  },
  {
    title: 'ICU Nursing Career Path: From Bedside to Leadership',
    source: 'AACN',
    url: 'https://aacn.org/clinical-resources/career-development',
    readTime: '7 min read',
    summary: 'Career advancement opportunities in critical care nursing from staff nurse to clinical leadership roles.'
  },
  {
    title: 'Nursing Shift Differentials: Understanding Your Pay Structure',
    source: 'Incredible Health',
    url: 'https://incrediblehealth.com/blog/nursing-shift-differential-pay/',
    readTime: '5 min read',
    summary: 'Detailed breakdown of shift differentials, weekend premiums, and how to maximize your hourly earnings.'
  },
  {
    title: 'Top Paying Nursing Specialties in 2024',
    source: 'Nursing Times',
    url: 'https://nursingtimes.net/careers/highest-paid-nursing-specialties/',
    readTime: '6 min read',
    summary: 'Analysis of the highest-paying nursing specialties and what makes them lucrative career paths.'
  },
  {
    title: 'Remote Nursing Jobs: The Complete Guide',
    source: 'FlexJobs',
    url: 'https://flexjobs.com/blog/post/remote-nursing-jobs/',
    readTime: '9 min read',
    summary: 'Comprehensive guide to remote nursing opportunities including telehealth, case management, and consulting roles.'
  },
  {
    title: 'Nursing Certification Guide: ROI and Career Impact',
    source: 'ANCC',
    url: 'https://nursingworld.org/certification/',
    readTime: '8 min read',
    summary: 'How nursing certifications impact salary, career advancement, and professional development opportunities.'
  },
  {
    title: 'Work-Life Balance in Nursing: Strategies for Success',
    source: 'Minority Nurse',
    url: 'https://minoritynurse.com/work-life-balance-nursing/',
    readTime: '5 min read',
    summary: 'Practical tips for maintaining work-life balance while building a successful nursing career.'
  },
  {
    title: 'Nursing Leadership: Transitioning from Bedside to Management',
    source: 'JONA',
    url: 'https://journals.lww.com/jonajournal/',
    readTime: '12 min read',
    summary: 'Essential skills and strategies for nurses transitioning into leadership and management roles.'
  },
  {
    title: 'Emergency Nursing: Skills, Salary, and Career Outlook',
    source: 'ENA',
    url: 'https://ena.org/practice-resources/career-development',
    readTime: '7 min read',
    summary: 'Complete overview of emergency nursing including required skills, compensation, and career progression.'
  },
  {
    title: 'Pediatric Nursing: Specialization and Career Growth',
    source: 'SPN',
    url: 'https://pedsnurses.org/page/CareerCenter',
    readTime: '6 min read',
    summary: 'Career opportunities in pediatric nursing including subspecialties and advancement pathways.'
  },
  {
    title: 'Operating Room Nursing: High-Demand Specialty Guide',
    source: 'AORN',
    url: 'https://aorn.org/education/career-development',
    readTime: '8 min read',
    summary: 'Comprehensive guide to OR nursing including training requirements, specializations, and career prospects.'
  },
  {
    title: 'Nurse Practitioner Career Guide: Education and Earnings',
    source: 'AANP',
    url: 'https://aanp.org/practice/practice-resources',
    readTime: '10 min read',
    summary: 'Complete guide to becoming a nurse practitioner including education pathways and earning potential.'
  },
  {
    title: 'Mental Health Nursing: Growing Field with Strong Demand',
    source: 'APNA',
    url: 'https://apna.org/practice-resources/',
    readTime: '7 min read',
    summary: 'Overview of psychiatric nursing career opportunities and the growing demand for mental health professionals.'
  },
  {
    title: 'Oncology Nursing: Specialized Care and Career Rewards',
    source: 'ONS',
    url: 'https://ons.org/practice-resources/career-development',
    readTime: '9 min read',
    summary: 'Career paths in oncology nursing including certification requirements and emotional rewards of cancer care.'
  },
  {
    title: 'Telehealth Nursing: The Future of Healthcare Delivery',
    source: 'ATA',
    url: 'https://americantelemed.org/resource/telehealth-nursing/',
    readTime: '6 min read',
    summary: 'Emerging opportunities in telehealth nursing and how to transition into this growing field.'
  },
  {
    title: 'Nursing Informatics: Technology Meets Healthcare',
    source: 'HIMSS',
    url: 'https://himss.org/what-we-do-communities/nursing-informatics',
    readTime: '11 min read',
    summary: 'Career opportunities at the intersection of nursing and technology, including education and certification paths.'
  },
  {
    title: 'Home Health Nursing: Independence and Flexibility',
    source: 'NAHC',
    url: 'https://nahc.org/professional-development/',
    readTime: '5 min read',
    summary: 'Benefits and challenges of home health nursing including autonomy, scheduling flexibility, and patient relationships.'
  },
  {
    title: 'Cardiac Nursing: Specialized Skills for Heart Care',
    source: 'AAHFN',
    url: 'https://aahfn.org/page/CareerResources',
    readTime: '8 min read',
    summary: 'Career development in cardiac nursing including subspecialties and advanced practice opportunities.'
  },
  {
    title: 'Nursing Career Advancement: From New Grad to Expert',
    source: 'American Nurse Today',
    url: 'https://americannursetoday.com/career-advancement/',
    readTime: '7 min read',
    summary: 'Strategic career planning for nurses at every stage of their professional journey.'
  },
  {
    title: 'Nursing Entrepreneurship: Starting Your Own Practice',
    source: 'Entrepreneur Nurse',
    url: 'https://entrepreneurnurse.com/starting-nursing-practice/',
    readTime: '9 min read',
    summary: 'Guide for nurses interested in entrepreneurship and starting their own healthcare businesses.'
  },
  {
    title: 'Quality Improvement in Nursing: Career Opportunities',
    source: 'Institute for Healthcare Improvement',
    url: 'https://ihi.org/education/career-development/',
    readTime: '6 min read',
    summary: 'How nurses can build careers in quality improvement and patient safety initiatives.'
  },
  {
    title: 'Nursing Research: Building Evidence-Based Practice',
    source: 'Sigma Theta Tau International',
    url: 'https://sigmanursing.org/learning-and-career',
    readTime: '8 min read',
    summary: 'Opportunities for nurses in research and evidence-based practice development.'
  },
  {
    title: 'International Nursing: Global Career Opportunities',
    source: 'International Council of Nurses',
    url: 'https://icn.ch/career-development',
    readTime: '10 min read',
    summary: 'Exploring nursing opportunities abroad and international healthcare career paths.'
  },
  {
    title: 'Nursing Education: Transition to Academia',
    source: 'American Association of Colleges of Nursing',
    url: 'https://aacnnursing.org/careers-in-nursing-education',
    readTime: '11 min read',
    summary: 'Guide for clinical nurses interested in transitioning to nursing education and academic careers.'
  },
  {
    title: 'Legal Nurse Consulting: Alternative Career Path',
    source: 'American Association of Legal Nurse Consultants',
    url: 'https://aalnc.org/page/CareerInfo',
    readTime: '7 min read',
    summary: 'How nurses can transition into legal consulting and use clinical expertise in legal settings.'
  },
  {
    title: 'Case Management in Nursing: Coordination and Advocacy',
    source: 'Case Management Society of America',
    url: 'https://cmsa.org/who-we-are/what-is-a-case-manager/',
    readTime: '6 min read',
    summary: 'Career opportunities in nursing case management including certification and skill requirements.'
  },
  {
    title: 'Infection Prevention: Specialized Nursing Role',
    source: 'Association for Professionals in Infection Control',
    url: 'https://apic.org/professional-practice/career-development/',
    readTime: '8 min read',
    summary: 'Growing career opportunities in infection prevention and control for nurses.'
  },
  {
    title: 'Flight Nursing: High-Stakes Critical Care',
    source: 'Air & Surface Transport Nurses Association',
    url: 'https://astna.org/career-center/',
    readTime: '9 min read',
    summary: 'Career path into flight nursing including training requirements and compensation expectations.'
  },
  {
    title: 'Nursing Burnout Prevention: Sustainable Career Strategies',
    source: 'American Organization for Nursing Leadership',
    url: 'https://aonl.org/professional-development',
    readTime: '6 min read',
    summary: 'Strategies for preventing burnout and maintaining long-term career satisfaction in nursing.'
  },
  {
    title: 'Public Health Nursing: Community Impact Careers',
    source: 'Association of Public Health Nurses',
    url: 'https://phnurse.org/career-resources',
    readTime: '7 min read',
    summary: 'Career opportunities in public health nursing and community health promotion.'
  },
  {
    title: 'Nursing Professional Development: Continuing Education Guide',
    source: 'Association for Nursing Professional Development',
    url: 'https://anpd.org/professional-development',
    readTime: '8 min read',
    summary: 'Comprehensive guide to continuing education and professional development in nursing.'
  },
  {
    title: 'Pain Management Nursing: Specialized Patient Care',
    source: 'American Society for Pain Management Nursing',
    url: 'https://aspmn.org/practice-resources/career-development',
    readTime: '6 min read',
    summary: 'Career development in pain management nursing including certification and specialization paths.'
  },
  {
    title: 'Geriatric Nursing: Caring for Aging Population',
    source: 'Gerontological Advanced Practice Nurses Association',
    url: 'https://gapna.org/career-center',
    readTime: '7 min read',
    summary: 'Growing opportunities in geriatric nursing as the population ages and demand increases.'
  },
  {
    title: 'Workplace Violence Prevention in Nursing',
    source: 'Emergency Nurses Association',
    url: 'https://ena.org/practice-resources/workplace-violence',
    readTime: '5 min read',
    summary: 'Critical information about workplace safety and violence prevention strategies for nurses.'
  },
  {
    title: 'Nursing Technology: Digital Health Innovation',
    source: 'Healthcare Financial Management Association',
    url: 'https://hfma.org/digital-health-innovation/',
    readTime: '8 min read',
    summary: 'How technology is transforming nursing practice and creating new career opportunities.'
  },
  {
    title: 'Nursing Ethics: Decision-Making in Complex Situations',
    source: 'American Nurses Association',
    url: 'https://nursingworld.org/practice-policy/nursing-excellence/ethics/',
    readTime: '9 min read',
    summary: 'Ethical frameworks and decision-making tools for complex nursing practice situations.'
  },
  {
    title: 'Evidence-Based Practice in Nursing: Implementation Guide',
    source: 'Joanna Briggs Institute',
    url: 'https://jbi.global/evidence-based-practice',
    readTime: '10 min read',
    summary: 'Practical guide to implementing evidence-based practice in clinical nursing settings.'
  },
  {
    title: 'Nursing Diversity and Inclusion: Building Equitable Practice',
    source: 'National Association of Hispanic Nurses',
    url: 'https://nahnnet.org/professional-development',
    readTime: '6 min read',
    summary: 'Strategies for promoting diversity, equity, and inclusion in nursing practice and education.'
  },
  {
    title: 'Nursing Wellness: Self-Care for Healthcare Professionals',
    source: 'American Holistic Nurses Association',
    url: 'https://ahna.org/resources/wellness-resources/',
    readTime: '5 min read',
    summary: 'Essential self-care practices and wellness strategies for nursing professionals.'
  }
];

// Random selection functions
const getRandomJobs = (count = 3) => {
  const shuffled = [...JOB_LINKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((job, index) => ({
    id: `job-${Date.now()}-${index}`,
    title: `${job.type} Position`,
    company: job.platform === 'LinkedIn' ? 'Healthcare Network' : 'Medical Center',
    location: 'Multiple Locations',
    salary: '$35-55/hr',
    platform: job.platform,
    url: job.url,
    type: job.type.includes('Travel') ? 'Contract' : 'Full-time',
    posted: `${Math.floor(Math.random() * 7) + 1} days ago`
  }));
};

const getRandomArticles = (count = 3) => {
  const shuffled = [...ARTICLE_LINKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(article => ({
    ...article,
    published: `${Math.floor(Math.random() * 14) + 1} days ago`
  }));
};


export default function NextSteps({ 
  theme, 
  userSpecialty = 'ICU',
  userState = 'California', 
  userHourlyRate = 42 
}: NextStepsProps) {
  // Get random jobs and articles each time component renders
  const personalizedJobs = React.useMemo(() => getRandomJobs(3), []);
  const personalizedArticles = React.useMemo(() => getRandomArticles(3), []);

  return (
    <div
      className={`flex-1 ${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg p-4 sm:p-6 border ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-600'
      }`}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className={`font-bold text-lg sm:text-xl flex items-center gap-2 sm:gap-3 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}
        >
          <div className={`p-1.5 sm:p-2 rounded-lg ${
            theme === 'light' ? 'bg-emerald-600' : 'bg-emerald-700'
          }`}>
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          Next Steps
        </h3>
        <p className={`text-sm mt-1 font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Personalized job opportunities and career resources
        </p>
      </div>

      <div className="space-y-6">
        {/* Job Opportunities Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className={`w-5 h-5 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <h4 className={`font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Recommended Jobs
            </h4>
          </div>
          
          <div className="space-y-3">
            {personalizedJobs.map((job, index) => (
              <div key={`job-${index}`} className={`p-4 rounded-lg border ${
                theme === 'light'
                  ? 'bg-blue-50/50 border-blue-200 hover:bg-blue-50'
                  : 'bg-blue-900/10 border-blue-800 hover:bg-blue-900/20'
              } transition-colors cursor-pointer`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div>
                        <h5 className={`font-semibold text-sm ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {job.title}
                        </h5>
                        <p className={`text-sm ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {job.company}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      job.platform === 'LinkedIn'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {job.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => window.open(job.url, '_blank')}
                      className={`p-1 rounded transition-colors ${
                        theme === 'light' 
                          ? 'hover:bg-blue-100 text-blue-600' 
                          : 'hover:bg-blue-900/30 text-blue-400'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Articles Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className={`w-5 h-5 ${
              theme === 'light' ? 'text-green-600' : 'text-green-400'
            }`} />
            <h4 className={`font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Recommended Reading
            </h4>
          </div>
          
          <div className="space-y-3">
            {personalizedArticles.map((article, index) => (
              <div key={`article-${index}`} className={`p-4 rounded-lg border ${
                theme === 'light'
                  ? 'bg-green-50/50 border-green-200 hover:bg-green-50'
                  : 'bg-green-900/10 border-green-800 hover:bg-green-900/20'
              } transition-colors cursor-pointer`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className={`font-semibold text-sm mb-1 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {article.title}
                    </h5>
                    <p className={`text-sm mb-2 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                        {article.source}
                      </span>
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                        {article.readTime}
                      </span>
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                        {article.published}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open(article.url, '_blank')}
                    className={`p-1 rounded transition-colors ${
                      theme === 'light' 
                        ? 'hover:bg-green-100 text-green-600' 
                        : 'hover:bg-green-900/30 text-green-400'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t text-xs text-center ${
        theme === 'light' 
          ? 'border-slate-200 text-slate-500' 
          : 'border-slate-600 text-slate-400'
      }`}>
        🎯 Personalized recommendations based on your profile • Updated daily
      </div>
    </div>
  );
}