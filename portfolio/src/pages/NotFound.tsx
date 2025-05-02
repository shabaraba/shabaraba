import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '../components/ui/Navigation';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
`;

const ErrorCode = styled(motion.h1)`
  font-size: 10rem;
  font-weight: bold;
  color: var(--color-accent);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 7rem;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  margin: 1rem 0 2rem;
  color: var(--color-text);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Message = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 600px;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HomeButton = styled(motion.div)`
  a {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: var(--color-accent);
    color: var(--color-background);
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--color-accent-alt);
    }
  }
`;

const NotFound = () => {
  const location = useLocation();
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Container>
      <Navigation />
      <ErrorCode
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        404
      </ErrorCode>
      <Title
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Page Not Found
      </Title>
      <Message
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Oops! It seems like you've ventured into uncharted digital territory. 
        The page you're looking for doesn't exist or has been moved.
      </Message>
      <HomeButton
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/">Return to Home</Link>
      </HomeButton>
    </Container>
  );
};

export default NotFound;
