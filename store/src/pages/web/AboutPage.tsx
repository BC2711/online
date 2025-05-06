import { Button } from '@material-tailwind/react';
import { UserGroupIcon, GlobeAltIcon, LightBulbIcon, StarIcon } from '@heroicons/react/24/outline';
import aboutImage from '../../assets/home_img.jpg';
import teamImage from '../../assets/home_img.jpg';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold mb-6">Our Story</h1>
                    <p className="text-lg mb-8">
                        From humble beginnings to a global presence, our journey is fueled by passion and purpose.
                    </p>
                    <Button variant="gradient" size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                        Learn More
                    </Button>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 bg-gray-50">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Mission</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {[
                        {
                            title: 'Quality First',
                            description: 'We source only the finest materials and stand behind every product we make.',
                            icon: StarIcon,
                        },
                        {
                            title: 'Customer Focused',
                            description: 'Your satisfaction is our priority. We listen and adapt to your needs.',
                            icon: UserGroupIcon,
                        },
                        {
                            title: 'Sustainable Growth',
                            description: 'We’re committed to ethical business practices that benefit people and planet.',
                            icon: GlobeAltIcon,
                        },
                    ].map((mission, index) => (
                        <div
                            key={index}
                            className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <mission.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-3">{mission.title}</h3>
                            <p className="text-gray-600">{mission.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        <img
                            alt="Our team"
                            src={teamImage}
                            className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                        <p className="text-gray-600 mb-6">
                            We’re a diverse group of designers, engineers, and customer service professionals who share
                            a common passion for creating exceptional products.
                        </p>
                        <p className="text-gray-600 mb-8">
                            What unites us is our belief that good design should be accessible to everyone and that
                            business can be a force for positive change.
                        </p>
                        <Button variant="outline" className="mt-4">
                            Join Our Team
                        </Button>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {[
                        {
                            title: 'Integrity',
                            description: 'We do what’s right, even when no one is watching.',
                            icon: LightBulbIcon,
                        },
                        {
                            title: 'Innovation',
                            description: 'We challenge the status quo to create better solutions.',
                            icon: GlobeAltIcon,
                        },
                        {
                            title: 'Community',
                            description: 'We build relationships that go beyond transactions.',
                            icon: UserGroupIcon,
                        },
                        {
                            title: 'Excellence',
                            description: 'We take pride in our work and always strive to improve.',
                            icon: StarIcon,
                        },
                    ].map((value, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
                        >
                            <value.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}