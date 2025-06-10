import { Heart, Quote, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SuccessStories() {
  const stories = [
    {
      id: 1,
      couple: {
        bride: { name: 'Priya Sharma', age: 26, city: 'Mumbai' },
        groom: { name: 'Rajesh Kumar', age: 29, city: 'Delhi' }
      },
      weddingDate: '2024-02-14',
      story: "We found each other through Indian Matrimony and instantly connected over our shared love for classical music and travel. Our families met, and everything fell into place perfectly. Thank you for helping us find our soulmate!",
      image: '/api/placeholder/400/300',
      tags: ['Love Marriage', 'Inter-city', 'Music Lovers']
    },
    {
      id: 2,
      couple: {
        bride: { name: 'Anita Patel', age: 24, city: 'Ahmedabad' },
        groom: { name: 'Vikram Singh', age: 27, city: 'Jaipur' }
      },
      weddingDate: '2024-01-20',
      story: "Our families were looking for a traditional match, and Indian Matrimony's detailed filters helped us find each other. The horoscope matching feature gave our families confidence in our compatibility.",
      image: '/api/placeholder/400/300',
      tags: ['Traditional', 'Horoscope Match', 'Family Approved']
    },
    {
      id: 3,
      couple: {
        bride: { name: 'Deepika Reddy', age: 28, city: 'Hyderabad' },
        groom: { name: 'Arjun Nair', age: 31, city: 'Bangalore' }
      },
      weddingDate: '2023-12-10',
      story: "As working professionals, we appreciated the platform's focus on career and education compatibility. We connected over our shared ambitions and values, leading to a beautiful relationship.",
      image: '/api/placeholder/400/300',
      tags: ['Professionals', 'Career Focused', 'Modern']
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Success Stories' },
    { number: '2M+', label: 'Happy Families' },
    { number: '95%', label: 'Success Rate' },
    { number: '6 months', label: 'Average Time to Match' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real couples, real love stories. Discover how thousands of couples found their perfect match 
            and started their journey of love through our platform.
          </p>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-rose-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story) => (
            <div key={story.id} className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={story.image}
                  alt={`${story.couple.bride.name} & ${story.couple.groom.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <Heart className="h-4 w-4 text-rose-600 fill-current" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Couple Names */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {story.couple.bride.name} & {story.couple.groom.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {story.couple.bride.city}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(story.weddingDate).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-rose-300" />
                  <p className="text-gray-700 text-sm leading-relaxed pl-4 italic">
                    "{story.story}"
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Your Love Story Awaits
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who found their perfect match. Start your journey today 
              and become our next success story.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 px-8">
                  Find Your Match
                </Button>
              </Link>
              <Link href="/success-stories">
                <Button size="lg" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8">
                  Read More Stories
                </Button>
              </Link>
            </div>

            {/* Testimonial Quote */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-rose-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-4 w-4 text-rose-500 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-700 text-center italic mb-4">
                  "Indian Matrimony made our search so much easier. The detailed profiles and 
                  family background information helped us make an informed decision. We're grateful 
                  for bringing us together!"
                </blockquote>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Meera & Rohit</div>
                  <div className="text-sm text-gray-600">Married in March 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
