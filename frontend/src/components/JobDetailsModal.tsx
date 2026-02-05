import { X } from "lucide-react";
import { motion } from "framer-motion";

/* JD DATA (INLINE JSON) */

const JOB_DESCRIPTIONS: Record<
    string,
    {
        overview?: string;
        responsibilities?: string[];
        requirements?: string[];
        goodToHave?: string[];
        education?: string;
        benefits?: string[];
    }
> = {
    FULL_STACK: {
        overview:
            "Learnilm World is looking for a motivated MERN Stack Developer to join our development team. The candidate will work on modern web applications and contribute to building scalable, user-friendly platforms.",

        responsibilities: [
            "Develop and maintain web applications using the MERN stack",
            "Build responsive and user-friendly interfaces",
            "Collaborate with designers and backend developers",
            "Integrate REST APIs and manage application state",
        ],

        requirements: [
            "Strong understanding of MongoDB, Express.js, React.js, Node.js",
            "Good knowledge of HTML, CSS, and JavaScript",
            "Understanding of REST APIs and client-server architecture",
            "Basic knowledge of Git and version control",
        ],

        goodToHave: [
            "Experience with Tailwind CSS",
            "Working knowledge of TypeScript",
            "Deployment experience (Vercel, Render, etc.)",
            "Understanding of authentication and security basics",
        ],

        education:
            "Bachelor’s degree required. CS or related field preferred but strong practical skills are valued.",

        benefits: [
            "Hands-on experience with real-world projects",
            "Collaborative development environment",
            "Growth opportunities based on performance",
        ],
    },

    UI_UX: {
        overview:
            "We are looking for a passionate and driven UI/UX Design Intern to join our team for a 3-month unpaid remote internship. This is a hands-on opportunity to build your portfolio, gain real-world experience, and contribute to products that solve genuine user problems.",

        responsibilities: [
            "Assist in conducting user interviews, competitive analysis, and usability testing",
            "Create low-fidelity wireframes and high-fidelity interactive prototypes using Figma or Adobe XD",
            "Design clean, intuitive interfaces for web and mobile platforms",
            "Collaborate with product managers and developers to ensure design feasibility",
            "Refine designs based on feedback from team members and stakeholders",
        ],

        requirements: [
            "Portfolio showcasing academic or personal UI/UX projects (Behance, Dribbble, or personal site)",
            "Proficiency in Figma (preferred), Sketch, or Adobe Creative Suite",
            "Strong understanding of typography, color theory, layout, and user-centered design",
            "Ability to communicate design decisions clearly and accept constructive feedback",
            "Self-motivated with good time management skills in a remote environment",
        ],

        benefits: [
            "Regular 1-on-1 mentorship and feedback sessions",
            "Hands-on work on real, shippable products",
            "Flexible remote work schedule",
            "Certificate of completion and letter of recommendation based on performance",
        ],
    },

    QA: {
        overview:
            "We are looking for a detail-oriented and curious QA Intern to join our engineering team. This role bridges manual exploratory testing with modern automation and introduces you to industry-grade quality practices.",

        responsibilities: [
            "Execute functional, regression, and usability tests",
            "Assist in writing and maintaining automated tests using Selenium, Playwright, or Cypress",
            "Identify, document, and track defects in Jira with clear reproduction steps",
            "Perform API testing using tools like Postman",
            "Participate in requirement reviews to identify edge cases early (Shift-Left testing)",
            "Experiment with AI-assisted testing tools and self-healing automation scripts",
        ],

        requirements: [
            "Current student or recent graduate in Computer Science, IT, or a related field",
            "Understanding of SDLC and STLC concepts",
            "Basic coding knowledge in Java, Python, or JavaScript",
            "Strong attention to detail with a tester’s mindset",
            "Ability to clearly communicate issues to developers and product teams",
        ],

        benefits: [
            "Weekly mentorship sessions with Senior QA Engineers",
            "Hands-on experience with Jira, GitHub, and CI/CD pipelines",
            "Certificate of completion and LinkedIn recommendation for strong performers",
            "Access to internal professional network and leadership AMA sessions",
        ],
    },

    DIGITAL_MARKETING: {
        overview:
            "We are looking for a creative and data-curious Digital Marketing Intern to help amplify our brand voice through real-world campaigns that blend storytelling, SEO, analytics, and AI-assisted content creation.",

        responsibilities: [
            "Create engaging content for LinkedIn, Instagram, X, and YouTube Shorts",
            "Assist in scriptwriting for short-form video content",
            "Use AI tools for keyword research, content ideation, and personalization",
            "Perform basic SEO research and track performance using Google Analytics 4",
            "Engage with community members and influencers to build brand loyalty",
            "Create weekly reports tracking CTR, conversions, and engagement metrics",
        ],

        requirements: [
            "Strong storytelling skills with the ability to capture attention quickly",
            "Comfortable experimenting with new tools and AI-driven workflows",
            "Self-disciplined and organized in a remote work environment",
            "Basic experience with Canva, Figma, or CapCut is a plus",
        ],

        benefits: [
            "Direct mentorship from the Marketing Lead",
            "Portfolio-ready campaign case studies",
            "Hands-on access to premium tools like HubSpot and SEMRush",
            "Certificate of completion and LinkedIn recommendation",
        ],
    },

    CONTENT_CREATOR: {
        overview:
            "We are looking for a visual storyteller and trend-spotter to become the creative engine of our brand. This role focuses on experimentation, short-form video, and building a standout creator portfolio.",

        responsibilities: [
            "Conceptualize, film, and edit short-form videos for Reels and YouTube Shorts",
            "Create scroll-stopping graphics and carousels using Canva, Figma, or Adobe Express",
            "Use generative AI tools like Midjourney or Runway to create unique brand assets",
            "Write engaging captions and newsletter snippets",
            "Track trends and identify emerging content formats before they peak",
        ],

        requirements: [
            "Strong visual sense for lighting, framing, and pacing",
            "Editing experience with CapCut, InShot, or Premiere Rush",
            "Deep understanding of short-form content culture and trends",
            "Ability to work independently from rough briefs",
        ],

        benefits: [
            "Portfolio ownership and creator credits",
            "Experience with a modern 2026 content tech stack",
            "High visibility impact — strong ideas go live",
            "LinkedIn recommendation and creative portfolio review at completion",
        ],
    },
    SALES_INTERN: {
        overview:
            "We are hiring Sales Interns across multiple regions to support outreach, lead generation, and business development initiatives.",

        responsibilities: [
            "Assist in lead generation and outreach",
            "Support regional sales initiatives",
            "Maintain CRM and follow-up records",
            "Coordinate with marketing and growth teams",
        ],

        requirements: [
            "Strong communication skills",
            "Interest in sales and business development",
            "Ability to work independently",
        ],

        benefits: [
            "Sales mentorship and training",
            "Exposure to international markets",
            "Certificate and recommendation",
        ],
    },
};


/*  TYPES */

type Props = {
    job: any;
    onClose: () => void;
    onApply: () => void;
};

/* COMPONENT */

export default function JobDetailsModal({ job, onClose, onApply }: Props) {
    const jd = JOB_DESCRIPTIONS[job.roleKey];

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="
          bg-white w-full max-w-5xl h-[90vh]
          rounded-3xl shadow-2xl
          flex flex-col overflow-hidden
        "
            >
                {/*  HEADER  */}
                <div className="flex justify-between items-start px-8 py-6 border-b bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                            {job.title}
                        </h2>

                        {/* Meta Pills */}
                        <div className="flex flex-wrap gap-3 mt-3 text-sm">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                {job.department}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
                                {job.location}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                                {job.type}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={26} className="text-gray-600" />
                    </button>
                </div>

                {/*  BODY (SCROLLABLE)  */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 text-gray-700">
                    {!jd && (
                        <p className="italic text-gray-500">
                            Job description will be updated soon.
                        </p>
                    )}

                    {jd?.overview && (
                        <section className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Role Overview
                            </h3>
                            <p className="leading-relaxed">{jd.overview}</p>
                        </section>
                    )}

                    {jd?.responsibilities && (
                        <section className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Responsibilities
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {jd.responsibilities.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {jd?.requirements && (
                        <section className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Requirements
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {jd.requirements.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {jd?.goodToHave && (
                        <section className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Good to Have
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {jd.goodToHave.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {jd?.education && (
                        <section className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Education
                            </h3>
                            <p>{jd.education}</p>
                        </section>
                    )}

                    {jd?.benefits && (
                        <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                What We Offer
                            </h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {jd.benefits.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/*  FOOTER  */}
                <div className="px-8 py-5 border-t bg-white shrink-0 flex justify-end">
                    <button
                        onClick={onApply}
                        className="
              bg-[#0052CC] text-white
              px-10 py-3 rounded-xl
              font-bold text-lg
              hover:bg-blue-700
              transition shadow-lg
            "
                    >
                        Apply for this role →
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
