'use client';

import { motion } from 'framer-motion';

const contacts = [
  { name: "Pawan Maggu", company: "RELIABLE TRAVELS AND CARGO PRIVATE LIMITED", title: "Business Development Manager", linkedin: "https://linkedin.com/in/pawan-maggu-156498216" },
  { name: "Ashish Pandey", company: "Thomas Global Logistics Private Limited", title: "Business Development Executive", linkedin: "https://linkedin.com/in/ashish-pandey-5b809922a" },
  { name: "Annu Khurana", company: "SWIFT FREIGHT INDIA PVT LTD", title: "Manager - Business Development and Support", linkedin: "https://linkedin.com/in/annu-khurana-743b166b" },
  { name: "Abhishek Syal", company: "Savino Del Bene", title: "Branch Manager - North East", linkedin: "https://linkedin.com/in/abhishek-syal-98a56814" },
  { name: "Abhishek Bhandari", company: "Transpost", title: "Sales Manager North India", linkedin: "https://linkedin.com/in/abhishek-bhandari-b1a9629" },
  { name: "Rajesh Kumar", company: "Continental Carriers PVT LTD", title: "General Manager", linkedin: "https://linkedin.com/in/rajesh-kumar-77841514" },
  { name: "Roshan Kumar Thakur", company: "Continental Carriers PVT LTD", title: "Executive - Overseas Network Development", linkedin: "https://linkedin.com/in/roshan-kumar-thakur-488326283" },
  { name: "Ashish Gupta", company: "FIBS Logistics", title: "Deputy Manager Sales", linkedin: "https://linkedin.com/in/ashish-gupta2503" },
  { name: "Rajeev Uniyal", company: "AGI CARGO Pvt. Ltd", title: "Business Development Executive", linkedin: "https://linkedin.com/in/rajeev-uniyal-5556a83b" },
  { name: "Kriesh D. Malhotra", company: "Cargo World Logistics, Gurugram", title: "Business Development Manager", linkedin: "https://linkedin.com/in/kriesh-d-malhotra-450b53243" },
  { name: "Aseem Dua", company: "DHL Global Forwarding", title: "Head - Business Development IP", linkedin: "https://linkedin.com/in/aseem-dua-35873720" },
  { name: "Naresh Sharma", company: "Mach Worldwide Logistics India Pvt. Ltd.", title: "Business Development Manager", linkedin: "https://linkedin.com/in/naresh-sharma-b67704118" },
  { name: "Rajev Pal", company: "Pentagon International Freight Solutions Pvt Ltd", title: "Deputy Manager Sales Marketing", linkedin: "https://linkedin.com/in/rajevpal" },
  { name: "Gaurav Shekhawat", company: "Scanwell", title: "Assistant Sales Business Development Manager", linkedin: "https://linkedin.com/in/gaurav-shekhawat-9b82b5225" },
  { name: "Ashish Gehlot", company: "KKM Overseas Pvt Ltd", title: "Senior Business Development Manager", linkedin: "https://linkedin.com/in/ashish-gehlot-978a6a145" },
  { name: "Guddi Rawat", company: "Everfast Freight Forwarders Pvt Ltd", title: "Business Development Manager", linkedin: "https://linkedin.com/in/guddi-rawat-1bb6061b5" },
  { name: "Ravindra Goswami", company: "Global Transphere Shipping and Forwarding Services", title: "Business Development Manager", linkedin: "https://linkedin.com/in/ravindra-goswami-6a8a51331" },
  { name: "Sandeep Gulliya", company: "Everfast Freight Forwarders Pvt. Ltd.", title: "Business Development Manager", linkedin: "https://linkedin.com/in/sandeep-gulliya-2b4b1417" },
  { name: "Vishal Saxena", company: "AEROSHIP LOGISTICS PVT. LTD", title: "Director", linkedin: "https://linkedin.com/in/vishal-saxena-69593123" },
  { name: "Ravikant Tiwari", company: "OCL SHIPPING (INDIA) PRIVATE LIMITED", title: "Business Development Manager", linkedin: "https://linkedin.com/in/ravikant-tiwari-91534559" },
  { name: "Sanjeev Gupta", company: "CM Logistics India Pvt.Ltd.", title: "Manager Business Development", linkedin: "https://linkedin.com/in/sanjeev-gupta-601a562b" },
  { name: "Srishti Singh", company: "S & S BROKERAGE INC", title: "Business Development Executive", linkedin: "https://linkedin.com/in/srishti-singh-cheryl-590925219" },
  { name: "Priyanka Agrawal", company: "Prologis Freight", title: "Business Development Manager", linkedin: "https://linkedin.com/in/priyanka-agrawal-18228719" },
  { name: "Aman Bhandari", company: "DHL Global Forwarding", title: "Manager - Business Development - Life Science Healthcare", linkedin: "https://linkedin.com/in/aman-bhandari-8191396" },
  { name: "Sahil Kasana", company: "Seal Freight Logistics", title: "Business Development Manager", linkedin: "https://linkedin.com/in/sahil-kasana-689561240" },
];

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Business Development Contacts
          </h1>
          <p className="text-xl text-gray-400">
            Freight Forwarding Industry - New Delhi
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{contacts.length} contacts found</span>
          </div>
        </motion.div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.linkedin}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
            >
              {/* Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-blue-400 truncate">
                    {contact.title}
                  </p>
                </div>
              </div>

              {/* Company */}
              <div className="mb-4">
                <p className="text-sm text-gray-400">Company</p>
                <p className="text-gray-200 truncate">{contact.company}</p>
              </div>

              {/* LinkedIn Button */}
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                View Profile
              </a>
            </motion.div>
          ))}
        </div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </a>
        </motion.div>
      </div>
    </main>
  );
}
