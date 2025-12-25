'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  StarIcon,
  LightBulbIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const { t } = useLanguage();
  
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
                {t.about.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t.about.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  {t.about.hero.startJourney}
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  {t.about.hero.ourServices}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: TrophyIcon, number: '15+', label: t.about.stats.experience, color: 'from-blue-500 to-blue-600' },
                { icon: UserGroupIcon, number: '5000+', label: t.about.stats.students, color: 'from-green-500 to-green-600' },
                { icon: GlobeAltIcon, number: '100+', label: t.about.stats.universities, color: 'from-purple-500 to-purple-600' },
                { icon: StarIcon, number: '95%', label: t.about.stats.successRate, color: 'from-accent to-accent-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-soft`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in-up">
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">{t.about.story.title}</h2>
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    Founded in 2010, Sahara Student Services began with a simple yet powerful vision: to make world-class education accessible to students from all backgrounds. What started as a small consultancy has grown into one of the leading education service providers in the region.
                  </p>
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    Over the past 15 years, we've helped thousands of students achieve their dreams of studying at prestigious universities in the UK, USA, Canada, and Australia. Our success is built on personalized guidance, expert knowledge, and an unwavering commitment to student success.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Today, we continue to innovate and expand our services, ensuring that every student receives the support they need to succeed in their educational journey.
                  </p>
                </div>
                <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 shadow-soft-xl">
                    <div className="space-y-6">
                      {[
                        { year: '2010', event: 'Founded with a vision to help students globally' },
                        { year: '2015', event: 'Reached 1000+ successful placements' },
                        { year: '2018', event: 'Expanded to 50+ partner universities' },
                        { year: '2020', event: 'Launched digital platform for remote counseling' },
                        { year: '2023', event: 'Achieved 95% success rate milestone' },
                      ].map((milestone, index) => (
                        <div key={index} className="flex items-start space-x-4 text-white">
                          <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold">
                            {milestone.year}
                          </div>
                          <div className="flex-1 pt-3">
                            <p className="text-gray-100">{milestone.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: RocketLaunchIcon,
                  title: t.about.mission.title,
                  description: 'To empower students worldwide by providing expert guidance, comprehensive support, and personalized counseling throughout their international education journey. We are committed to making quality education accessible to all.',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: LightBulbIcon,
                  title: t.about.vision.title,
                  description: 'To be the world\'s most trusted education consultancy, recognized for our excellence, integrity, and commitment to student success. We envision a future where every student can achieve their academic dreams.',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50'
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-soft-lg border-2 border-gray-100 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bgColor} rounded-2xl mb-6`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-r ${item.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.about.values.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.about.values.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: TrophyIcon,
                  title: 'Excellence',
                  description: 'We strive for excellence in everything we do, ensuring the highest quality of service and support for our students.',
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  icon: ShieldCheckIcon,
                  title: 'Integrity',
                  description: 'We operate with honesty, transparency, and ethical practices, building trust with students and partners.',
                  color: 'from-green-500 to-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  icon: HeartIcon,
                  title: 'Care',
                  description: 'We genuinely care about each student\'s success and provide personalized attention throughout their journey.',
                  color: 'from-accent to-accent-600',
                  bgColor: 'bg-red-50'
                },
                {
                  icon: HandRaisedIcon,
                  title: 'Support',
                  description: 'We provide continuous, comprehensive support, guiding students every step of the way to success.',
                  color: 'from-purple-500 to-purple-600',
                  bgColor: 'bg-purple-50'
                },
              ].map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="group bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-400 transform hover:-translate-y-2 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${value.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-r ${value.color} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t.about.whyChoose.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.about.whyChoose.subtitle}
              </p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              {[
                { icon: CheckCircleIcon, title: 'Expert Counselors', description: 'Our team consists of experienced education consultants with in-depth knowledge of international admissions.' },
                { icon: CheckCircleIcon, title: 'Personalized Guidance', description: 'We provide one-on-one counseling tailored to your unique academic profile and career goals.' },
                { icon: CheckCircleIcon, title: 'University Partnerships', description: 'Direct partnerships with 100+ top universities worldwide for faster processing and better chances.' },
                { icon: CheckCircleIcon, title: 'Visa Assistance', description: 'Complete support with visa applications, documentation, and interview preparation.' },
                { icon: CheckCircleIcon, title: 'Scholarship Guidance', description: 'Help you find and apply for scholarships and financial aid opportunities.' },
                { icon: CheckCircleIcon, title: 'Post-Arrival Support', description: 'Continued assistance even after you reach your destination, ensuring a smooth transition.' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-soft border-2 border-gray-100 hover:border-primary/30 hover:shadow-soft-lg transition-all duration-400 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <Icon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg text-primary mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.about.cta.title}</h2>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 leading-relaxed">
                {t.about.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-xl font-semibold text-lg shadow-glow-accent hover:shadow-glow-accent/80 transform hover:-translate-y-0.5 transition-all duration-400">
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  {t.about.cta.getStarted}
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg border-2 border-white/30 transform hover:-translate-y-0.5 transition-all duration-400">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  {t.about.cta.exploreServices}
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
