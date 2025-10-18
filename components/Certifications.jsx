import { motion } from 'framer-motion';

export default function Certifications() {
  const certifications = [
    {
      id: 1,
      name: "AWS Certified Cloud Practitioner (CCP)",
      issuer: "Amazon Web Services",
      date: "2025",
      icon: "AWS",
      color: "from-orange-500 to-yellow-500"
    },
    {
      id: 2,
      name: "Machine Learning Specialization",
      issuer: "Coursera (Andrew Ng, Stanford University)",
      date: "2025",
      icon: "ML",
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <section id="certifications" className="section-padding bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Continuous learning and professional development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="relative overflow-hidden bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-primary transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cert.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>

              <div className="relative z-10">
                <div className="text-2xl font-bold text-primary mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {cert.name}
                </h3>
                <p className="text-primary mb-2">{cert.issuer}</p>
                <p className="text-gray-400 text-sm">{cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
