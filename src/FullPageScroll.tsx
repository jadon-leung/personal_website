//@ts-nocheck

import React, {useEffect} from 'react'
// import Fullpage, {FullPageSections, FullpageSection, FullpageNavigation} from '@ap.cx/react-fullpage'
import './FullPageScroll.css'
const FullPageScroll = () => {
    useEffect(() => {
        const sectionElement = document.querySelector('.fullpage-section-class'); // replace with correct class if necessary
        if (sectionElement) {
          console.log(sectionElement.clientHeight); // Ensure this is only called when the element is available
        }
      }, []);
    const SectionStyle1 = {
        
            height: '100vh',
            width:'100%',
            // marginTop: '600px',
            // display: 'flex-center',
            justifyContent: 'center',
            alignItems: 'center',

    }
    return (
        <div>
            <>
                <div style = {SectionStyle1}>
                 
                    <h1 id = 'heyStyle'>hey, i'm jadon leung</h1>
                    <h3 className = 'header'>incoming undergrad at 
                        <a href = "https://www.usc.edu/"  id = 'usc' target = "_blank"> usc </a>
                        studying computational and applied mathematics
                    </h3>
                    {/* <p className = 'blinking-text'>scroll to learn more</p> */}
                    <div>
                        <h2>about</h2>
                        <p className = "aboutme">
                            I'm an undergraduate at the University of Southern California studying Computational and Applied Mathematics, concentrating in computer science.
                            My main interests lie in deep learning and econometrics. This past summer I did software development for 
                            <a href = 'https://www.gopipa.com/admin/home' target = '_blank' id = 'text-link'> GoPipa</a>, an AI fintech company. Currently, I am an investment analayst for
                            <a href = 'https://www.avaleriancapital.com/' target = '_blank' id = 'text-link'> Avalerian</a>, a search fund focused on acquiring B2B SaaS companies.
                        </p>
                        
                    </div>
                    <div>
                        <h2>projects</h2>
                        <ul className = 'project-items'>
                            <div className = 'item1'>
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
                            <div className = 'item2'>
                            <a href = 'https://github.com/jadon-leung/JADN' target = '_blank' rel = 'noreferrer'>
                                <li className = 'project-list-items'>
                                    <div className = 'space'>
                                        <div className = 'items-center'>  
                                            <span className = 'summarizer'>scheduler</span>
                                            <span className = 'summarizer-description'> schedule calendar events using llm</span>
                                        </div>
                                        <span className = 'summarizer-date'>Sep 2024</span>
                                    </div>                                
                                </li>
                            </a>
                            </div>
                            <div className = 'item3'>
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
                        </ul>
                    </div>
                    <div>
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
               
            </>
        </div>
    )
}

export default FullPageScroll;