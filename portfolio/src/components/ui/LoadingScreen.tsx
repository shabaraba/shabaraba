import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Container = styled.div<{ isLoading: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${props => props.isLoading ? fadeIn : fadeOut} 0.5s ease-in-out forwards;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-accent);
  margin-bottom: 2rem;
  letter-spacing: 2px;
  animation: ${pulse} 2s infinite;
`;

const ProgressContainer = styled.div`
  width: 200px;
  height: 4px;
  background-color: var(--color-secondary);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: var(--color-accent);
  transition: width 0.3s ease-in-out;
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
`;

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Set a timeout before hiding the loading screen
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <Container isLoading={isLoading}>
      <Logo>{'<SB/>'}</Logo>
      <ProgressContainer>
        <ProgressBar progress={progress} />
      </ProgressContainer>
      <LoadingText>
        {progress < 100 ? 'Loading...' : 'Ready!'}
      </LoadingText>
    </Container>
  );
};

export default LoadingScreen;
