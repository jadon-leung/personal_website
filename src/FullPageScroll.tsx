
import {useEffect, useRef, useState, useCallback} from 'react'
// import Fullpage, {FullPageSections, FullpageSection, FullpageNavigation} from '@ap.cx/react-fullpage'
import './FullPageScroll.css'

const FullPageScroll = () => {
    const headshotRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const connectRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const backgroundLayerRef = useRef<HTMLDivElement>(null);
    const hasTypedRef = useRef(false);
    
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollVelocity, setScrollVelocity] = useState(0);

    // Smooth scroll tracking with momentum
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(currentScrollY / maxScroll, 1);
        
        setScrollVelocity(currentScrollY - scrollY);
        setScrollY(currentScrollY);
        setScrollProgress(progress);
    }, [scrollY]);

    useEffect(() => {
        // Enhanced Intersection Observer for dynamic animations
        const observerOptions = {
            threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const element = entry.target as HTMLElement;
                const ratio = entry.intersectionRatio;
                
                if (entry.isIntersecting) {
                    element.classList.add('animate-in');
                    
                    // Dynamic transforms based on intersection ratio
                    const transform = `translateY(${(1 - ratio) * 50}px) scale(${0.9 + ratio * 0.1})`;
                    const opacity = ratio;
                    
                    element.style.transform = transform;
                    element.style.opacity = opacity.toString();
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        // Staggered project animations with enhanced effects
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.project-list-items');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('project-item-visible');
                            
                            // Add random rotation and scale variations
                            const randomRotation = (Math.random() - 0.5) * 2;
                            const randomScale = 0.98 + Math.random() * 0.04;
                            
                            (item as HTMLElement).style.setProperty('--random-rotation', `${randomRotation}deg`);
                            (item as HTMLElement).style.setProperty('--random-scale', randomScale.toString());
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        if (projectsRef.current) {
            projectObserver.observe(projectsRef.current);
        }

        // Typing animation for main title (run only once)
        const typeWriter = () => {
            const text = "hi, i'm jadon leung";
            const titleElement = titleRef.current;
            if (titleElement && !hasTypedRef.current) {
                hasTypedRef.current = true;
                titleElement.textContent = '';
                titleElement.style.borderRight = '3px solid white';
                
                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length && titleElement) {
                        titleElement.textContent = text.substring(0, i + 1);
                        i++;
                    } else {
                        clearInterval(typing);
                        if (titleElement) {
                            setTimeout(() => {
                                titleElement.style.borderRight = 'none';
                            }, 1000);
                        }
                    }
                }, 80);
            }
        };

        const typingTimeout = setTimeout(typeWriter, 500);

        return () => {
            observer.disconnect();
            projectObserver.disconnect();
            clearTimeout(typingTimeout);
        };
    }, []);

    // Advanced scroll effects - apply to all elements
    useEffect(() => {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = scrollY;
            
            // Helper function to calculate visibility and transforms
            const applyScrollTransform = (element: HTMLElement | null, options: {
                fadeStart?: number;
                fadeEnd?: number;
                scaleMin?: number;
                rotateMax?: number;
                translateYRate?: number;
            } = {}) => {
                if (!element) return;
                
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementCenter = rect.top + rect.height / 2;
                
                // Calculate how far the element is from the optimal viewing position
                const optimalPosition = windowHeight * 0.5;
                const distanceFromOptimal = Math.abs(elementCenter - optimalPosition);
                const maxDistance = windowHeight;
                
                // Normalize distance (0 = optimal, 1 = far away)
                const normalizedDistance = Math.min(distanceFromOptimal / maxDistance, 1);
                
                // Calculate transforms based on distance
                const opacity = Math.max(1 - normalizedDistance * (options.fadeEnd ?? 1.2), 0);
                const scale = Math.max(1 - normalizedDistance * (1 - (options.scaleMin ?? 0.85)), options.scaleMin ?? 0.85);
                const rotateX = normalizedDistance * (options.rotateMax ?? 15) * (elementCenter > optimalPosition ? 1 : -1);
                const translateY = normalizedDistance * (options.translateYRate ?? 30) * (elementCenter > optimalPosition ? 1 : -1);
                
                element.style.opacity = opacity.toString();
                element.style.transform = `
                    perspective(1000px)
                    translateY(${translateY}px)
                    rotateX(${rotateX}deg)
                    scale(${scale})
                `;
            };
            
            // Apply to headshot
            if (headshotRef.current) {
                const headshot = headshotRef.current.querySelector('.headshot-wrapper') as HTMLElement;
                applyScrollTransform(headshot, {
                    fadeEnd: 1.5,
                    scaleMin: 0.7,
                    rotateMax: 20,
                    translateYRate: 50
                });
            }
            
            // Apply to title
            if (titleRef.current) {
                applyScrollTransform(titleRef.current, {
                    fadeEnd: 1.3,
                    scaleMin: 0.9,
                    rotateMax: 10,
                    translateYRate: 20
                });
            }
            
            // Apply to subtitle
            if (subtitleRef.current) {
                applyScrollTransform(subtitleRef.current, {
                    fadeEnd: 1.2,
                    scaleMin: 0.92,
                    rotateMax: 8,
                    translateYRate: 15
                });
            }

            // Apply to all sections
            [aboutRef, projectsRef, connectRef].forEach((ref) => {
                if (ref.current) {
                    applyScrollTransform(ref.current, {
                        fadeEnd: 1.0,
                        scaleMin: 0.9,
                        rotateMax: 8,
                        translateYRate: 25
                    });
                    
                    // Also apply to individual project items within projects section
                    if (ref === projectsRef) {
                        const projectItems = ref.current.querySelectorAll('.project-list-items');
                        projectItems.forEach((item, index) => {
                            const itemElement = item as HTMLElement;
                            const rect = itemElement.getBoundingClientRect();
                            const windowHeight = window.innerHeight;
                            const elementCenter = rect.top + rect.height / 2;
                            const optimalPosition = windowHeight * 0.5;
                            const distanceFromOptimal = Math.abs(elementCenter - optimalPosition);
                            const normalizedDistance = Math.min(distanceFromOptimal / windowHeight, 1);
                            
                            const opacity = Math.max(1 - normalizedDistance * 1.2, 0);
                            const scale = Math.max(1 - normalizedDistance * 0.15, 0.85);
                            const translateX = normalizedDistance * 20 * (index % 2 === 0 ? -1 : 1);
                            
                            itemElement.style.opacity = opacity.toString();
                            itemElement.style.transform = `
                                translateX(${translateX}px)
                                scale(${scale})
                            `;
                        });
                    }
                    
                    // Apply to social icons in connect section
                    if (ref === connectRef) {
                        const socials = ref.current.querySelector('.socials') as HTMLElement;
                        if (socials) {
                            const rect = socials.getBoundingClientRect();
                            const windowHeight = window.innerHeight;
                            const elementCenter = rect.top + rect.height / 2;
                            const optimalPosition = windowHeight * 0.5;
                            const distanceFromOptimal = Math.abs(elementCenter - optimalPosition);
                            const normalizedDistance = Math.min(distanceFromOptimal / windowHeight, 1);
                            
                            const opacity = Math.max(1 - normalizedDistance * 1.3, 0);
                            const scale = Math.max(1 - normalizedDistance * 0.2, 0.8);
                            
                            socials.style.opacity = opacity.toString();
                            socials.style.transform = `scale(${scale})`;
                        }
                    }
                }
            });

            // Background layer parallax
            if (backgroundLayerRef.current) {
                const bgTransform = scrolled * 0.3;
                backgroundLayerRef.current.style.transform = `translateY(${bgTransform}px)`;
            }

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', requestScrollUpdate);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', requestScrollUpdate);
        };
    }, [handleScroll, scrollY, scrollVelocity]);
    const SectionStyle1 = {
        
            height: '100%',
            width:'100%',
            // marginTop: '600px',
            // display: 'flex-center',
            justifyContent: 'center',
            alignItems: 'center',

    }
    return (
        <div className="main-container" ref={containerRef}>
            {/* Scroll Progress Indicator */}
            <div className="scroll-progress">
                <div 
                    className="scroll-progress-bar" 
                    style={{ width: `${scrollProgress * 100}%` }}
                ></div>
            </div>
            
            {/* Dynamic Background Layer */}
            <div className="background-layer" ref={backgroundLayerRef}>
                <div className="floating-element floating-1"></div>
                <div className="floating-element floating-2"></div>
                <div className="floating-element floating-3"></div>
            </div>

            <div className="fullpage-wrapper">
                <div style = {SectionStyle1}>
                    {/* Headshot Section */}
                    <div className="headshot-container animate-on-scroll" ref={headshotRef}>
                        <div className="headshot-wrapper">
                            <img 
                                src="/personal_website/headshot.JPG" 
                                alt="Jadon Leung headshot" 
                                className="headshot-image"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (placeholder) placeholder.style.display = 'flex';
                                }}
                            />
                            <div className="headshot-placeholder" style={{display: 'none'}}>
                                <span>Add your headshot here</span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <h1 id = 'heyStyle' ref={titleRef}>hi, i'm jadon leung</h1>
                    <h3 className = 'header' ref={subtitleRef}>incoming undergrad at{' '}
                        <a href = "https://www.usc.edu/"  id = 'usc' target = "_blank">usc</a>
                        {' '}studying computational and applied mathematics
                    </h3>
                    {/* <p className = 'blinking-text'>scroll to learn more</p> */}
                    <div className="animate-on-scroll section-pop" ref={aboutRef}>
                        <h2>about</h2>
                        <p className = "aboutme">
                            i'm an undergraduate at the University of Southern California studying computational and applied mathematics, concentrating in computer science.
                            my main interests lie in full stack development and machine learning. these past summers I interned for{' '}
                            <a href = 'https://www.taodigitalsolutions.com/' target = '_blank' id = 'text-link'> TAO Digital Solutions</a>, a digital solutions company and{' '}
                            <a href = 'https://www.gopipa.com/admin/home' target = '_blank' id = 'text-link'> GoPIPA</a>, an AI fintech company. I also interned as an investment analayst for{' '}
                            <a href = 'https://www.avaleriancapital.com/' target = '_blank' id = 'text-link'> Avalerian</a>, a search fund focused on acquiring B2B SaaS companies.
                        </p>
                        
                    </div>
                    <div className="animate-on-scroll section-pop" ref={projectsRef}>
                        <h2>projects</h2>
                        <ul className = 'project-items'>
                        <div className = 'item0'>
                            <a href = 'https://github.com/jadon-leung/rag' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>lease.ai</span>
                                            <span className = 'summarizer-description'> understanding lease documents through rag</span>
                                        </div>
                                        <span className = 'summarizer-date'>Nov 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                        <div className = 'item1'>
                            <a href = 'https://github.com/jadon-leung/STUDI' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>studi</span>
                                            <span className = 'summarizer-description'> (wip) study group social app</span>
                                        </div>
                                        <span className = 'summarizer-date'>May 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                        <div className = 'item2'>
                            <a href = 'https://github.com/jadon-leung/GP-for-Stock' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>gp</span>
                                            <span className = 'summarizer-description'> gaussian processes for stock prediction</span>
                                        </div>
                                        <span className = 'summarizer-date'>June 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                            <div className = 'item3'>
                            <a href = 'https://github.com/jadon-leung/summarizer' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>summarizer</span>
                                            <span className = 'summarizer-description'> web page summarizer</span>
                                        </div>
                                        <span className = 'summarizer-date'>Aug 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                            <div className = 'item4'>
                            <a href = 'https://github.com/jadon-leung/JADN' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>jadn</span>
                                            <span className = 'summarizer-description'> schedule calendar events using llm</span>
                                        </div>
                                        <span className = 'summarizer-date'>Sep 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                            
                        </ul>
                    </div>
                    <div className="animate-on-scroll section-pop" ref={connectRef}>
                        <h2>connect</h2>
                        <p>reach me at jadonleu@usc.edu</p>
                        <div className = 'socials'>
                            <a className = 'linkedin' href = 'https://www.linkedin.com/in/jadon-leung/' target = '_blank' rel = 'noopener noreferrer'>
                                {/* <span className = 'sr-only'>LinkedIn</span> */}
                                <svg className = 'social-icons' viewBox = '0 0 24 24'>
                                    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </g>  
                                    
                                </svg>
                            </a>
                            <a className = 'github' href = 'https://github.com/jadon-leung/'>
                                {/* <span className = 'sr-only'>Github</span> */}
                                <svg className = 'social-icons' viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </g>
                                </svg>
                            </a>

                        </div>
                    </div>
                    
                </div >
            </div>
        </div>
    )
}

export default FullPageScroll;