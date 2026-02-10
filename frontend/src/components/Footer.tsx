// src/components/Footer.jsx
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import logo from '../assets/logo2.png'

const Footer = () => (
  //   {/* Footer - expanded */}
  <footer className="bg-[#5186cd] text-white py-12 text-2xl">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
      <div>
        <div className="font-semibold text-2xl">LearniLM🌎World</div>
        {/* {new Date().getFullYear()} */}
        <div className="text-lg text-slate-300 mt-2 ">© 2025 LearniLM🌎World — All rights reserved</div>
        {/* email */}
        <div className="mt-4 text-xl text-slate-300">
          Email:{' '}
          <a
            href="mailto:support@learnilmworld.com"
            onClick={(e) => {
              // fallback to Gmail if mailto fails
              setTimeout(() => {
                window.open(
                  'https://mail.google.com/mail/?view=cm&fs=1&to=support@learnilmworld.com',
                  '_blank'
                )
              }, 300)
            }}
            className="hover:underline hover:text-white"
          >
            support@learnilmworld.com
          </a>

        </div>
        {/* phone */}
        <div className="text-xl text-slate-300">
          Phone:{' '}
          <a
            href="tel:+918100261773"
            className="hover:underline hover:text-white"
          >
            +91 81002 61773
          </a>
        </div>

      </div>

      <div className=''>
        <div className="font-semibold">Company</div>
        <ul className="mt-3 space-y-2 text-slate-300 text-xl">
          <li><Link to="/about#about" className="hover:underline">About</Link></li>
          <li><Link to="/about#careers" className="hover:underline">Careers</Link></li>
          <li><Link to="/about#blog" className="hover:underline">Blog</Link></li>
        </ul>
      </div>

      <div>
        <div className="font-semibold ">Resources</div>
        <ul className="mt-3 space-y-2 text-xl text-slate-300">
          <li><Link to="/about#help" className="hover:underline text-xl">Help Center</Link></li>
          <li><Link to="/about#terms" className="hover:underline text-xl">Terms</Link></li>
          <li><Link to="/about#policy-refund" className="hover:underline text-xl">Policy & Refund</Link></li>
        </ul>
      </div>

      <div>
        <div className="font-semibold">Stay in touch</div>
        <div className="mt-4 flex items-center gap-3 text-slate-300 text-xl ">

          <a href="https://facebook.com/profile.php?id=61583579968490" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook className='size-8 hover:text-slate-50 transition-transform duration-300 hover:scale-125' /></a>

          <a href="https://x.com/LearniLMWorld" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><Twitter className='size-8 hover:text-slate-50 transition-transform duration-300 hover:scale-125' /></a>
          <a href="https://www.instagram.com/learnilmworld?igsh=MXczNnFrdHJ5Nm1vZg%3D%3D&utm_source=qr" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram className='size-8 hover:text-slate-50 transition-transform duration-300 hover:scale-125' /></a>
          <a href="https://www.linkedin.com/company/learn-ilm-world/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className='size-8 hover:text-slate-50 transition-transform duration-300 hover:scale-125' /></a>
        </div>
        <div className='Logo py-3 mt-5'>
          <img src={logo} width={'350px'} />
          <div className="mt-3 sm:mt-0 text-xl">Version 2.0 • Privacy policy</div>
        </div>
      </div>
    </div>

  </footer>
)

export default Footer
