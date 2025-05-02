import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Navigation from '../components/ui/Navigation';
import ThreeScene from '../components/three/ThreeScene';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-text);
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Highlight = styled.span`
  color: var(--color-accent);
  font-weight: bold;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledButton = styled(motion.a)`
  padding: 0.8rem 2rem;
  background-color: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-accent-alt);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(StyledButton)`
  background-color: transparent;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  
  &:hover {
    background-color: var(--color-accent);
    color: var(--color-background);
  }
`;

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Update mouse position
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

  return (
    <Container>
      <Navigation />
      <ThreeScene mousePosition={mousePosition} />
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>
            Hello, I'm <Highlight>Shabaraba</Highlight>
          </Title>
          <Subtitle>
            Full Stack Engineer & Problem Solver
          </Subtitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I specialize in creating efficient solutions and optimizing workflows.
            With experience across multiple industries, I bring a unique perspective
            to every project.
          </motion.p>
          <ButtonContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StyledButton href="/about">Learn More</StyledButton>
            <SecondaryButton href="/contact">Get In Touch</SecondaryButton>
          </ButtonContainer>
        </motion.div>
      </ContentWrapper>
    </Container>
  );
};

export default Home;
