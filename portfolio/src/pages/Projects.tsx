import { useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Navigation from '../components/ui/Navigation';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProjectsProps {
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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background-color: var(--color-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectImage = styled.div<{ imageUrl: string }>`
  height: 200px;
  background-image: ${(props) => `url(${props.imageUrl})`};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%);
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TechTag = styled.span`
  background-color: var(--color-secondary);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-text);
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: var(--color-accent);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-accent-alt);
  }
  
  &:after {
    content: '→';
    margin-left: 0.3rem;
  }
`;

// Project data using objects for i18n support
const getProjects = (t: any) => [
  {
    id: 1,
    title: 'Pile.nvim',
    description: t('projects.pile_description', 'Neovim plugin for managing buffers in a vertical sidebar, similar to how books are stacked in a pile. This plugin provides an intuitive and simple way to browse, rename, and manage open buffers in Neovim.'),
    imageUrl: '/assets/images/project1.jpg',
    techStack: ['Lua', 'Neovim', 'Plugin Development'],
    demoLink: null,
    codeLink: 'https://github.com/shabaraba/pile.nvim',
  },
  {
    id: 2,
    title: 'Look Into Baskets',
    description: t('projects.baskets_description', 'Web application to analyze retail store transactions with Smaregi services integration. Provides insights into transaction data through a web interface with robust backend data processing.'),
    imageUrl: '/assets/images/project2.jpg',
    techStack: ['Python', 'Responder', 'Tortoise ORM', 'MySQL', 'Pug'],
    demoLink: null,
    codeLink: 'https://github.com/shabaraba/look-into-baskets',
  },
  {
    id: 3,
    title: t('projects.portfolio_title', 'Portfolio Website'),
    description: t('projects.portfolio_description', 'This portfolio website featuring Three.js for 3D graphics and animated particles background, with a modern, responsive design and interactive elements.'),
    imageUrl: '/assets/images/project6.jpg',
    techStack: ['TypeScript', 'React', 'Three.js', 'Emotion'],
    demoLink: 'https://shaba.dev',
    codeLink: 'https://github.com/shabaraba/shabaraba',
  }
];

const Projects = ({ isSection = false }: ProjectsProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get projects with translations
  const projects = getProjects(t);
  
  // Scroll to top when page loads (only when not used as a section)
  useEffect(() => {
    if (!isSection) {
      window.scrollTo(0, 0);
    }
  }, [location, isSection]);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <Container isSection={isSection}>
      {!isSection && <Navigation />}
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('projects.title', 'Projects')}
        </Title>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginBottom: '2rem', maxWidth: '800px' }}
        >
          {t('projects.intro', "Here's a selection of personal projects I've developed. These projects showcase my interests in developer tools, data analysis, and web development. Each represents an opportunity for me to explore new technologies and solve problems I've encountered.")}
        </motion.p>
        
        <ProjectsGrid
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              <ProjectImage imageUrl={project.imageUrl} />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TechStack>
                  {project.techStack.map((tech, index) => (
                    <TechTag key={index}>{tech}</TechTag>
                  ))}
                </TechStack>
                <ProjectLinks>
                  {project.demoLink && project.demoLink !== null && (
                    <ProjectLink href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      {t('projects.live_demo', 'Live Demo')}
                    </ProjectLink>
                  )}
                  {project.codeLink && project.codeLink !== null && (
                    <ProjectLink href={project.codeLink} target="_blank" rel="noopener noreferrer">
                      {t('projects.view_code', 'View Code')}
                    </ProjectLink>
                  )}
                </ProjectLinks>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </ContentWrapper>
    </Container>
  );
};

export default Projects;
