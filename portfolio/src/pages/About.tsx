import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/ui/Navigation';
import { useLocation } from 'react-router-dom';

interface AboutProps {
  isSection?: boolean;
}

const Container = styled.div<{ isSection?: boolean }>`
  min-height: 100vh;
  position: relative;
  background-color: ${props => props.isSection ? 'transparent' : 'var(--color-background)'};
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

const ProductLinkContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ProductCard = styled(motion.a)`
  display: inline-block;
  background-color: rgba(var(--color-accent-rgb), 0.1);
  border: 1px solid rgba(var(--color-accent-rgb), 0.3);
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  margin-right: 0.8rem;
  text-decoration: none;
  color: var(--color-accent);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--color-accent-rgb), 0.2);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
    margin-bottom: 0.5rem;
  }
`;

const About = ({ isSection = false }: AboutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Scroll to top when page loads (only when not used as a section)
  useEffect(() => {
    if (!isSection) {
      window.scrollTo(0, 0);
    }
  }, [location, isSection]);

  return (
    <Container isSection={isSection}>
      {!isSection && <Navigation />}
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('about.title')}
        </Title>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('about.professional_profile')}</SectionTitle>
          <Paragraph>
            {t('about.professional_profile_text1')}
          </Paragraph>
          <Paragraph>
            {t('about.professional_profile_text2')}
          </Paragraph>
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('about.technical_skills')}</SectionTitle>
          <Paragraph>
            {t('about.technical_skills_text')}
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
          <SectionTitle>{t('about.work_experience')}</SectionTitle>
          <ExperienceWrapper>
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>{t('about.companies.cybozu.name')}</CompanyName>
              <JobTitle>{t('about.companies.cybozu.job_title')}</JobTitle>
              <DateRange>{t('about.companies.cybozu.date_range')}</DateRange>
              <Description>
                {t('about.companies.cybozu.description')}
              </Description>
              <ProductLinkContainer>
                <ProductCard 
                  href="https://kintone.cybozu.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  kintone
                </ProductCard>
              </ProductLinkContainer>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>{t('about.companies.smaregi.name')}</CompanyName>
              <JobTitle>{t('about.companies.smaregi.job_title')}</JobTitle>
              <DateRange>{t('about.companies.smaregi.date_range')}</DateRange>
              <Description>
                {t('about.companies.smaregi.description')}
              </Description>
              <ProductLinkContainer>
                <ProductCard 
                  href="https://smaregi.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  Smaregi
                </ProductCard>
              </ProductLinkContainer>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>{t('about.companies.kawasaki.name')}</CompanyName>
              <JobTitle>{t('about.companies.kawasaki.job_title')}</JobTitle>
              <DateRange>{t('about.companies.kawasaki.date_range')}</DateRange>
              <Description>
                {t('about.companies.kawasaki.description')}
              </Description>
              <ProductLinkContainer>
                <ProductCard 
                  href="https://kawasakirobotics.com/jp/robots-category/wafer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  Kawasaki Robots
                </ProductCard>
              </ProductLinkContainer>
            </ExperienceCard>
            
            <ExperienceCard
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CompanyName>{t('about.companies.brother.name')}</CompanyName>
              <JobTitle>{t('about.companies.brother.job_title')}</JobTitle>
              <DateRange>{t('about.companies.brother.date_range')}</DateRange>
              <Description>
                {t('about.companies.brother.description')}
              </Description>
              <ProductLinkContainer>
                <ProductCard 
                  href="https://www.brother.co.jp/product/machine/speedio/index.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                >
                  SPEEDIO
                </ProductCard>
              </ProductLinkContainer>
            </ExperienceCard>
          </ExperienceWrapper>
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('about.professional_approach')}</SectionTitle>
          <Paragraph>
            {t('about.professional_approach_text1')}
          </Paragraph>
          <Paragraph>
            {t('about.professional_approach_text2')}
          </Paragraph>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default About;
