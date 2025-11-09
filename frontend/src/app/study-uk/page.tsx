'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  AcademicCapIcon, 
  GlobeAltIcon, 
  CurrencyPoundIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function StudyUKPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-fade-in-up">
                <span className="text-5xl">🇬🇧</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {t.studyUK.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t.studyUK.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/courses?country=United Kingdom" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  {t.studyUK.hero.browseCourses}
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  {t.studyUK.hero.getConsultation}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: BuildingLibraryIcon, number: '130+', label: t.studyUK.stats.universities, color: 'from-blue-500 to-blue-600' },
                { icon: UserGroupIcon, number: '600K+', label: t.studyUK.stats.students, color: 'from-green-500 to-green-600' },
                { icon: ChartBarIcon, number: 'Top 10', label: t.studyUK.stats.ranking, color: 'from-purple-500 to-purple-600' },
                { icon: BriefcaseIcon, number: '2 Years', label: t.studyUK.stats.workVisa, color: 'from-accent to-accent-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-soft`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why UK Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.whyUK.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.whyUK.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BuildingLibraryIcon,
                  title: 'World-Class Education',
                  description: 'Home to 4 of the world\'s top 10 universities including Oxford, Cambridge, Imperial College London, and UCL. UK degrees are recognized and respected worldwide.',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: ClockIcon,
                  title: 'Shorter Course Duration',
                  description: 'Undergraduate degrees take 3 years and postgraduate degrees just 1 year, compared to 4 and 2 years in other countries. Save time and money!',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: BriefcaseIcon,
                  title: 'Post-Study Work Visa',
                  description: 'Graduate Route visa allows you to work in the UK for 2 years (3 years for PhD graduates) after completing your studies.',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  icon: UserGroupIcon,
                  title: 'Multicultural Environment',
                  description: 'Study alongside students from over 200 countries. Experience diverse cultures and build a global network.',
                  color: 'from-accent to-accent-600',
                  bgColor: 'bg-red-50'
                },
                {
                  icon: SparklesIcon,
                  title: 'Research Excellence',
                  description: 'UK universities are at the forefront of research and innovation, with world-leading facilities and Nobel Prize-winning faculty.',
                  color: 'from-yellow-500 to-yellow-600',
                  bgColor: 'bg-yellow-50'
                },
                {
                  icon: GlobeAltIcon,
                  title: 'English Language',
                  description: 'Study in English and improve your language skills in the birthplace of the English language. Enhance your global career prospects.',
                  color: 'from-indigo-500 to-indigo-600',
                  bgColor: 'bg-indigo-50'
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="group bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-400 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${benefit.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-accent transition-colors">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Universities */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.topUniversities.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.topUniversities.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: 'University of Oxford', rank: '#1', location: 'Oxford', programs: '350+' },
                { name: 'University of Cambridge', rank: '#2', location: 'Cambridge', programs: '330+' },
                { name: 'Imperial College London', rank: '#6', location: 'London', programs: '200+' },
                { name: 'University College London', rank: '#8', location: 'London', programs: '400+' },
                { name: 'London School of Economics', rank: '#12', location: 'London', programs: '140+' },
                { name: 'University of Edinburgh', rank: '#15', location: 'Edinburgh', programs: '500+' },
                { name: 'University of Manchester', rank: '#27', location: 'Manchester', programs: '1000+' },
                { name: 'King\'s College London', rank: '#35', location: 'London', programs: '180+' },
                { name: 'University of Warwick', rank: '#67', location: 'Coventry', programs: '120+' },
              ].map((uni, index) => (
                <div key={index} className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 p-6 rounded-2xl shadow-soft hover:shadow-soft-xl hover:border-primary/30 transition-all duration-400 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary group-hover:text-accent transition-colors mb-2">{uni.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {uni.location}
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-soft">
                      {uni.rank}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {uni.programs} {t.studyUK.topUniversities.programs}
                    </div>
                    <Link href="/courses" className="text-accent hover:text-accent-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      {t.studyUK.topUniversities.view} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Study Fields */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.popularFields.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.popularFields.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { name: 'Business & Management', icon: '💼', courses: '500+' },
                { name: 'Engineering', icon: '⚙️', courses: '450+' },
                { name: 'Computer Science', icon: '💻', courses: '380+' },
                { name: 'Medicine & Healthcare', icon: '🏥', courses: '320+' },
                { name: 'Law', icon: '⚖️', courses: '280+' },
                { name: 'Arts & Design', icon: '🎨', courses: '350+' },
                { name: 'Social Sciences', icon: '📊', courses: '420+' },
                { name: 'Natural Sciences', icon: '🔬', courses: '390+' },
              ].map((field, index) => (
                <div key={index} className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-xl transition-all duration-400 transform hover:-translate-y-2 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-400">{field.icon}</div>
                  <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-accent transition-colors">{field.name}</h3>
                  <p className="text-sm text-gray-600">{field.courses} {t.studyUK.popularFields.courses}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Entry Requirements */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.requirements.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.requirements.subtitle}
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {[
                  {
                    icon: DocumentTextIcon,
                    title: t.studyUK.requirements.academic,
                    items: [
                      { label: 'Undergraduate', value: 'A-levels, IB, or equivalent (typically AAA-BBB)' },
                      { label: 'Postgraduate', value: 'Bachelor\'s degree with 2:1 or above (60%+)' },
                      { label: 'PhD', value: 'Master\'s degree with distinction or merit' },
                    ]
                  },
                  {
                    icon: GlobeAltIcon,
                    title: t.studyUK.requirements.language,
                    items: [
                      { label: 'IELTS', value: '6.0-7.5 overall (varies by course)' },
                      { label: 'TOEFL iBT', value: '80-100 (varies by course)' },
                      { label: 'PTE Academic', value: '59-75 (varies by course)' },
                    ]
                  },
                ].map((req, index) => {
                  const Icon = req.icon;
                  return (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-soft-lg border-2 border-gray-100 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-primary to-primary-700 rounded-2xl flex items-center justify-center mr-4 shadow-soft">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary">{req.title}</h3>
                      </div>
                      <div className="space-y-4">
                        {req.items.map((item, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">{item.label}</div>
                              <div className="text-gray-600 text-sm">{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center">
                  <DocumentTextIcon className="h-7 w-7 mr-3" />
                  {t.studyUK.requirements.additional}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Personal Statement (500-1000 words)',
                    'Academic References (2-3 required)',
                    'CV/Resume (for postgraduate)',
                    'Portfolio (for creative courses)',
                    'Interview (for some courses)',
                    'Work Experience (for some programs)',
                  ].map((req, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost of Study */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.cost.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.cost.subtitle}
              </p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {[
                {
                  title: t.studyUK.cost.tuition,
                  icon: CurrencyPoundIcon,
                  items: [
                    { label: 'Undergraduate', value: '£10,000 - £38,000/year' },
                    { label: 'Postgraduate', value: '£12,000 - £45,000/year' },
                    { label: 'MBA', value: '£15,000 - £60,000/year' },
                  ],
                  color: 'from-green-500 to-green-600'
                },
                {
                  title: t.studyUK.cost.living,
                  icon: MapPinIcon,
                  items: [
                    { label: 'London', value: '£1,400 - £1,800/month' },
                    { label: 'Other Cities', value: '£900 - £1,300/month' },
                    { label: 'Accommodation', value: '£500 - £1,000/month' },
                  ],
                  color: 'from-blue-500 to-blue-600'
                },
              ].map((cost, index) => {
                const Icon = cost.icon;
                return (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-soft-lg border-2 border-gray-100 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-r ${cost.color} rounded-2xl flex items-center justify-center mr-4 shadow-soft`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary">{cost.title}</h3>
                    </div>
                    <div className="space-y-4">
                      {cost.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                          <span className="text-gray-700 font-medium">{item.label}</span>
                          <span className="text-primary font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.studyUK.process.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.studyUK.process.subtitle}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              {[
                { step: 1, title: 'Choose Your Course', description: 'Browse universities and programs that match your interests and qualifications', icon: AcademicCapIcon },
                { step: 2, title: 'Check Requirements', description: 'Review entry requirements and prepare necessary documents', icon: DocumentTextIcon },
                { step: 3, title: 'Submit Application', description: 'Apply through UCAS (undergraduate) or directly to universities (postgraduate)', icon: CheckCircleIcon },
                { step: 4, title: 'Receive Offer', description: 'Get conditional or unconditional offers from universities', icon: SparklesIcon },
                { step: 5, title: 'Apply for Visa', description: 'Apply for your Student visa once you accept an offer', icon: GlobeAltIcon },
                { step: 6, title: 'Prepare to Travel', description: 'Arrange accommodation, book flights, and prepare for your journey', icon: MapPinIcon },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex gap-6 mb-8 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-soft">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-soft border-2 border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-gradient-to-br from-primary via-primary-700 to-primary-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.studyUK.cta.title}</h2>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed">
                {t.studyUK.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <SparklesIcon className="h-6 w-6 mr-2" />
                  {t.studyUK.cta.getStarted}
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  {t.studyUK.cta.browseCourses}
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
