import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/ui/Navigation';
import ThreeScene from '../components/three/ThreeScene';
import AboutContent from './About';
import ProjectsContent from './Projects';
import ContactContent from './Contact';

export type ActiveSection = 'home' | 'about' | 'projects' | 'contact' | null;

// Styled components
const Page = styled.div`
  overflow-x: hidden;
  position: relative;
  background-color: transparent; /* Changed from solid background to transparent */
`;

const Section = styled.div`
  min-height: 100vh;
  position: relative;
  scroll-margin-top: 80px;
  padding: 3rem 0;
  background-color: rgba(7, 10, 20, 0.65); /* Semi-transparent dark blue background */
  backdrop-filter: blur(3px); /* Slight blur effect */
  
  &:not(:first-of-type) {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

// Home section components
const HomeSection = styled(Section)`
  overflow: hidden;
  position: relative;
  background-color: transparent; /* First section fully transparent */
  backdrop-filter: none; /* No blur on first section */
`;

const ThreeSceneContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0; /* Changed from -1 to 0 */
  pointer-events: none; /* Allow interaction with content below */
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%; /* Reduced from 100% to avoid covering scroll indicator */
    background: linear-gradient(135deg, rgba(7, 10, 20, 0.7) 0%, rgba(7, 10, 20, 0.4) 100%);
    z-index: -1;
    border-radius: 8px;
    backdrop-filter: blur(2px);
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-text);
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.9;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Highlight = styled.span`
  color: var(--color-accent);
  font-weight: bold;
  text-shadow: 0 0 15px rgba(0, 165, 255, 0.7), 0 0 25px rgba(0, 165, 255, 0.5);
`;

const ScrollIndicator = styled(motion.div)`
  position: fixed; /* Changed from absolute to fixed */
  bottom: 2.5rem;
  /* 完全に中央に配置するための設定 */
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  /* 固定幅を設定して中央に配置 */
  width: max-content;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  opacity: 0.95;
  background: rgba(7, 10, 20, 0.7);
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2);
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  z-index: 999; /* Extremely high z-index to ensure it's above everything */
  border: 1px solid rgba(0, 165, 255, 0.2);
  animation: pulse 3s infinite ease-in-out;
  text-align: center; /* Ensure text is centered */
  
  span {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    white-space: nowrap; /* Prevent text wrapping */
  }
  
  i {
    font-size: 1.5rem;
    animation: bounce 2s infinite;
    color: var(--color-accent);
    text-shadow: 0 0 10px rgba(0, 165, 255, 0.7);
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2);
    }
    50% {
      box-shadow: 0 4px 20px rgba(0, 165, 255, 0.3), 0 0 30px rgba(0, 165, 255, 0.2);
    }
  }
  
  /* モバイル対応の調整 */
  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    /* 中央配置は上記のleft/right: 0とmargin: autoで維持 */
  }
`;

// Content wrapper for other sections
const SectionContent = styled.div`
  max-width: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t } = useTranslation();
  
  // Using HTMLDivElement instead of HTMLElement for more specificity
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // Update mouse position for ThreeJS scene
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Track scroll position to hide indicator after small scroll
  useEffect(() => {
    const handleScroll = () => {
      // Hide indicator when scrolled more than 50px (reduced from 100px for faster disappearance)
      if (window.scrollY > 50 && !hasScrolled) {
        setHasScrolled(true);
        setShowScrollIndicator(false);
      } else if (window.scrollY === 0) {
        // Show indicator again when back at the top
        setHasScrolled(false);
        setShowScrollIndicator(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);
  
  // Set up intersection observer to track active section
  useEffect(() => {
    const sectionRefs = [
      { ref: homeRef, id: 'home' },
      { ref: aboutRef, id: 'about' },
      { ref: projectsRef, id: 'projects' },
      { ref: contactRef, id: 'contact' }
    ];
    
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-50% 0px', // Consider section active when it's in the middle of viewport
      threshold: 0 // Trigger as soon as any part of the element is visible
    };
    
    // Observer for active section tracking
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id as ActiveSection;
          setActiveSection(id);
          
          // Home section is no longer the only factor for showing the indicator
          // The scroll position (hasScrolled) now also determines it
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);
  
  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <Page>
      <Navigation 
        scrollToSection={scrollToSection} 
        refs={{ homeRef, aboutRef, projectsRef, contactRef }}
        activeSection={activeSection}
      />
      
      {/* Three.js Background - Fixed across all sections */}
      <ThreeSceneContainer>
        <ThreeScene mousePosition={mousePosition} />
      </ThreeSceneContainer>
      
      {/* Home Section */}
      <HomeSection id="home" ref={homeRef}>
        <ContentWrapper>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              maxWidth: "600px", 
              padding: "2rem", 
              borderRadius: "12px",
              background: "rgba(7, 10, 20, 0.5)",
              backdropFilter: "blur(5px)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(0, 165, 255, 0.15)"
            }}
          >
            <Title>
              Hello, I'm <Highlight>Shabaraba</Highlight>
            </Title>
            <Subtitle>
              {t('home.title')}
            </Subtitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                lineHeight: "1.7", 
                marginBottom: "1.5rem",
                textShadow: "0 0 8px rgba(0, 0, 0, 0.6)"
              }}
            >
              {t('home.subtitle')}
            </motion.p>
          </motion.div>
        </ContentWrapper>
        
        <AnimatePresence>
          {showScrollIndicator && (
            <ScrollIndicator
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span>{t('scroll_down')}</span>
              <i className="fas fa-chevron-down"></i>
            </ScrollIndicator>
          )}
        </AnimatePresence>
      </HomeSection>
      
      {/* About Section */}
      <Section id="about" ref={aboutRef}>
        <SectionContent>
          <AboutContent isSection={true} />
        </SectionContent>
      </Section>
      
      {/* Projects Section */}
      <Section id="projects" ref={projectsRef}>
        <SectionContent>
          <ProjectsContent isSection={true} />
        </SectionContent>
      </Section>
      
      {/* Contact Section */}
      <Section id="contact" ref={contactRef}>
        <SectionContent>
          <ContactContent isSection={true} />
        </SectionContent>
      </Section>
    </Page>
  );
};

export default LandingPage;