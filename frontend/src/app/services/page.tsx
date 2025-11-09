'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  HeartIcon,
  LightBulbIcon,
  BriefcaseIcon,
  HomeIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function ServicesPage() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: AcademicCapIcon,
      title: 'University Selection',
      description: 'Expert guidance in choosing the right university and course based on your academic profile, interests, and career goals.',
    },
    {
      icon: DocumentTextIcon,
      title: 'Application Assistance',
      description: 'Complete support with university applications, including form filling, document preparation, and submission.',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Personal Statement Review',
      description: 'Professional review and editing of personal statements to make your application stand out.',
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Document Verification',
      description: 'Assistance with document verification, attestation, and preparation of all required paperwork.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Visa Guidance',
      description: 'Step-by-step support with visa applications, interview preparation, and documentation.',
    },
    {
      icon: UserGroupIcon,
      title: 'Pre-Departure Briefing',
      description: 'Comprehensive orientation sessions to prepare you for life and study abroad.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-fade-in-up">
                <SparklesIcon className="h-10 w-10" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {t.services.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t.services.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  {t.services.hero.getStarted}
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  {t.services.hero.browseCourses}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.services.main.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.services.main.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: AcademicCapIcon,
                  title: 'University Selection',
                  description: 'Expert guidance in choosing the right university and course based on your academic profile, interests, and career goals. We help you find the perfect match.',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: DocumentTextIcon,
                  title: 'Application Assistance',
                  description: 'Complete support with university applications, including form filling, document preparation, and submission. We ensure your application is perfect.',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: ChatBubbleLeftRightIcon,
                  title: 'Personal Statement Review',
                  description: 'Professional review and editing of personal statements to make your application stand out. Our experts help you tell your story effectively.',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  icon: ClipboardDocumentCheckIcon,
                  title: 'Document Verification',
                  description: 'Assistance with document verification, attestation, and preparation of all required paperwork. We handle the bureaucracy for you.',
                  color: 'from-accent to-accent-600',
                  bgColor: 'bg-red-50'
                },
                {
                  icon: GlobeAltIcon,
                  title: 'Visa Guidance',
                  description: 'Step-by-step support with visa applications, interview preparation, and documentation. We maximize your chances of visa approval.',
                  color: 'from-yellow-500 to-yellow-600',
                  bgColor: 'bg-yellow-50'
                },
                {
                  icon: CurrencyDollarIcon,
                  title: 'Scholarship Assistance',
                  description: 'Help you find and apply for scholarships, grants, and financial aid opportunities. We help reduce your education costs.',
                  color: 'from-indigo-500 to-indigo-600',
                  bgColor: 'bg-indigo-50'
                },
                {
                  icon: HomeIcon,
                  title: 'Accommodation Support',
                  description: 'Assistance in finding suitable accommodation near your university. We help you settle in comfortably.',
                  color: 'from-pink-500 to-pink-600',
                  bgColor: 'bg-pink-50'
                },
                {
                  icon: UserGroupIcon,
                  title: 'Pre-Departure Briefing',
                  description: 'Comprehensive orientation sessions to prepare you for life and study abroad. Cultural adaptation and practical tips.',
                  color: 'from-teal-500 to-teal-600',
                  bgColor: 'bg-teal-50'
                },
                {
                  icon: BriefcaseIcon,
                  title: 'Career Counseling',
                  description: 'Guidance on career paths, internships, and job opportunities. We help you plan your professional future.',
                  color: 'from-orange-500 to-orange-600',
                  bgColor: 'bg-orange-50'
                },
              ].map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-400 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-r ${service.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.services.process.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.services.process.subtitle}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              {[
                { 
                  step: 1, 
                  title: 'Initial Consultation', 
                  desc: 'Free one-on-one consultation to understand your academic goals, preferences, and requirements. We assess your profile and discuss the best options.',
                  icon: ChatBubbleLeftRightIcon
                },
                { 
                  step: 2, 
                  title: 'University Selection', 
                  desc: 'We shortlist universities and courses based on your academic profile, budget, and career aspirations. Get personalized recommendations.',
                  icon: AcademicCapIcon
                },
                { 
                  step: 3, 
                  title: 'Application Preparation', 
                  desc: 'Complete assistance with application forms, personal statements, references, and all required documents. We ensure everything is perfect.',
                  icon: DocumentTextIcon
                },
                { 
                  step: 4, 
                  title: 'Offer Management', 
                  desc: 'Review and compare offers from universities. We help you make an informed decision and accept the best offer for your future.',
                  icon: CheckCircleIcon
                },
                { 
                  step: 5, 
                  title: 'Visa Processing', 
                  desc: 'Complete visa application support including documentation, interview preparation, and guidance. We maximize your approval chances.',
                  icon: GlobeAltIcon
                },
                { 
                  step: 6, 
                  title: 'Pre-Departure & Beyond', 
                  desc: 'Final briefing, accommodation assistance, and continued support even after you arrive. We ensure a smooth transition.',
                  icon: RocketLaunchIcon
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-6 mb-8 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-soft">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-soft border-2 border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                        <Icon className="h-6 w-6 text-accent flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.services.whyChoose.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.services.whyChoose.subtitle}
              </p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheckIcon,
                  title: '100% Success Rate',
                  description: '95% of our students get accepted to their preferred universities',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: HeartIcon,
                  title: 'Personalized Care',
                  description: 'One-on-one attention and customized guidance for each student',
                  color: 'from-accent to-accent-600',
                  bgColor: 'bg-red-50'
                },
                {
                  icon: LightBulbIcon,
                  title: 'Expert Counselors',
                  description: '15+ years of experience in international education',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: GlobeAltIcon,
                  title: '100+ Universities',
                  description: 'Direct partnerships with top universities worldwide',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  icon: CurrencyDollarIcon,
                  title: 'No Hidden Fees',
                  description: 'Transparent pricing with no surprise charges',
                  color: 'from-yellow-500 to-yellow-600',
                  bgColor: 'bg-yellow-50'
                },
                {
                  icon: UserGroupIcon,
                  title: 'Lifetime Support',
                  description: 'Continued assistance even after you reach your destination',
                  color: 'from-indigo-500 to-indigo-600',
                  bgColor: 'bg-indigo-50'
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-400 transform hover:-translate-y-2 border-2 border-gray-100 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary-700 to-primary-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.services.cta.title}</h2>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed">
                {t.services.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  {t.services.cta.bookConsultation}
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  {t.services.cta.browseCourses}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
