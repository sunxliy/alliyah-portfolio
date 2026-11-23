
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight, ArrowDown, ArrowUp, ArrowRight,
  Moon, Sun, Menu, X, Download, MapPin
} from "lucide-react";

import {
  profile, projects, skills, process,
  awards, certificates, education
} from "./data.js";

import "./style.css";

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach(el => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Magnetic({ href, children, outline = false, type = "button" }) {
  const ref = useRef(null);

  const move = e => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--tx", `${(x - r.width / 2) * 0.1}px`);
    el.style.setProperty("--ty", `${(y - r.height / 2) * 0.1}px`);
  };

  const leave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--tx", "0px");
    ref.current.style.setProperty("--ty", "0px");
  };

  const props = {
    ref,
    className: `magnetic ${outline ? "outline" : ""}`,
    onPointerMove: move,
    onPointerLeave: leave
  };

  const inner = (
    <>
      <span className="magnetic-fill" />
      <span className="magnetic-label">{children}</span>
    </>
  );

  if (href) return <a href={href} {...props}>{inner}</a>;
  return <button type={type} {...props}>{inner}</button>;
}

function Eyebrow({ number, children }) {
  return (
    <div className="eyebrow" data-reveal>
      <span>{number}</span>
      <i />
      <span>{children}</span>
    </div>
  );
}

function ImageFrame({ src, title }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div className="image-frame">
      {src && !failed ? (
        <img src={src} alt={title} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="image-fallback">
          <span>PROJECT / VISUAL STUDY</span>
          <strong>{title}</strong>
          <small>ADD SCREENSHOT IN PUBLIC/IMAGES</small>
        </div>
      )}
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);

  

useEffect(() => {
  const cursor = cursorRef.current;
  const canvas = canvasRef.current;

  if (!cursor || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pointer = { x: -100, y: -100 };
  const smooth = { x: -100, y: -100 };

  let drawing = false;
  let lastPoint = null;
  let animationFrame;
  let strokes = [];

  // Prevent native dragging of links and images
const preventNativeDrag = (event) => {
  if (event.target.closest?.("a, img")) {
    event.preventDefault();
  }
};
  // Adjust canvas size to match the screen
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };


    

const move = (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;

  const interactive = event.target?.closest?.(
    "a, button, input, textarea, .project-row"
  );

  cursor.classList.toggle("cursor-hover", !!interactive);

  // Detect whether the left mouse button is held down
  const isDragging = drawing && (event.buttons & 1) === 1;

  if (isDragging && lastPoint) {
    const dx = pointer.x - lastPoint.x;
    const dy = pointer.y - lastPoint.y;

    if (Math.hypot(dx, dy) > 0) {
      strokes.push({
        x1: lastPoint.x,
        y1: lastPoint.y,
        x2: pointer.x,
        y2: pointer.y,
        life: 1
      });
    }
  }

  lastPoint = {
    x: pointer.x,
    y: pointer.y
  };
};


   const down = (event) => {
  if (event.button !== 0) return;

  drawing = true;
  lastPoint = {
    x: event.clientX,
    y: event.clientY
  };

  cursor.classList.add("cursor-down");
};

    const up = () => {
      drawing = false;
      lastPoint = null;
      cursor.classList.remove("cursor-down");
    };

    const render = () => {
      smooth.x += (pointer.x - smooth.x) * 0.2;
      smooth.y += (pointer.y - smooth.y) * 0.2;

      cursor.style.transform =
        `translate3d(${smooth.x}px, ${smooth.y}px, 0) translate(-50%, -50%)`;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      strokes = strokes.filter((stroke) => stroke.life > 0);

      strokes.forEach((stroke) => {
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.strokeStyle = `rgba(130, 20, 48, ${stroke.life})`;
ctx.lineWidth = 2.5 * stroke.life;
        ctx.lineCap = "round";
        ctx.stroke();
stroke.life -= 0.012;
      });

      animationFrame = requestAnimationFrame(render);
    };

   
    resize();
    render();

    // Register mouse and pointer events
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("blur", up);

    // Prevent browser from dragging links and images
    document.addEventListener(
      "dragstart",
      preventNativeDrag,
      true
    );

    // Clean up event listeners
    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      window.removeEventListener("blur", up);

      document.removeEventListener(
        "dragstart",
        preventNativeDrag,
        true
      );
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="cursor-trail"
        aria-hidden="true"
      />
      <div
        ref={cursorRef}
        className="custom-cursor"
        aria-hidden="true"
      />
    </>
  );
}

function Header({ theme, setTheme }) {
  const [menu, setMenu] = useState(false);
  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Expertise", "#expertise"],
    ["Achievements", "#achievements"],
    ["Contact", "#contact"]
  ];
  const navRef = useRef(null);
const indicatorRef = useRef(null);

const moveIndicator = (event) => {
  const nav = navRef.current;
  const indicator = indicatorRef.current;
  if (!nav || !indicator) return;

  const link = event.currentTarget;
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();

  indicator.style.width = `${linkRect.width}px`;
  indicator.style.transform =
    `translateX(${linkRect.left - navRect.left}px)`;

  indicator.style.opacity = "1";
};

const hideIndicator = () => {
  if (indicatorRef.current) {
    indicatorRef.current.style.opacity = "0";
  }
};

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#home" className="brand">ALLIYAH<span>.</span></a>

        
<nav
  ref={navRef}
  className={menu ? "nav open" : "nav"}
  onMouseLeave={hideIndicator}
>
  {links.map(([label, href]) => (
    <a
      key={href}
      href={href}
      onMouseEnter={moveIndicator}
      onClick={() => setMenu(false)}
    >
      {label}
    </a>
  ))}

  <span
    ref={indicatorRef}
    className="nav-indicator"
    aria-hidden="true"
  />
</nav>


        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          <a
  className="resume-button"
  href={profile.resume}
  download="Alliyah_Mhay_Aruta_Resume.pdf"
  type="application/pdf"
  aria-label="Download Alliyah Aruta's Resume"
>
  <Download size={14} />
  Download Résumé
</a>

          <button
            className="icon-button mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}


function IntroScreen({ onComplete }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 2400);

    const finishTimer = window.setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`intro-screen ${closing ? "intro-closing" : ""}`}
      aria-label="Portfolio introduction"
    >
      <div className="intro-content">
        <span className="intro-small">WELCOME TO MY PORTFOLIO</span>

        <h1 className="intro-name">
          <span>ALLIYAH MHAY</span>
          <span>T. ARUTA</span>
        </h1>

        <div className="intro-line" />

        <p className="intro-role">
          FULL-STACK WEB DEVELOPER · UI/UX DESIGNER
        </p>
      </div>

      <span className="intro-circle" aria-hidden="true" />

      <span className="intro-bottom">
        DESIGN · DEVELOPMENT · DIGITAL EXPERIENCES
      </span>
    </div>
  );
}


function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-copy">
        <div className="hero-overline">
          <span className="status-dot" />
          AVAILABLE FOR COLLABORATION
        </div>

        <h1 className="hero-heading">
          <span className="hero-word">Designing</span>
          <span className="hero-word italic">experiences.</span>
          <span className="hero-word">Building what</span>
          <span className="hero-word italic">matters.</span>
        </h1>

        <p className="hero-description">
          Full-Stack Web Developer & UI/UX Designer creating
          intuitive, purposeful digital experiences through
          thoughtful design and development.
        </p>

        <div className="hero-buttons">
          <Magnetic href="#projects">
            Explore My Work <ArrowUpRight size={15} />
          </Magnetic>

          <Magnetic href="#contact" outline>
            Let's Connect <ArrowUpRight size={15} />
          </Magnetic>
        </div>

        <div className="hero-meta">
          <span>DASMARIÑAS, CAVITE · PHILIPPINES</span>
          <a href="#about">SCROLL TO EXPLORE <ArrowDown size={13} /></a>
        </div>
      </div>

      <div className="hero-art">
        <div className="art-corner top-left" />
        <div className="art-corner bottom-right" />
        <span className="art-top">A STUDY IN DESIGN & DEVELOPMENT</span>
       <div className="art-center hero-portrait-wrapper">
  <img
    src="/images/profile.jpeg"
    alt="Alliyah Aruta — Full-Stack Web Developer and UI/UX Designer"
    className="hero-portrait"
    fetchPriority="high"
  />
</div>
        <div className="art-bottom">
          <span>ALLIYAH ARUTA</span>
          <span>PORTFOLIO — 2026</span>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["DEVELOPMENT", "INTERFACES", "SYSTEMS", "EXPERIENCES"];

  return (
    <section className="marquee-section" aria-label="Design and development">
      <div className="marquee-label container">
        <span>WHAT I DO</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>

      <div className="marquee-window solid">
        <div className="marquee-track">
          {[0, 1].map(copy => (
            <div className="marquee-group" key={copy}>
              {words.map(word => (
                <React.Fragment key={`${copy}-${word}`}>
                  <span>{word}</span><b>✳</b>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-window outlined">
        <div className="marquee-track reverse">
          {[0, 1].map(copy => (
            <div className="marquee-group" key={copy}>
              {words.map(word => (
                <React.Fragment key={`${copy}-${word}`}>
                  <span>{word}</span><b>✳</b>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section container about">
      <Eyebrow number="01">INTRODUCTION</Eyebrow>

      <div className="two-column">
        <h2 className="display" data-reveal>
          Thoughtful by<br />
          <em>design.</em><br />
          Driven by<br />
          development.
        </h2>

        <div className="about-text" data-reveal>
          <p className="lead">
            I believe good digital experiences should be
            beautiful, intuitive, and genuinely useful.
          </p>
          <p>
            I specialize in building responsive web applications,
            combining frontend development, backend functionality,
            databases, and thoughtful UI/UX design.
          </p>
          <p>
            From initial concepts to deployment, I focus on
            creating systems that solve real problems while
            delivering meaningful experiences for users.
          </p>

          <div className="about-detail">
            <span>BASED IN</span>
            <strong>{profile.location}</strong>
          </div>
          <div className="about-detail">
            <span>SPECIALIZATION</span>
            <strong>Full-Stack Web Development & UI/UX</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function YeshrheyyGallery() {
  const scroller = useRef(null);
  const drag = useRef({ active: false, x: 0, start: 0 });

  const cards = [
    ["Collection", "A curated literary world"],
    ["Synopses", "Stories worth discovering"],
    ["Genre Strip", "An animated reading experience"],
    ["Reading Links", "A direct path to each story"],
    ["Motion", "Interaction meets storytelling"]
  ];

  const down = e => {
    if (e.button !== 0) return;
    drag.current = {
      active: true,
      x: e.clientX,
      start: scroller.current.scrollLeft
    };
    scroller.current.setPointerCapture(e.pointerId);
  };

  const move = e => {
    if (!drag.current.active) return;
    scroller.current.scrollLeft =
      drag.current.start - (e.clientX - drag.current.x);
  };

  return (
    <div className="yeshrheyy-gallery" data-reveal>
      <div className="gallery-header">
        <span>YESHRHEYY — EDITORIAL STUDIES</span>
        <span>DRAG TO EXPLORE ↔</span>
      </div>

      <div
        className="gallery-scroller"
        ref={scroller}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => drag.current.active = false}
        onPointerCancel={() => drag.current.active = false}
      >
        {cards.map(([title, description], index) => (
          <div className="gallery-card" key={title}>
            <div className="gallery-art">
              <span className="gallery-topline">YESHRHEYY / ARCHIVE</span>
              <span className="gallery-roman">
                {["I", "II", "III", "IV", "V"][index]}
              </span>
              <em>{title}</em>
              <span className="gallery-bottomline">STORIES IN MOTION</span>
            </div>
            <div className="gallery-caption">
              <span>PLATE {String(index + 1).padStart(2, "0")}</span>
              <span>{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <Eyebrow number="02">SELECTED WORK</Eyebrow>

        <div className="section-heading" data-reveal>
          <h2 className="display">
            Selected work.<br />
            Built with <em>purpose.</em>
          </h2>
          <p>
            A collection of functional systems, interactive
            interfaces, and digital experiences.
          </p>
        </div>

        {projects.map((project, index) => (
          <React.Fragment key={project.id}>
            <article className={`project-row ${index % 2 ? "flipped" : ""}`} data-reveal>
              <div className="project-copy">
                <div className="project-meta">
                  <span>0{index + 1} / 0{projects.length}</span>
                  <span>{project.type}</span>
                </div>

                <h3>{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>
                <p className="project-role">{project.role}</p>

                <div className="tags">
                  {project.stack.map(tag => <span key={tag}>{tag}</span>)}
                </div>

                {project.live && (
                  <a className="underlined-link" href={project.live} target="_blank" rel="noopener noreferrer">
                    Visit Live Website <ArrowUpRight size={15} />
                  </a>
                )}

                <details className="project-details">
                  <summary>Explore Key Features <ArrowUpRight size={15} /></summary>
                  <ul>
                    {project.features.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                </details>
              </div>

              <div className="project-visual">
                <ImageFrame src={project.image} title={project.title} />
                <span className="project-visual-label">PROJECT {String(index + 1).padStart(2, "0")}</span>
              </div>
            </article>

            {project.id === "yeshrheyy" && <YeshrheyyGallery />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function Expertise() {
  const categories = Object.keys(skills);
  const [active, setActive] = useState(categories[0]);

  return (
    <section id="expertise" className="section container">
      <Eyebrow number="03">TECHNICAL EXPERTISE</Eyebrow>

      <div className="section-heading" data-reveal>
        <h2 className="display">
          From concept<br />
          to <em>code.</em>
        </h2>
        <p>
          Technologies and tools that support my approach
          to development and design.
        </p>
      </div>

      <div className="expertise-layout">
        <div className="expertise-tabs">
          {categories.map((category, index) => (
            <button
              key={category}
              className={active === category ? "skill-tab active" : "skill-tab"}
              onClick={() => setActive(category)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{category}</strong>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>

        <div className="skill-panel" key={active}>
          <span className="small-label">SELECTED EXPERTISE</span>
          <h3>{active}</h3>
          <div className="skill-tags">
            {skills[active].map(skill => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const section = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!section.current) return;
        const rect = section.current.getBoundingClientRect();
        const start = window.innerHeight * 0.65;
        const distance = Math.max(rect.height - window.innerHeight * 0.2, 1);
        setProgress(Math.max(0, Math.min(1, (start - rect.top) / distance)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="approach" className="section process-section" ref={section}>
      <div className="container process-layout">
        <div className="process-intro">
          <Eyebrow number="04">MY PROCESS</Eyebrow>
          <h2 className="display" data-reveal>
            Good experiences<br />
            are <em>intentional.</em>
          </h2>
          <p>
            An approach that balances creative thinking,
            technical execution, and continuous improvement.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-track">
            <div className="timeline-progress" style={{ height: `${progress * 100}%` }} />
          </div>

          {process.map((step, index) => (
            <div className="timeline-item" key={step.title} data-reveal>
              <div className={`timeline-node ${progress >= index / process.length ? "active" : ""}`} />
              <span className="timeline-index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section id="achievements" className="section achievements">
      <div className="container">
        <Eyebrow number="05">RECOGNITION</Eyebrow>

        <div className="achievements-layout">
          <h2 className="display" data-reveal>
            Milestones<br />
            along the <em>way.</em>
          </h2>

          <div className="awards-list">
            {awards.map((award, index) => (
              <div
                className="award"
                key={award.title}
                data-reveal
                onPointerMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
                }}
              >
                <span className="award-hover" />
                <span className="award-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{award.title}</h3>
                  <p>{award.source}</p>
                </div>
                <ArrowUpRight size={17} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section id="credentials" className="section container">
      <Eyebrow number="06">CREDENTIALS & FOUNDATIONS</Eyebrow>

      <h2 className="display credentials-title" data-reveal>
        Committed to<br />
        continuous <em>learning.</em>
      </h2>

      <div className="cert-grid">
        {certificates.map((certificate, index) => (
          <article className="cert-card" key={certificate.title} data-reveal>
            <div className="cert-top">
              <span>CREDENTIAL / 0{index + 1}</span>
              <span>✳</span>
            </div>

            <div className="cert-middle">
              <span className="cert-watermark">C</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
            </div>

            <div className="cert-bottom">
              <span>{certificate.date}</span>
              {certificate.link ? (
                <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                  VERIFY ↗
                </a>
              ) : (
                <span>CERTIFIED</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section education-section">
      <div className="container education-layout">
        <div>
          <Eyebrow number="07">EDUCATION</Eyebrow>
          <h2 className="display" data-reveal>
            Grounded in<br />
            <em>fundamentals.</em>
          </h2>
        </div>

        <div className="education-list">
          {education.map(item => (
            <article className="education-item" key={item.school} data-reveal>
              <span className="education-years">{item.years}</span>
              <h3>{item.school}</h3>
              <p>{item.degree}</p>
              <p>{item.specialization}</p>
              <strong>{item.distinction}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: ""
  });

  const update = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

 
  const submit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      form.subject || `Portfolio inquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    window.location.href =
      `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <Eyebrow number="08">LET'S CONNECT</Eyebrow>

        <div className="contact-layout">
          <div className="contact-copy">
            <h2 className="display" data-reveal>
              Have something<br />
              in <em>mind?</em><br />
              Let's make<br />
              it happen.
            </h2>

            <p>
              Have a project, opportunity, or collaboration in mind?
              I'd love to hear about it.
            </p>

            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email} <ArrowUpRight size={20} />
            </a>

            <div className="contact-location">
              <MapPin size={15} /> {profile.location}
            </div>
          </div>

          <form className="contact-form" onSubmit={submit} data-reveal>
            <div className="form-top">
              <span>START A CONVERSATION</span>
              <span>01 — 04</span>
            </div>

            <label>
              YOUR NAME
              <input name="name" value={form.name} onChange={update} placeholder="Your name" required />
            </label>

            <label>
              EMAIL ADDRESS
              <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required />
            </label>

            <label>
              SUBJECT
              <input name="subject" value={form.subject} onChange={update} placeholder="What is this about?" />
            </label>

            <label>
              YOUR MESSAGE
              <textarea name="message" value={form.message} onChange={update} placeholder="Tell me about your idea..." rows="4" required />
            </label>

            <Magnetic type="submit">
              Open Email to Send <ArrowUpRight size={16} />
            </Magnetic>

            <p className="form-note">
              This opens your email application. It does not send automatically.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Expertise", "#expertise"],
    ["Achievements", "#achievements"],
    ["Contact", "#contact"]
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-divider" />

        <div className="footer-top">
          <div className="footer-availability">
            <span className="footer-label">AVAILABLE FOR COLLABORATION</span>
            <p>
              Full-Stack Web Developer & UI/UX Designer,
              based in Dasmariñas, Cavite, Philippines.
            </p>
          </div>

          <div className="footer-nav">
            <span className="footer-label">NAVIGATE</span>
            <div className="footer-nav-grid">
              {links.map(([name, href]) => (
                <a href={href} key={name}>{name}</a>
              ))}
            </div>
          </div>

          <div className="footer-social">
            <span className="footer-label">ELSEWHERE</span>
            <a href={`mailto:${profile.email}`}>Email</a>
            {profile.linkedin ? (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            ) : <span>LinkedIn · SOON</span>}
            {profile.github ? (
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            ) : <span>GitHub · SOON</span>}
          </div>

          <a className="footer-back" href="#home">
            Back to top <span><ArrowUp size={15} /></span>
          </a>
        </div>

        <div className="footer-signature">
          <div className="footer-first">
            ALLIYAH MHAY <span className="footer-star">✳</span>
          </div>
          <div className="footer-last">T. ARUTA</div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alliyah Mhay T. Aruta. All rights reserved.</span>
          <span>DESIGNED & DEVELOPED BY ALLIYAH</span>
        </div>
      </div>
    </footer>
  );
}


function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("portfolio-theme") || "light"
  );

  // Controls the opening welcome animation
  const [showIntro, setShowIntro] = useState(true);

  useReveal();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <>
      {/* Opening animation */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Custom cursor and drag effects */}
      <CustomCursor />

      {/* Navigation */}
      <Header theme={theme} setTheme={setTheme} />

      {/* Main portfolio */}
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Expertise />
        <Process />
        <Achievements />
        <Credentials />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
