import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Navigation from '../components/ui/Navigation';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ContactProps {
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
  max-width: 800px;
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

const Paragraph = styled(motion.p)`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  background-color: var(--color-primary);
  border: 2px solid var(--color-secondary);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  background-color: var(--color-primary);
  border: 2px solid var(--color-secondary);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background-color: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: var(--color-accent-alt);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SocialLinksSection = styled(motion.div)`
  margin-top: 3rem;
`;

const SocialLinksHeading = styled.h2`
  font-size: 1.8rem;
  color: var(--color-accent);
  margin-bottom: 1.2rem;
`;

const SocialLinksDescription = styled(motion.p)`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.9;
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const SocialLink = styled(motion.a)`
  color: var(--color-text);
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--color-accent);
    transform: translateY(-5px);
  }
  
  i {
    margin-right: 0.5rem;
  }
`;

const SocialLinkText = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
`;


const Contact = ({ isSection = false }: ContactProps) => {
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
          {t('contact.title')}
        </Title>
        
        <Paragraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('contact.subtitle')}
        </Paragraph>
        
        <SocialLinksSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SocialLinksHeading>{t('contact.connect_with_me')}</SocialLinksHeading>
          <SocialLinksDescription>
            {t('contact.connect_message')}
          </SocialLinksDescription>
          
          <SocialLinks>
            <SocialLink 
              href="https://github.com/shabaraba" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <i className="fab fa-github"></i>
              <SocialLinkText>GitHub</SocialLinkText>
            </SocialLink>
            
            <SocialLink 
              href="https://x.com/shabaraba" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <i className="fab fa-x"></i>
              <SocialLinkText>X</SocialLinkText>
            </SocialLink>
            
          </SocialLinks>
          
        </SocialLinksSection>
      </ContentWrapper>
    </Container>
  );
};

export default Contact;
