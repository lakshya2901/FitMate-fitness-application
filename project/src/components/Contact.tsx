import { useState } from 'react';
import { Mail, Globe, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    alert('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Contact Us
        </h2>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Have questions? We'd love to hear from you
        </p>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-3">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="How can we help?"
            />
          </div>

          <div className="mb-8">
            <label className="block text-cyan-400 font-semibold mb-3">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              rows={6}
              placeholder="Your message"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3"
          >
            <Send className="w-6 h-6" />
            Send Message
          </button>

          <div className="mt-12 pt-12 border-t border-cyan-500/20">
            <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400">Get In Touch</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300">support@fitmate.ai</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300">www.fitmate.ai</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-300">Available worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
