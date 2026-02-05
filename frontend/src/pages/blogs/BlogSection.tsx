import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import img1 from "../../assets/germanBlogPic1.png";

/* ================= BLOG DATA ================= */

const germanBlogMeta = {
    title: "Teach German Language Online",
    excerpt:
        "Interest in learning German is growing worldwide. From students planning to study abroad to professionals advancing their careers, skilled German instructors are in high demand.",
    image: img1,
    link: "/blog/german-culture",
};

const blogs = [
    germanBlogMeta,
    {
        title: "The Power of Mentorship in Digital Learning",
        excerpt:
            "Behind every great learner is a great mentor. Learn how human connection drives engagement and growth online.",
        image:
            "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
        link: "/blog/bengali-culture",
    },
    {
        title: "Bridging Skills and Opportunities for All",
        excerpt:
            "At LearniLM🌎World, we're committed to creating accessible pathways that connect learners to real-world possibilities.",
        image:
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    },
];

/* ================= TYPES ================= */

type BlogSectionProps = {
    variant?: "default" | "more";
};

/* ================= COMPONENT ================= */

const BlogSection = ({ variant = "default" }: BlogSectionProps) => {
    const isMore = variant === "more";

    return (
        <section
            id={!isMore ? "blog" : undefined}
            className={!isMore ? "py-28 px-6 bg-gradient-to-r from-[#f7f3ea] via-[#eef2f6] to-[#cfdbe6]" : ""}
        >
            <div className="max-w-7xl mx-auto text-center">

                {/* ===== HEADER ===== */}
                {!isMore && (
                    <>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1f2937]">
                            From Our{" "}
                            <span className="text-[#0b5ed7]">BLOG</span> Desk
                        </h2>

                        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                            Explore stories, tips, and ideas that inspire learners and educators
                            alike — where curiosity meets opportunity.
                        </p>
                    </>
                )}

                {/* ===== BLOG CARDS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {blogs.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#dbe8f7] rounded-3xl border-2 border-[#9bbce6] shadow-lg overflow-hidden text-left"
                        >
                            {/* IMAGE */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-[230px] object-cover"
                            />

                            {/* CONTENT */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-[#1f2937]">
                                    {post.title}
                                </h3>

                                <p className="text-gray-700 mb-6 font-semibold leading-relaxed">
                                    {post.excerpt}
                                </p>

                                {post.link ? (
                                    <Link
                                        to={post.link}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b9d3f4] text-[#0b5ed7] font-semibold hover:bg-[#a7c6ef] transition"
                                    >
                                        Read More →
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b9d3f4] text-[#0b5ed7] font-semibold opacity-60 cursor-not-allowed">
                                        Read More →
                                    </span>
                                )}
                            </div>
                        </motion.div>


                    ))}
                </div>
            </div>
        </section>
    );
};


export default BlogSection;
