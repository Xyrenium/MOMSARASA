import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ShieldCheck, Utensils } from 'lucide-react';

export const WhyMomsarasa: React.FC = () => {
  const highlights = [
    {
      icon: Flame,
      title: 'Freshly Fried To Order',
      desc: 'Setiap porsi digoreng dadakan saat pesanan Anda masuk untuk menjamin kerenyahan maksimal keemasan yang menggoda selera.',
      tag: '01 / FRESH',
    },
    {
      icon: Sparkles,
      title: '100% Kentang Asli Pilihan',
      desc: 'Dibuat dari varietas kentang berkualitas tinggi dengan tekstur kulit rustic gurih di luar dan lembut empuk di bagian dalam.',
      tag: '02 / POTATO',
    },
    {
      icon: Utensils,
      title: '4 Pilihan Saus Racikan',
      desc: 'Creamy Tartar asam segar, Smoky Paprika Mayo, Fresh Salsa eksotis, hingga saus keju cheddar lumer yang creamy.',
      tag: '03 / SAUCE',
    },
    {
      icon: ShieldCheck,
      title: 'Halal & Higienis',
      desc: 'Menggunakan bahan baku premium bermutu terjamin, minyak goreng berkualitas, dan standar kebersihan dapur yang ketat.',
      tag: '04 / QUALITY',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#DC2626]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                Craftsmanship
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                MOMSARASA Standards
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#111827]">
              Why MOMSARASA?
            </h3>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md">
            Komitmen kami menyajikan street Western Snack & olahan kentang dengan cita rasa bintang lima namun tetap ramah di kantong.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="p-6 rounded-3xl bg-[#FAF9F6] border border-gray-100 hover:border-[#DC2626]/30 hover:bg-white transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-[#DC2626] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#DC2626] group-hover:text-white group-hover:border-[#DC2626] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#111827] text-base mb-2">
                    {item.title}
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
