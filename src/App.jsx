/* =====================================================================
   VK FILMS.CO — MAIN PAGE  (src/App.jsx)
   =====================================================================
   HOW TO FIND THINGS IN THIS FILE  (search for the number, e.g. "[4]")

   [1]  SITE CONTENT ......... edit your name, email, photos, text here
   [2]  SMALL HELPERS ........ icon + scroll animation settings
   [3]  NAVBAR ............... top menu + mobile menu
   [4]  HERO ................. first section (big text + scrolling words)
   [5]  ABOUT / FOUNDER ...... your photo, name, age
   [6]  FILM STRIP ........... NEW film-frame gallery
   [7]  OUR WORK ............. project cards
   [8]  STATEMENT ............ "Moments. Emotions. Stories."
   [9]  SERVICES ............. photography / videography / editing
   [10] CONTACT .............. email + instagram
   [11] FOOTER ............... bottom bar
   [12] APP .................. puts all sections together (order of page)
   ===================================================================== */

import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import portfolioMedia from "virtual:portfolio-media";
import {
  ArrowUpRight,
  Menu,
  X,
  Camera,
  Video,
  Clapperboard,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import "./App.css";

/* =====================================================================
   [1] SITE CONTENT — EDIT YOUR DETAILS HERE
   ===================================================================== */

const CONTACT_EMAIL = "vrajkankrecha1@gmail.com";
const CONTACT_PHONE = "7990766746";
const INSTAGRAM_URL = "https://www.instagram.com/vkfilms.co/";
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;
const preloadedImageUrls = new Set();

function preloadImage(src) {
  if (preloadedImageUrls.has(src)) return;

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = "low";
  image.onerror = () => preloadedImageUrls.delete(src);
  preloadedImageUrls.add(src);
  image.src = src;
}

function LoadingImage({ src, alt, className = "", ...props }) {
  const [loadedSrc, setLoadedSrc] = useState(null);

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={`${className} image-loading${loadedSrc === src ? " image-loaded" : ""}`}
      onLoad={() => setLoadedSrc(src)}
    />
  );
}

// Founder section
const founder = {
  name: "Vraj Kankrecha",
  role: "Founder, VK Films.co",
  age: 21,
  image: publicAsset("images/vraj.jpg"), // file inside public/images/
  foundedYear: "2025",
  experience: "1+",
};

// Top menu links
const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

// Film strip frames (photos inside public/images/ — replace with your own)
const filmFrames = [
  { image: publicAsset("images/strip-1.png"), alt: "Black and white portrait" },
  { image: publicAsset("images/strip-2.png"), alt: "Colour portrait" },
  { image: publicAsset("images/strip-3.png"), alt: "Studio portrait" },
  { image: publicAsset("images/strip-4.png"), alt: "Warm toned portrait" },
  { image: publicAsset("images/strip-5.png"), alt: "Cool toned portrait" },
  { image: publicAsset("images/strip-6.png"), alt: "Black and white frame" },
];
const FILM_NAME = "VKFILMS 400"; // text printed on the film edge

// Gallery media is discovered from the matching public portfolio folders.
const portfolioCategories = [
  {
    id: "pre-wedding",
    number: "01",
    title: "PRE-WEDDING",
    description: "Beautiful love stories captured through cinematic photography and films.",
    cover: publicAsset("images/strip-1.png"),
  },
  {
    id: "wedding",
    number: "02",
    title: "WEDDING",
    description: "Wedding celebrations, candid moments, emotional portraits and cinematic wedding films.",
    cover: publicAsset("images/strip-2.png"),
  },
  {
    id: "model",
    number: "03",
    title: "MODEL PHOTOGRAPHY",
    description: "Fashion photography, model portfolios, editorial shoots and creative portraits.",
    cover: publicAsset("images/portrait.jpg"),
  },
  {
    id: "birthday",
    number: "04",
    title: "BIRTHDAY",
    description: "Birthday celebrations, special moments, portraits and memorable event photography.",
    cover: publicAsset("images/strip-4.png"),
  },
  {
    id: "events",
    number: "05",
    title: "EVENTS",
    description: "Corporate events, cultural celebrations, private functions and special occasions.",
    cover: publicAsset("images/film.jpg"),
  },
].map((category) => {
  const media = portfolioMedia[category.id] ?? { images: [], videos: [] };
  return {
    ...category,
    cover: media.images[0]?.thumbnail ?? category.cover,
    galleryImages: media.images.map((image, index) => ({
      ...image,
      alt: `${category.title} photo ${index + 1}`,
    })),
    galleryVideos: media.videos.map((src, index) => ({
      src,
      title: `${category.title} film ${index + 1}`,
    })),
  };
});

// Services list
const services = [
  {
    number: "01",
    title: "Photography",
    description: "Portraits, events, engagements, products and lifestyle photography.",
    icon: Camera,
  },
  {
    number: "02",
    title: "Videography",
    description: "Cinematic films, brand videos, events and creative storytelling.",
    icon: Video,
  },
  {
    number: "03",
    title: "Video Editing",
    description: "Reels, promotional videos, social media content and post-production.",
    icon: Clapperboard,
  },
];

/* =====================================================================
   [2] SMALL HELPERS
   ===================================================================== */

function InstagramIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Fade-up animation used when a section scrolls into view
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

/* =====================================================================
   [3] NAVBAR
   ===================================================================== */

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const goToSection = (event, href) => {
    event.preventDefault();
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <a href="#home" className="logo" onClick={(event) => goToSection(event, "#home") }>
          VK<span>FILMS.CO</span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={(event) => goToSection(event, item.href)}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <a href="#contact" className="nav-cta" onClick={(event) => goToSection(event, "#contact") }>
            LET'S TALK <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {navItems.map((item, i) => (
          <a href={item.href} key={item.href} onClick={(event) => goToSection(event, item.href)} tabIndex={menuOpen ? 0 : -1}>
            <span>0{i + 1}</span>
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}

/* =====================================================================
   [4] HERO — first section (white, text only)
   ===================================================================== */

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          INDEPENDENT CREATIVE STUDIO · INDIA
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          WE CREATE
          <span>VISUAL STORIES.</span>
        </motion.h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p>
            Photography, filmmaking & creative visuals made to capture moments
            and tell stories.
          </p>

          <div className="hero-buttons">
            <a href="#work" className="btn btn-dark">
              VIEW OUR WORK <ArrowUpRight size={16} />
            </a>
            <a href="#contact" className="btn btn-outline">
              LET'S TALK <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =====================================================================
   [5] ABOUT / FOUNDER
   ===================================================================== */

function About() {
  const [firstName, ...rest] = founder.name.split(" ");

  return (
    <section className="about section-padding" id="about">
      <div className="founder">
        <motion.div className="founder-photo" {...reveal}>
          <LoadingImage src={founder.image} alt={`${founder.name}, founder of VK Films.co`} loading="lazy" decoding="async" />
        </motion.div>

        <motion.div className="founder-info" {...reveal} transition={{ duration: 0.7, delay: 0.15 }}>
          <p className="section-label">MEET THE FOUNDER</p>
          <h3 className="founder-name">
            {firstName} <span>{rest.join(" ")}</span>
          </h3>
          <p className="founder-role">{founder.role}</p>
          <p className="founder-bio">
            I'm Vraj, a {founder.age}-year-old creator from India and the
            founder of VK Films.co. I started this studio to capture genuine
            moments and turn everyday stories into memorable visuals through
            photography, filmmaking and video editing.
          </p>

          <div className="founder-stats">
            <div>
              <strong>{founder.age}</strong>
              <span>YEARS OLD</span>
            </div>
            <div>
              <strong>{founder.foundedYear}</strong>
              <span>STUDIO FOUNDED</span>
            </div>
            <div>
              <strong>{founder.experience}</strong>
              <span>EXPERIENCE</span>
            </div>
          </div>

          <a href="#contact" className="text-link">
            WORK WITH ME <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* =====================================================================
   [6] FILM STRIP — wavy film frames that scroll sideways (NEW)
   ===================================================================== */

function FilmCell({ frame, index, hidden }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div className="film-cell">
      {/* top edge: sprocket holes + film name */}
      <div className="film-edge">
        <div className="film-holes">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="film-label">
          <span>{FILM_NAME}</span>
          <span>VK-{num}</span>
        </div>
      </div>

      {/* the photo */}
      <div className="film-photo">
        <LoadingImage src={frame.image} alt={hidden ? "" : frame.alt} loading="lazy" decoding="async" />
      </div>

      {/* bottom edge: frame number + sprocket holes */}
      <div className="film-edge">
        <div className="film-label">
          <span>▸ {num}</span>
          <span>VK-{num}</span>
        </div>
        <div className="film-holes">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilmStrip() {
  return (
    <section className="filmstrip" id="home">
      <div className="filmstrip-head">
        <motion.p className="section-label" {...reveal}>
          THROUGH THE LENS
        </motion.p>
        <motion.h2 {...reveal}>
          EVERY FRAME, <span>A MEMORY.</span>
        </motion.h2>
        <motion.p className="filmstrip-text" {...reveal} transition={{ duration: 0.7, delay: 0.15 }}>
          Faces, moods and moments — each one chosen, framed and kept. Here is
          a look at the stories we have captured so far.
        </motion.p>
      </div>

      <div className="film-viewport" aria-label="Film strip gallery">
        <div className="film-track">
          {/* the list is shown twice so the loop never has a gap */}
          {[0, 1].map((g) => (
            <div className="film-group" key={g} aria-hidden={g === 1}>
              {filmFrames.map((frame, i) => (
                <FilmCell key={frame.image} frame={frame} index={i} hidden={g === 1} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   [7] OUR WORK
   ===================================================================== */

function Work() {
  return (
    <section className="work section-padding" id="work">
      <div className="section-heading">
        <div>
          <p className="section-label">02 / SELECTED WORK</p>
          <h2>
            THE VISUAL <span>ARCHIVE.</span>
          </h2>
        </div>
        <p className="work-note">
          Explore stories by category.
          <br /> Every frame carries a moment.
        </p>
      </div>

      <div className="project-grid portfolio-grid">
        {portfolioCategories.map((category, i) => (
          <motion.div
            className="project-card portfolio-card"
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          >
            <Link to={`/portfolio/${category.id}`} className="portfolio-card-link" aria-label={`View ${category.title} gallery`}>
              <div className="project-image portfolio-cover">
                <LoadingImage src={category.cover} alt={`${category.title} portfolio cover`} loading="lazy" decoding="async" />
                <span className="project-number">{category.number}</span>
                <span className="project-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <p className="project-category">{category.title}</p>
              <h3>{category.description}</h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   [8] STATEMENT
   ===================================================================== */

function Statement() {
  return (
    <section className="statement">
      <motion.div {...reveal}>
        <p>NOT JUST IMAGES.</p>
        <h2>
          MOMENTS.
          <br />
          <span>EMOTIONS.</span>
          <br />
          STORIES.
        </h2>
      </motion.div>
    </section>
  );
}

/* =====================================================================
   [9] SERVICES
   ===================================================================== */

function Services() {
  return (
    <section className="services section-padding" id="services">
      <p className="section-label">03 / WHAT WE DO</p>
      <div className="section-heading">
        <h2>
          OUR <span>EXPERTISE.</span>
        </h2>
        <p className="work-note">Creative services for people and brands.</p>
      </div>

      <div className="service-list">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              className="service-item"
              key={service.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span className="service-number">{service.number}</span>
              <div className="service-title">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <Icon className="service-icon" size={28} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================================
   [10] CONTACT
   ===================================================================== */

function Contact() {
  return (
    <section className="contact section-padding" id="contact">
      <p className="section-label">04 / HAVE A PROJECT?</p>
      <motion.div {...reveal}>
        <h2>
          LET'S CREATE
          <br />
          <span>SOMETHING REAL.</span>
        </h2>
        <p className="contact-description">
          Have an idea, a story or a project in mind? Let's bring it to life.
        </p>

        <a href={`mailto:${CONTACT_EMAIL}`} className="contact-button">
          START A CONVERSATION <ArrowUpRight size={18} />
        </a>
      </motion.div>

      <div className="contact-details">
        <a href={`mailto:${CONTACT_EMAIL}`}>
          <Mail size={16} /> {CONTACT_EMAIL}
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <InstagramIcon size={16} /> INSTAGRAM
        </a>
        <a href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}>
          <Phone size={16} /> {CONTACT_PHONE}
        </a>
      </div>
    </section>
  );
}

/* =====================================================================
   [11] FOOTER
   ===================================================================== */

function Footer() {
  return (
    <footer className="footer">
      <a href="#home" className="logo">
        VK<span>FILMS.CO</span>
      </a>
      <p>© 2026 VK FILMS.CO. ALL RIGHTS RESERVED.</p>
      <a href="#home">BACK TO TOP ↑</a>
    </footer>
  );
}

/* =====================================================================
   [12] APP — ORDER OF SECTIONS ON THE PAGE
   Move a line up/down to change the order of sections.
   ===================================================================== */

function Lightbox({ item, images, onClose, onPrevious, onNext }) {
  useEffect(() => {
    if (!item) return;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (item.type === "image" && event.key === "ArrowLeft") onPrevious();
      if (item.type === "image" && event.key === "ArrowRight") onNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [item, onClose, onPrevious, onNext]);

  useEffect(() => {
    if (item?.type !== "image" || images.length < 2) return;

    const previousIndex = (item.index - 1 + images.length) % images.length;
    const nextIndex = (item.index + 1) % images.length;
    preloadImage(images[previousIndex].src);
    preloadImage(images[nextIndex].src);
  }, [item, images]);

  if (!item) return null;

  let touchStartX = null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.type === "image" ? item.alt : item.title}
      onTouchStart={(event) => { touchStartX = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (item.type !== "image" || touchStartX === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 45) distance > 0 ? onPrevious() : onNext();
      }}
    >
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close viewer">
        <X size={22} />
      </button>

      {item.type === "image" ? (
        <>
          <LoadingImage
            key={item.src}
            className="lightbox-image"
            src={item.src}
            alt={item.alt}
            style={{ backgroundImage: `url("${item.thumbnail}")` }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <button className="lightbox-arrow lightbox-prev" type="button" onClick={onPrevious} aria-label="Previous image">
            <ChevronLeft size={28} />
          </button>
          <button className="lightbox-arrow lightbox-next" type="button" onClick={onNext} aria-label="Next image">
            <ChevronRight size={28} />
          </button>
        </>
      ) : (
        <video className="lightbox-video" src={item.src} controls preload="metadata" autoPlay={false} />
      )}
    </div>
  );
}

function CategoryGallery() {
  const { categoryId } = useParams();
  const category = portfolioCategories.find((item) => item.id === categoryId);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [categoryId]);

  if (!category) return <Navigate to="/" replace />;

  const showPreviousImage = () => {
    if (!activeItem || activeItem.type !== "image") return;
    const nextIndex = (activeItem.index - 1 + category.galleryImages.length) % category.galleryImages.length;
    const image = category.galleryImages[nextIndex];
    setActiveItem({ type: "image", index: nextIndex, src: image.src, thumbnail: image.thumbnail, alt: image.alt });
  };

  const showNextImage = () => {
    if (!activeItem || activeItem.type !== "image") return;
    const nextIndex = (activeItem.index + 1) % category.galleryImages.length;
    const image = category.galleryImages[nextIndex];
    setActiveItem({ type: "image", index: nextIndex, src: image.src, thumbnail: image.thumbnail, alt: image.alt });
  };

  const hasMedia = category.galleryImages.length > 0 || category.galleryVideos.length > 0;

  return (
    <>
      <Navbar />
      <main className="category-page">
        <section className="category-header">
          <Link to="/" className="back-link">
            <ChevronLeft size={18} /> BACK TO PORTFOLIO
          </Link>
          <p className="category-number">{category.number} / PORTFOLIO</p>
          <h1>{category.title}</h1>
          <p className="category-introduction">{category.description}</p>
        </section>

        {hasMedia ? (
          <section className="gallery-grid" aria-label={`${category.title} gallery`}>
            {category.galleryImages.map((image, index) => (
              <motion.button
                type="button"
                className="gallery-item gallery-image"
                key={image.src}
                initial={index < 3 ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index < 3 ? 0 : (index - 2) * 0.05 }}
                onClick={() => setActiveItem({ type: "image", index, src: image.src, thumbnail: image.thumbnail, alt: image.alt })}
                aria-label={`Open ${image.alt}`}
              >
                <LoadingImage
                  src={image.thumbnail}
                  alt={image.alt}
                  loading="lazy"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                />
              </motion.button>
            ))}

            {category.galleryVideos.map((video, index) => (
              <motion.button
                type="button"
                className="gallery-item gallery-video"
                key={video.src}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: (category.galleryImages.length + index) * 0.05 }}
                onClick={() => setActiveItem({ type: "video", src: video.src, title: video.title })}
                aria-label={`Play ${video.title}`}
              >
                {video.thumbnail ? <LoadingImage src={video.thumbnail} alt="" loading="lazy" decoding="async" /> : <div className="video-placeholder" />}
                <span className="video-play"><Play size={22} fill="currentColor" /></span>
              </motion.button>
            ))}
          </section>
        ) : (
          <section className="gallery-empty">
            <p>GALLERY IN PROGRESS</p>
            <h2>New stories are being prepared.</h2>
            <span>Images and films for this category will appear here soon.</span>
            <Link to="/" className="back-link">EXPLORE OTHER WORK <ArrowUpRight size={17} /></Link>
          </section>
        )}
      </main>
      <Footer />
      <Lightbox
        item={activeItem}
        images={category.galleryImages}
        onClose={() => setActiveItem(null)}
        onPrevious={showPreviousImage}
        onNext={showNextImage}
      />
    </>
  );
}

function HomePage() {
  return (
    <main>
      <Navbar />
      <FilmStrip />
      <About />
      <Statement />
      <Work />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/portfolio/:categoryId" element={<CategoryGallery />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;