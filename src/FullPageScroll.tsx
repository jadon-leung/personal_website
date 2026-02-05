import { useEffect, useRef, useState, useCallback } from 'react'
import './FullPageScroll.css'

const FullPageScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const backgroundLayerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const hasTypedRef = useRef(false);
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<number>(-1);

    // Calculate which section is most in view
    const updateActiveSection = useCallback(() => {
        const sections = sectionsRef.current.filter(Boolean);
        const windowHeight = window.innerHeight;
        const viewportCenter = windowHeight / 2;

        let closestSection = -1;
        let closestDistance = Infinity;

        sections.forEach((section, index) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            // Only consider sections that are at least partially visible
            if (rect.top < windowHeight && rect.bottom > 0) {
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = index;
                }
            }
        });

        setActiveSection(closestSection);
    }, []);

    // Smooth scroll progress tracking
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(currentScrollY / maxScroll, 1);
        setScrollProgress(progress);

        // Subtle parallax on background
        if (backgroundLayerRef.current) {
            backgroundLayerRef.current.style.transform = `translateY(${currentScrollY * 0.15}px)`;
        }

        // Update active section
        updateActiveSection();

        // Apply scroll-based transforms to all sections
        sectionsRef.current.forEach((section, index) => {
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;

            // Hero section (index 0) - keep fully visible when near top of page
            if (index === 0) {
                const isNearTop = rect.top >= -100 && rect.top <= windowHeight * 0.3;
                if (isNearTop) {
                    section.style.transform = 'translateY(0) scale(1)';
                    section.style.filter = 'blur(0px)';
                    section.style.opacity = '1';
                    return;
                }
            }

            // Calculate how far from center (0 = center, 1 = edge)
            const distanceFromCenter = Math.abs(sectionCenter - viewportCenter) / (windowHeight / 2);
            const normalizedDistance = Math.min(distanceFromCenter, 1);

            // Calculate direction (positive = below center, negative = above)
            const direction = sectionCenter > viewportCenter ? 1 : -1;

            // Apply transforms based on distance from center
            const scale = 1 - normalizedDistance * 0.05;
            const translateY = normalizedDistance * 20 * direction;
            const blur = normalizedDistance * 2;

            section.style.transform = `translateY(${translateY}px) scale(${scale})`;
            section.style.filter = `blur(${blur}px)`;
            section.style.opacity = `${1 - normalizedDistance * 0.4}`;
        });
    }, [updateActiveSection]);

    useEffect(() => {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        // Staggered project animations
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.project-list-items');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('project-item-visible');
                        }, index * 80);
                    });
                }
            });
        }, { threshold: 0.1 });

        const projectsSection = document.querySelector('[data-section="projects"]');
        if (projectsSection) {
            projectObserver.observe(projectsSection);
        }

        // Typing animation for main title
        const typeWriter = () => {
            const text = "hi, i'm jadon leung";
            const titleElement = titleRef.current;
            if (titleElement && !hasTypedRef.current) {
                hasTypedRef.current = true;
                titleElement.textContent = '';

                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length && titleElement) {
                        titleElement.textContent = text.substring(0, i + 1);
                        i++;
                    } else {
                        clearInterval(typing);
                        if (titleElement) {
                            titleElement.setAttribute('data-typed', 'true');
                        }
                    }
                }, 60);
            }
        };

        const typingTimeout = setTimeout(typeWriter, 800);

        // Scroll listener with throttling
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Initial call
        handleScroll();

        return () => {
            observer.disconnect();
            projectObserver.disconnect();
            clearTimeout(typingTimeout);
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [handleScroll]);

    // Helper to set section refs
    const setSectionRef = (index: number) => (el: HTMLElement | null) => {
        sectionsRef.current[index] = el;
    };

    return (
        <div className="main-container" ref={containerRef}>
            {/* Scroll Progress Indicator */}
            <div className="scroll-progress">
                <div
                    className="scroll-progress-bar"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Section indicator dots */}
            <nav className="section-nav">
                {['hello', 'about', 'projects', 'connect'].map((name, index) => (
                    <button
                        key={name}
                        className={`section-dot ${activeSection === index ? 'active' : ''}`}
                        onClick={() => {
                            sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        aria-label={`Go to ${name} section`}
                    >
                        <span className="section-dot-label">{name}</span>
                    </button>
                ))}
            </nav>

            {/* Dynamic Background Layer */}
            <div className="background-layer" ref={backgroundLayerRef}>
                <div className="floating-element floating-1" />
                <div className="floating-element floating-2" />
                <div className="floating-element floating-3" />
                {/* Spotlight that follows active section */}
                <div
                    className="section-spotlight"
                    style={{
                        opacity: activeSection >= 0 ? 1 : 0,
                        top: activeSection >= 0 ? `${25 + activeSection * 25}%` : '50%'
                    }}
                />
            </div>

            <div className="fullpage-wrapper">
                {/* Hero Section */}
                <header
                    ref={setSectionRef(0)}
                    className={`section-container hero-section ${activeSection === 0 ? 'section-active' : ''}`}
                >
                    <div className="hero-content">
                        <div className="headshot-container animate-on-scroll">
                            <div className="headshot-wrapper">
                                <div className="headshot-glow" />
                                <img
                                    src="/personal_website/headshot.JPG"
                                    alt="Jadon Leung"
                                    className="headshot-image"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                />
                                <div className="headshot-placeholder" style={{display: 'none'}}>
                                    <span>JL</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-text">
                            <h1 id="heyStyle" ref={titleRef}>hi, i'm jadon leung</h1>
                            <h3 className="header">
                                 undergrad at{' '}
                                <a href="https://www.usc.edu/" id="usc" target="_blank" rel="noopener noreferrer">
                                    usc
                                </a>
                                {' '}studying computational and applied mathematics
                            </h3>
                        </div>
                    </div>
                </header>

                {/* About Section */}
                <section
                    ref={setSectionRef(1)}
                    className={`animate-on-scroll section-pop section-container ${activeSection === 1 ? 'section-active' : ''}`}
                >
                    <div className="section-highlight" />
                    <h2>about</h2>
                    <p className="aboutme">
                        I'm an undergraduate at the University of Southern California studying
                        computational and applied mathematics, concentrating in computer science.
                        My main interests lie in full stack development and machine learning.
                        These past summers I interned for{' '}
                        <a href="https://www.taodigitalsolutions.com/" target="_blank" rel="noopener noreferrer" id="text-link">
                            TAO Digital Solutions
                        </a>, a digital solutions company, and {' '}
                        <a href="https://www.gopipa.com/admin/home" target="_blank" rel="noopener noreferrer" id="text-link">
                            GoPIPA
                        </a>, an AI fintech company. I also interned as an investment analyst for{' '}
                        <a href="https://www.avaleriancapital.com/" target="_blank" rel="noopener noreferrer" id="text-link">
                            Avalerian
                        </a>, a search fund focused on acquiring B2B SaaS companies. In my free time, I enjoy playing volleyball, cooking, and reading philosophy.
                    </p>
                </section>

                {/* Projects Section */}
                <section
                    ref={setSectionRef(2)}
                    className={`animate-on-scroll section-pop section-container ${activeSection === 2 ? 'section-active' : ''}`}
                    data-section="projects"
                >
                    <div className="section-highlight" />
                    <h2>projects</h2>
                    <ul className="project-items">
                        <div className="item-placeholder">
                            <a href="https://github.com/jadon-leung/kanban" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">kanban board</span>
                                            <span className="summarizer-description">productivity board</span>
                                        </div>
                                        <span className="summarizer-date">Feb 2026</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                        <div className="item0">
                            <a href="https://github.com/jadon-leung/rag" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">lease.ai</span>
                                            <span className="summarizer-description">understanding lease documents through rag</span>
                                        </div>
                                        <span className="summarizer-date">Nov 2024</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                        <div className="item1">
                            <a href="https://github.com/jadon-leung/STUDI" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">studi</span>
                                            <span className="summarizer-description">(wip) study group social app</span>
                                        </div>
                                        <span className="summarizer-date">May 2024</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                        <div className="item2">
                            <a href="https://github.com/jadon-leung/GP-for-Stock" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">gp</span>
                                            <span className="summarizer-description">gaussian processes for stock prediction</span>
                                        </div>
                                        <span className="summarizer-date">June 2024</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                        <div className="item3">
                            <a href="https://github.com/jadon-leung/summarizer" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">summarizer</span>
                                            <span className="summarizer-description">web page summarizer</span>
                                        </div>
                                        <span className="summarizer-date">Aug 2024</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                        <div className="item4">
                            <a href="https://github.com/jadon-leung/JADN" target="_blank" rel="noreferrer">
                                <li className="project-list-items">
                                    <div className="space">
                                        <div className="items-center">
                                            <span className="summarizer">jadn</span>
                                            <span className="summarizer-description">schedule calendar events using llm</span>
                                        </div>
                                        <span className="summarizer-date">Sep 2024</span>
                                    </div>
                                </li>
                            </a>
                        </div>
                    </ul>
                </section>

                {/* Connect Section */}
                <section
                    ref={setSectionRef(3)}
                    className={`animate-on-scroll section-pop section-container ${activeSection === 3 ? 'section-active' : ''}`}
                >
                    <div className="section-highlight" />
                    <h2>connect</h2>
                    <p className="aboutme">reach me at jadonleu@usc.edu</p>
                    <div className="socials">
                        <a
                            className="linkedin"
                            href="https://www.linkedin.com/in/jadon-leung/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <svg className="social-icons" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </g>
                            </svg>
                        </a>
                        <a
                            className="github"
                            href="https://github.com/jadon-leung/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <svg className="social-icons" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </g>
                            </svg>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default FullPageScroll;
