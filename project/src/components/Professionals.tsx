import { motion } from 'framer-motion';
import { Phone, MessageCircle, Star, Clock, Trophy, MapPin, Shield } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  role: 'Trainer' | 'Doctor' | 'Nutritionist';
  specialization: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  image: string;
  experience: string;
  location: string;
  color: string;
}

const professionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    role: 'Doctor',
    specialization: 'Sports Medicine & Orthopedics',
    rating: 4.9,
    reviews: 128,
    hourlyRate: 1500,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '12+ Years',
    location: 'Mumbai, MH',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Trainer',
    specialization: 'Strength & Conditioning',
    rating: 4.8,
    reviews: 245,
    hourlyRate: 800,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '8 Years',
    location: 'Delhi, DL',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '3',
    name: 'Dr. Anita Desai',
    role: 'Nutritionist',
    specialization: 'Clinical Nutrition & Dietetics',
    rating: 5.0,
    reviews: 94,
    hourlyRate: 1200,
    image: 'https://images.unsplash.com/photo-1594824436998-dfbc67ca40bb?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '10 Years',
    location: 'Bangalore, KA',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    role: 'Trainer',
    specialization: 'Functional Training & HIIT',
    rating: 4.7,
    reviews: 186,
    hourlyRate: 600,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '5 Years',
    location: 'Pune, MH',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '5',
    name: 'Dr. Robert Chen',
    role: 'Doctor',
    specialization: 'Physical Therapy & Rehab',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 1800,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '15 Years',
    location: 'Hyderabad, TS',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '6',
    name: 'Elena Rostova',
    role: 'Trainer',
    specialization: 'Yoga & Flexibility',
    rating: 4.9,
    reviews: 312,
    hourlyRate: 700,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '7 Years',
    location: 'Chennai, TN',
    color: 'from-orange-500 to-red-500'
  }
];

const Professionals = () => {
  return (
    <section className="min-h-screen px-6 pt-32 pb-24 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight">
            Expert Consultations
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Connect with top-tier fitness trainers, doctors, and nutritionists via call or text. Get the personalized guidance you need to reach your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionals.map((pro, index) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <img 
                  src={pro.image} 
                  alt={pro.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pro.color} shadow-lg`}>
                    {pro.role}
                  </span>
                </div>
              </div>

              <div className="p-6 relative">
                {/* Rating Badge */}
                <div className="absolute -top-6 right-6 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 flex items-center space-x-1 shadow-xl z-20">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-bold text-sm">{pro.rating}</span>
                  <span className="text-slate-400 text-xs">({pro.reviews})</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {pro.name}
                </h2>
                <p className="text-cyan-500 text-sm font-medium mb-4">{pro.specialization}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span>{pro.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span>{pro.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">Consultation</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">₹{pro.hourlyRate}</span>
                    <span className="text-slate-500 text-xs">/hr</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20">
                    <MessageCircle className="w-4 h-4" />
                    <span>Text</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Verified Professionals</h3>
              <p className="text-slate-400 text-sm">All experts undergo strict verification process</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-slate-300">
            <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-2" /> 4.9 Average Rating</span>
            <span className="mx-4 text-slate-600">|</span>
            <span className="flex items-center"><Clock className="w-4 h-4 text-cyan-400 mr-2" /> 24/7 Availability</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Professionals;
