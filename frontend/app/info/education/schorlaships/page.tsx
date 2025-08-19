import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  CalendarDays,
  GraduationCap,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
  School,
  Award,
  NotebookPen,
} from 'lucide-react';
import Image from 'next/image';

const Scholarship = () => {
  const scholarships = [
    {
      title: 'Academic Excellence Scholarship',
      amount: 'GHS 20,000',
      deadline: 'March 15, 2024',
      eligibility: 'High school graduates, GPA 3.5+',
      category: 'Academic',
      status: 'Open',
      requirements: [
        'Academic transcripts',
        'Personal statement',
        '2 teacher recommendations',
      ],
      image: 'https://images.pexels.com/photos/6146978/pexels-photo-6146978.jpeg'
    },
    {
      title: 'STEM Advancement Grant',
      amount: 'GHS 30,000',
      deadline: 'April 30, 2024',
      eligibility: 'Students pursuing STEM fields',
      category: 'Science & Technology',
      status: 'Open',
      requirements: [
        'Proof of STEM program admission',
        'Research proposal',
        'Math/Science teacher recommendation',
      ],
      image: 'https://images.pexels.com/photos/32711379/pexels-photo-32711379.jpeg'
    },
    {
      title: 'Girls Education Initiative',
      amount: 'GHS 25,000',
      deadline: 'May 20, 2024',
      eligibility: 'Female students, rural areas',
      category: 'Gender Equity',
      status: 'Open',
      requirements: [
        'Proof of enrollment',
        'Community leader recommendation',
        'Personal essay',
      ],
      image: 'https://images.pexels.com/photos/12804469/pexels-photo-12804469.jpeg'
    },
    {
      title: 'Future Leaders Program',
      amount: 'GHS 35,000',
      deadline: 'June 10, 2024',
      eligibility: 'Undergraduates with leadership potential',
      category: 'Leadership',
      status: 'Closing Soon',
      requirements: [
        'Leadership portfolio',
        'Community service records',
        'Interview',
      ],
      image: 'https://images.pexels.com/photos/29558443/pexels-photo-29558443.jpeg'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with African student photo */}
      <section className="relative bg-gradient-to-br from-blue-900/90 to-green-900/90 py-32 text-white">
        <Image 
          src="https://images.pexels.com/photos/5212683/pexels-photo-5212683.jpeg"
          alt="African students in classroom"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Education Scholarships for African Youth
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Investing in Africa's future through quality education for brilliant young minds across the continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-800 mb-2">1,200+</div>
              <div className="text-blue-600">Students Supported</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-800 mb-2">
                GHS 5M+
              </div>
              <div className="text-green-600">
                Scholarships Awarded
              </div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-800 mb-2">92%</div>
              <div className="text-yellow-600">Graduation Rate</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-800 mb-2">15</div>
              <div className="text-purple-600">African Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Scholarships */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Current Scholarship Opportunities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer various scholarship programs to support African youth in their educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {scholarships.map((scholarship, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={scholarship.image}
                    alt={scholarship.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl">
                      {scholarship.title}
                    </CardTitle>
                    <Badge
                      variant={
                        scholarship.status === 'Open'
                          ? 'default'
                          : 'destructive'
                      }
                      className="shrink-0"
                    >
                      {scholarship.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {scholarship.amount}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {scholarship.deadline}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Eligibility</h4>
                      <p className="text-gray-600">
                        {scholarship.eligibility}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-2">
                        {scholarship.requirements.map((req, reqIndex) => (
                          <li
                            key={reqIndex}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of our scholarship recipients who are making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.pexels.com/photos/19218034/pexels-photo-19218034.jpeg"
                  alt="Scholarship recipient"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Ama Mensah</h3>
                <p className="text-gray-600 mb-4">Medicine Student, University of Ghana</p>
                <p className="text-gray-500">
                  "The scholarship allowed me to pursue my dream of becoming a doctor without financial burden."
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.pexels.com/photos/9301463/pexels-photo-9301463.jpeg"
                  alt="Scholarship recipient"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Kwame Osei</h3>
                <p className="text-gray-600 mb-4">Computer Science, KNUST</p>
                <p className="text-gray-500">
                  "This support enabled me to focus on my studies and develop an app that helps farmers."
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.pexels.com/photos/5999918/pexels-photo-5999918.jpeg"
                  alt="Scholarship recipient"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Fatima Diallo</h3>
                <p className="text-gray-600 mb-4">Engineering Student, University of Lagos</p>
                <p className="text-gray-500">
                  "The mentorship program connected me with industry leaders who guided my career path."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                How To Apply
              </h2>
              <p className="text-blue-200">
                Follow these simple steps to apply for our scholarships
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/10 rounded-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Prepare Documents
                </h3>
                <p className="text-blue-200">
                  Gather your academic records, recommendation letters, and personal statement
                </p>
              </div>

              <div className="text-center p-6 bg-white/10 rounded-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Complete Application
                </h3>
                <p className="text-blue-200">
                  Fill out our online form and upload all required documents
                </p>
              </div>

              <div className="text-center p-6 bg-white/10 rounded-lg">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Interview & Selection
                </h3>
                <p className="text-blue-200">
                  Shortlisted candidates will be invited for an interview
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Future?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Apply today for a chance to receive full or partial scholarship for your education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Application
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarship;