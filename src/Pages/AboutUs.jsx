import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 transition-transform transform hover:scale-105">
            Welcome to Our Learning Platform
          </h1>
          <p className="text-lg mb-8">
            Your gateway to personalized learning, skill exchanges, and community support.
          </p>
          <a
            href="#features"
            className="bg-white text-blue-600 py-3 px-8 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105"
          >
            Discover Our Features
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white" id="about">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">About Us</h2>
          <p className="text-gray-700 mb-4 max-w-3xl mx-auto">
            Our app is designed to make learning accessible to everyone, regardless of their background or location. We believe in the power of knowledge and the ability of individuals to share and learn from one another. 
          </p>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            With our platform, you can connect with expert instructors, engage in skill swaps, and explore a variety of courses that cater to your interests and needs.
          </p>
          <img
            src="https://img.freepik.com/free-vector/about-us-concept-illustration_114360-669.jpg?w=2000&t=st=1727814239~exp=1727814839~hmac=6a7a96fbad064fab182c1dfe956eb85b289c5703686478c7e25b19e5b502280c"
            alt="About Us"
            className="mx-auto rounded-lg shadow-2xl mb-8 transition-transform transform hover:scale-105"
          />
          <p className="text-gray-700 mb-4 max-w-3xl mx-auto">
            Join us in transforming the way knowledge is shared and acquired. Be part of a vibrant community that encourages continuous growth and collaboration!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-100" id="features">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Our Exceptional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Learning',
                description: 'Tailored learning paths designed to suit your individual needs and pace.',
              },
              {
                title: 'Skill Swap',
                description: 'Exchange skills with others and learn from each other’s expertise in a collaborative environment.',
              },
              {
                title: 'Expert Instructors',
                description: 'Connect with knowledgeable instructors who are passionate about teaching and dedicated to your success.',
              },
              {
                title: 'Interactive Platform',
                description: 'Enjoy a dynamic learning experience with interactive tools, quizzes, and resources that enhance your understanding.',
              },
              {
                title: 'Community Support',
                description: 'Join a vibrant community of learners and teachers for support, motivation, and networking opportunities.',
              },
              {
                title: 'Flexible Scheduling',
                description: 'Learn at your convenience with flexible class schedules that fit your lifestyle.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition-shadow hover:shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-semibold mb-6">Join Us Today!</h2>
        <p className="mb-4">Start your learning journey and exchange skills with others. Together, we can achieve greatness!</p>
        <a
          href="#"
          className="bg-white text-blue-600 py-3 px-8 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
