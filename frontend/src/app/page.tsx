'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AcademicCapIcon, GlobeAltIcon, UserGroupIcon, DocumentCheckIcon, SparklesIcon, RocketLaunchIcon, CheckBadgeIcon, StarIcon, ClipboardDocumentCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Trigger stats animation when section is visible
      const statsSection = document.getElementById('stats');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-primary-900">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}></div>
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative container-custom text-center z-10">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <SparklesIcon className="h-5 w-5 text-accent" />
              <span className="text-white font-medium">Trusted by 10,000+ Students Worldwide</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="heading-xl text-white mb-6 max-w-5xl mx-auto">
              Your Gateway to
              <span className="block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-300 to-white">World-Class Education</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Expert guidance for international students pursuing higher education in the UK and United States
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/register"
                className="group relative px-10 py-5 bg-gradient-to-r from-accent to-accent-600 text-white rounded-2xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-1 transition-all duration-400 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <RocketLaunchIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              
              <Link
                href="/courses"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transform hover:-translate-y-1 transition-all duration-400"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Students Placed', icon: UserGroupIcon },
              { number: '150+', label: 'Partner Universities', icon: GlobeAltIcon },
              { number: '95%', label: 'Success Rate', icon: CheckBadgeIcon },
              { number: '25+', label: 'Years Experience', icon: AcademicCapIcon },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-400 transform hover:-translate-y-2"
                  style={{
                    animation: statsVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  <Icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-primary mb-4">Why Choose Sahara?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support throughout your educational journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: AcademicCapIcon,
                title: 'Expert Counseling',
                description: 'Personalized guidance from experienced education consultants with deep knowledge of UK and US admissions',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: GlobeAltIcon,
                title: 'Global Network',
                description: 'Partnerships with 150+ top universities in the UK and US, giving you access to the best institutions',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: DocumentCheckIcon,
                title: 'Application Support',
                description: 'End-to-end assistance with applications, essays, interviews, and visa processes',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: UserGroupIcon,
                title: 'Success Stories',
                description: '10,000+ students successfully placed in top universities with 95% acceptance rate',
                color: 'from-accent to-accent-600'
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group card-interactive text-center"
                >
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity rounded-full`}></div>
                    <div className={`relative w-20 h-20 mx-auto bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-400 shadow-soft`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Study Destinations */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-primary mb-4">Study Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from world-renowned universities in the UK and US
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* UK Card */}
            <Link
              href="/study-uk"
              className="group relative overflow-hidden rounded-3xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-600 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-800"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
              
              <div className="relative p-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">🇬🇧</div>
                <h3 className="text-3xl font-bold mb-4 text-white">Study in the UK</h3>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Discover world-class universities in the United Kingdom. From Oxford to Cambridge, 
                  explore prestigious institutions with rich academic traditions and cutting-edge research.
                </p>
                <div className="flex items-center text-accent-200 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Explore UK Universities</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* US Card */}
            <div className="group relative overflow-hidden rounded-3xl shadow-soft-lg transition-all duration-600">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
              
              <div className="relative p-10">
                <div className="text-6xl mb-6 opacity-50">🇺🇸</div>
                <h3 className="text-3xl font-bold mb-4 text-white">Study in the US</h3>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Access top American universities and colleges. Experience diverse academic programs 
                  and cutting-edge research opportunities at Ivy League and state universities.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  <span>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-primary mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey to studying abroad in 4 simple steps
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Free Consultation',
                description: 'Book a free consultation with our expert counselors to discuss your goals, preferences, and academic profile.',
                icon: ChatBubbleLeftRightIcon,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'University Selection',
                description: 'We help you shortlist the best universities that match your profile, budget, and career aspirations.',
                icon: AcademicCapIcon,
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                title: 'Application Support',
                description: 'Get complete assistance with applications, essays, documents, and interview preparation.',
                icon: ClipboardDocumentCheckIcon,
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '04',
                title: 'Visa & Departure',
                description: 'We guide you through visa applications and prepare you for your journey abroad.',
                icon: RocketLaunchIcon,
                color: 'from-accent to-accent-600'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-6 mb-12 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-soft`}>
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-soft border-2 border-gray-100 hover:border-primary/30 hover:shadow-soft-lg transition-all duration-400">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about studying abroad
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: 'What services do you provide?',
                answer: 'We provide comprehensive support including university selection, application assistance, personal statement review, visa guidance, scholarship assistance, and pre-departure briefing. Our services cover the entire journey from initial consultation to arrival at your destination.'
              },
              {
                question: 'How much do your services cost?',
                answer: 'We offer free initial consultation. Our service packages vary depending on your needs, from basic application support to comprehensive end-to-end guidance. Contact us for detailed pricing information tailored to your requirements.'
              },
              {
                question: 'Which countries do you specialize in?',
                answer: 'We specialize in UK universities with partnerships with 150+ institutions including Oxford, Cambridge, Imperial College, and LSE. We also provide guidance for US universities and are expanding to other destinations.'
              },
              {
                question: 'What are the entry requirements for UK universities?',
                answer: 'Requirements vary by university and course. Generally, you need: Academic qualifications (A-levels, IB, or equivalent for undergraduate; Bachelor\'s degree for postgraduate), English language proficiency (IELTS 6.0-7.5 or equivalent), personal statement, references, and sometimes portfolio or interview.'
              },
              {
                question: 'How long does the application process take?',
                answer: 'The timeline varies but typically: University applications take 2-4 weeks to prepare, universities respond within 4-8 weeks, and visa processing takes 3-4 weeks. We recommend starting 6-12 months before your intended start date.'
              },
              {
                question: 'Do you help with scholarships?',
                answer: 'Yes! We help identify scholarship opportunities, prepare strong applications, and guide you through the scholarship application process. Many of our students have successfully secured partial or full scholarships.'
              },
              {
                question: 'What is your success rate?',
                answer: 'We have a 95% success rate in securing university admissions for our students. Over 10,000 students have successfully been placed in top universities worldwide through our guidance.'
              },
              {
                question: 'Can I apply to multiple universities?',
                answer: 'Absolutely! We recommend applying to 5-8 universities to maximize your chances. We help you create a balanced list of reach, target, and safety schools based on your profile.'
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-400 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg text-gray-900 list-none">
                  <span className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-primary-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </span>
                  <svg
                    className="w-6 h-6 text-primary transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100 mt-4">
                  <p className="pl-12">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
          
          {/* Still have questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">Still have questions?</p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-700 text-white rounded-xl font-semibold shadow-soft-lg hover:shadow-soft-xl transform hover:-translate-y-1 transition-all duration-400"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Contact Our Team
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Info */}
              <div className="animate-fade-in-up">
                <h2 className="heading-lg text-primary mb-6">Let's Start Your Journey</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Have questions about studying abroad? Our expert counselors are here to help. 
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: CheckBadgeIcon,
                      title: 'Free Consultation',
                      description: 'No obligation, just expert advice'
                    },
                    {
                      icon: UserGroupIcon,
                      title: 'Expert Counselors',
                      description: '15+ years of experience'
                    },
                    {
                      icon: GlobeAltIcon,
                      title: '150+ Universities',
                      description: 'Access to top institutions worldwide'
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding bg-gradient-to-r from-primary via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative container-custom text-center">
          <h2 className="heading-lg mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Join 10,000+ students who have achieved their dreams of studying abroad with Sahara Student Services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/register"
              className="group px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg shadow-soft-xl hover:shadow-glow transform hover:-translate-y-1 hover:scale-105 transition-all duration-400"
            >
              <span className="flex items-center space-x-2">
                <span>Create Free Account</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <Link
              href="/courses"
              className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transform hover:-translate-y-1 transition-all duration-400"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
