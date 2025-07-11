import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
import contact_img from '../assets/contact_img.png'

const Contact = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="pt-10 text-2xl text-center border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Contact Info Section */}
      <div className="flex flex-col justify-center gap-10 my-10 md:flex-row mb-28 px-4">
        <img
          className="w-full md:max-w-[480px] rounded-md shadow-md"
          src={contact_img}
          alt="Contact Photo"
        />

        <div className="flex flex-col items-start justify-center gap-6 text-gray-700">
          {/* Store Info */}
          <div>
            <p className="text-xl font-semibold text-gray-800">🏬 Our Store</p>
            <p>
              ShopTrends<br />
              230 Fashion Lane,<br />
              Headquarters – Kanpur, Uttar Pradesh
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-xl font-semibold text-gray-800">📞 Get in Touch</p>
            <p>
              Phone: (+91)-523-3432-223<br />
              Email: <a href="mailto:contact.shoptrends@info.com" className="underline">contact.shoptrends@info.com</a>
            </p>
          </div>

          {/* Careers Section */}
          <div>
            <p className="text-xl font-semibold text-gray-800">💼 Careers at ShopTrends</p>
            <p>
              👗 Do you live and breathe fashion? <br />
              🚀 Ready to make your mark in the e-commerce world?<br />
              At <strong>ShopTrends</strong>, we’re always on the lookout for creative thinkers, passionate trendsetters,
              and driven individuals to join our vibrant team. Help us shape the future of fashion — one trend at a time!
            </p>
            <button className="mt-4 px-8 py-3 text-sm font-medium border border-black hover:bg-black hover:text-white transition-all duration-300">
              Explore Job Openings
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  )
}

export default Contact
