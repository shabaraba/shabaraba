import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Navigation from '../components/ui/Navigation';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  background-color: var(--color-background);
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 120px 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 100px 1rem 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: var(--color-text);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 4px;
    background-color: var(--color-accent);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Paragraph = styled(motion.p)`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.9;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SkillsContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`;

const Skill = styled(motion.div)`
  background-color: var(--color-primary);
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  border-left: 3px solid var(--color-accent);
  color: var(--color-text);
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border-color: var(--color-accent-alt);
  }
`;

const ExperienceWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const ExperienceCard = styled(motion.div)`
  background-color: var(--color-primary);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--color-accent);
  }
`;

const CompanyName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const JobTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--color-accent);
  margin-bottom: 1rem;
`;

const DateRange = styled.p`
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  opacity: 0.9;
`;

const About = () => {
  const location = useLocation();
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Container>
      <Navigation />
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Me
        </Title>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Professional Profile</SectionTitle>
          <Paragraph>
            I'm a versatile engineer with experience across multiple industries, always focused on 
            technical innovation and process optimization. I excel at identifying challenges, 
            proposing creative solutions, and implementing them effectively.
          </Paragraph>
          <Paragraph>
            Throughout my career at companies like Cybozu, Smaregi, Kawasaki Heavy Industries, 
            and Brother Industries, I've consistently driven initiatives to enhance efficiency 
            and product quality. I'm particularly skilled at refactoring complex code, automating 
            repetitive processes, and improving team workflows.
          </Paragraph>
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Technical Skills</SectionTitle>
          <Paragraph>
            I've developed expertise in a wide range of technologies through hands-on experience across 
            different sectors. My technical toolkit enables me to tackle diverse challenges and deliver 
            efficient solutions.
          </Paragraph>
          <SkillsContainer>
            <Skill whileHover={{ scale: 1.05 }}>TypeScript</Skill>
            <Skill whileHover={{ scale: 1.05 }}>JavaScript</Skill>
            <Skill whileHover={{ scale: 1.05 }}>React</Skill>
            <Skill whileHover={{ scale: 1.05 }}>Java</Skill>
            <Skill whileHover={{ scale: 1.05 }}>SpringBoot</Skill>
            <Skill whileHover={{ scale: 1.05 }}>PHP</Skill>
            <Skill whileHover={{ scale: 1.05 }}>C</Skill>
            <Skill whileHover={{ scale: 1.05 }}>jQuery</Skill>
            <Skill whileHover={{ scale: 1.05 }}>Scrum</Skill>
            <Skill whileHover={{ scale: 1.05 }}>API Development</Skill>
            <Skill whileHover={{ scale: 1.05 }}>Full Stack Development</Skill>
            <Skill whileHover={{ scale: 1.05 }}>Automation</Skill>
          </SkillsContainer>
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Work Experience</SectionTitle>
          <ExperienceWrapper>
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>Cybozu Inc.</CompanyName>
              <JobTitle>Full Stack Engineer</JobTitle>
              <DateRange>August 2022 - Present</DateRange>
              <Description>
                Working on kintone application features and developer tools, focused on API development, 
                backend services, and frontend components. Led code refactoring initiatives to improve 
                maintainability and implemented API client auto-generation solutions.
              </Description>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>Smaregi Inc.</CompanyName>
              <JobTitle>Full Stack Engineer</JobTitle>
              <DateRange>February 2020 - July 2022</DateRange>
              <Description>
                Developed and maintained POS management web applications, refactored large-scale 
                transaction logic to improve maintainability, and implemented automated E2E testing 
                for critical business logic.
              </Description>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>Kawasaki Heavy Industries</CompanyName>
              <JobTitle>QA Engineer / Embedded Engineer</JobTitle>
              <DateRange>June 2018 - January 2020</DateRange>
              <Description>
                Led quality assurance for industrial robot software, automated testing processes, 
                and improved progress tracking systems. Reduced evaluation workload by approximately 
                30% through custom automation scripts.
              </Description>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>Brother Industries, Ltd.</CompanyName>
              <JobTitle>Engineer</JobTitle>
              <DateRange>April 2017 - May 2018</DateRange>
              <Description>
                Participated in embedded software development for industrial equipment. Worked on 
                software design, testing, and implementation. Also gained experience through manufacturing, 
                sales, customer support, and quality assurance assignments.
              </Description>
            </ExperienceCard>
          </ExperienceWrapper>
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Professional Approach</SectionTitle>
          <Paragraph>
            My career has consistently been guided by two core principles: efficiency optimization 
            and quality enhancement. I take pride in my analytical ability to identify issues, 
            creative problem-solving skills to develop solutions, and technical expertise to 
            implement them effectively.
          </Paragraph>
          <Paragraph>
            I'm passionate about continuous learning and applying new technologies to solve 
            real-world problems. I thrive in collaborative environments and enjoy contributing 
            to team growth through knowledge sharing and mentorship.
          </Paragraph>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default About;
