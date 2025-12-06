function ContactForm() {
  return (
    <div className="bg-orange-500 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-white text-3xl font-bold text-center mb-2">Got questions?</h2>
        <p className="text-white text-center mb-8">We've got you.</p>
        
        <div className="bg-white rounded-lg p-8">
          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="What is your first name?"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="What is your last name?"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="What is your email address?"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="What is your phone number?"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Tell us more about your project..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded font-medium hover:bg-orange-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactForm