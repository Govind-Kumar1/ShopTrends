import React from 'react'
import Title from '../components/Title'
import about_img from '../assets/about_img.png'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      {/* Title Section */}
      <div className="pt-8 text-2xl text-center border-t">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* About Content */}
      <div className="flex flex-col gap-16 my-10 md:flex-row px-4">
        <img className="w-full md:max-w-[450px] rounded-md shadow-md" src={about_img} alt="About Photo" />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            👋 Welcome to <strong>ShopTrends</strong>, where fashion meets passion!  
            We’re committed to delivering the freshest fashion trends, handpicked for quality, comfort, and design.  
            Whether you're dressing up for an occasion or refreshing your daily wardrobe, our collections are made to inspire.
          </p>
          <p>
            🌟 Our goal is to make style accessible, fun, and expressive for everyone.  
            From a smooth browsing experience to fast delivery and reliable support — everything we do is designed around you.  
            We're thrilled to be part of your fashion journey.
          </p>

          {/* Mission */}
          <b className="text-gray-800 text-lg">🎯 Our Mission</b>
          <p>
            To empower individuals to express their unique identity through trend-forward, high-quality fashion.  
            We strive to make fashion inclusive, exciting, and confidence-boosting.
          </p>

          {/* Vision */}
          <b className="text-gray-800 text-lg">🌍 Our Vision</b>
          <p>
            To become a global leader in fashion by setting trends, delivering quality, and promoting self-expression through style.  
            ShopTrends aspires to be your go-to destination for everything fashion.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-4 text-xl">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className="flex flex-col mb-20 text-sm md:flex-row px-4 gap-4">
        {/* Quality */}
        <div className="flex flex-col gap-5 px-6 py-8 border rounded-md md:px-10 sm:py-12">
          <b className="text-gray-800 text-base">✅ Quality Assurance</b>
          <p className="text-gray-600">
            Every piece we offer is selected with care and inspected thoroughly.  
            Your satisfaction matters — that’s why quality is at the heart of everything we do.
          </p>
        </div>

        {/* Convenience */}
        <div className="flex flex-col gap-5 px-6 py-8 border rounded-md md:px-10 sm:py-12">
          <b className="text-gray-800 text-base">🚚 Shopping Convenience</b>
          <p className="text-gray-600">
            Seamless shopping experience with easy navigation, quick shipping, simple returns,  
            and secure payments — so you can focus on what matters: looking great!
          </p>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-5 px-6 py-8 border rounded-md md:px-10 sm:py-12">
          <b className="text-gray-800 text-base">🤝 Exceptional Support</b>
          <p className="text-gray-600">
            Our friendly customer service team is here for you — whether it’s a query,  
            feedback, or just fashion advice, we’re ready to help you every step of the way.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  )
}

export default About
