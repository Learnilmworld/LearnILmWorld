import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import heroImg from "../../assets/bengali-blog-photo1.jpeg";
import cultureImg from "../../assets/bengali-blog-photo2.jpeg";

const BengaliBlog: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <>
      <Navbar />

      <article
        style={{
          backgroundColor: "#fef5e4", // beige background
          padding: "4rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            lineHeight: 1.8,
            color: "#2e2a25",
          }}
        >
          {/* HERO */}
          <motion.header
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: "2.8rem", fontWeight: 800 }}>
              Unlock the Beauty of Bengali
            </h1>
            <h2
              style={{
                fontSize: "1.4rem",
                marginTop: "0.6rem",
                color: "#6b6256",
              }}
            >
              Your Ultimate Journey from Zero to Fluency
            </h2>

            <img
              src={heroImg}
              alt="Bengali Language"
              style={{
                marginTop: "2rem",
                borderRadius: "18px",
                width: "100%",
                objectFit: "cover",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
            />
          </motion.header>

          {/* INTRO */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: "3rem" }}
          >
            <p>
              <strong>The Bengali language (Bangla)</strong> is one of the most
              beautiful and emotionally rich languages in the world. Spoken by{" "}
              <strong>over 300 million people globally</strong>, Bengali ranks among
              the <strong>top five most spoken languages</strong>.
            </p>

            <p style={{ marginTop: "1rem" }}>
              Known for its melodious sound, rhythm, and deep cultural roots,
              Bengali connects learners to literature, music, films, and philosophy
              that have shaped South Asian culture for centuries.
            </p>
          </motion.section>

          {/* IMAGE BREAK */}
          <motion.img
            src={cultureImg}
            alt="Bengali Culture"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: "3rem",
              borderRadius: "16px",
              width: "100%",
            }}
          />

          {/* LIST */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: "3rem" }}
          >
            <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
              Why Learn Bengali? Key Insights and Learning Path
            </h3>

            <ul className="list-disc"
              style={{
                marginTop: "1.5rem",
                paddingLeft: "1.4rem",
                lineHeight: 1.9,
              }}
            >
              <li>
                Explore the beauty of Bengali, often described as one of the world’s most
                melodious and emotionally expressive languages
              </li>

              <li>
                Understand that Bengali is spoken across India, Bangladesh, and by global
                communities worldwide
              </li>

              <li>
                Appreciate cultural richness through Rabindranath Tagore’s literature and
                the vibrant cultural life of Kolkata and Dhaka
              </li>

              <li>
                Realize that learning Bengali opens doors to its literature, music, cinema,
                philosophy, and history
              </li>

              <li>
                Acknowledge the deep pride Bengali speakers take in their language and
                heritage
              </li>

              <li>
                Begin with a structured learning approach that breaks the language into
                simple, manageable steps
              </li>

              <li>
                Learn the Bengali alphabet consisting of <strong>50 letters</strong>{" "}
                (11 vowels and 39 consonants) and understand the role of <strong>matra</strong>
              </li>

              <li>
                Practice writing a few letters daily to build muscle memory and confidence
              </li>

              <li>
                Focus on correct pronunciation, especially aspirated and non-aspirated
                consonants
              </li>

              <li>
                Learn basic grammar rules, including the{" "}
                <strong>Subject–Object–Verb</strong> sentence structure
              </li>

              <li>
                Gradually build vocabulary using greetings, numbers, family terms, and
                food-related words
              </li>
            </ul>
          </motion.section>


          {/* SUMMARY */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "3.5rem",
              padding: "2rem",
              background: "#ede6d8",
              borderRadius: "20px",
            }}
          >
            <h3 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Summary</h3>
            <p style={{ marginTop: "1rem" }}>
              Learning Bengali is a human journey, not a race. With curiosity,
              consistency, and cultural immersion, anyone can move from zero to
              confident communication and experience the soul of the language.
            </p>
          </motion.section>
        </div>
      </article>
      {/* ================= MORE BLOGS ================= */}
      <section className="py-28 px-6 bg-[#e1edfc]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex px-5 py-2 rounded-full bg-white text-[#276dc9] text-sm font-bold mb-6 shadow">
            MORE FROM OUR BLOG
          </div>

          <h2 className="text-4xl font-extrabold mb-16 text-[#1f2937]">
            Explore More Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
            {[
              {
                title: "How Personalized Learning is Shaping the Future",
                excerpt:
                  "Discover how tailored education approaches are redefining success for modern learners.",
                image:
                  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "The Power of Mentorship in Digital Learning",
                excerpt:
                  "Behind every great learner is a great mentor. Learn how connection drives growth online.",
                image:
                  "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bridging Skills and Opportunities for All",
                excerpt:
                  "Creating accessible pathways that connect learners to real-world possibilities.",
                image:
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
              },
            ].map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border border-[#5186cd]/10"
              >
                <img
                  src={post.image}
                  className="w-full h-[220px] object-cover"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#1f2937]">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-5">{post.excerpt}</p>

                  {i === 0 ? (
                    <Link
                      to="/blog/german-culture"
                      className="text-[#5186cd] font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  ) : i === 1 ? (
                    <Link
                      to="/blog/bengali-culture"
                      className="text-[#5186cd] font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  ) : (
                    <span className="text-[#5186cd] font-semibold opacity-60">
                      Read More →
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              to="/about#blog"
              className="text-[#5186cd] font-semibold hover:underline"
            >
              View all blogs →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BengaliBlog;
