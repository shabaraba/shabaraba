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

// Project data
const projects = [
  {
    id: 1,
    title: 'API Client Auto-Generator',
    description: 'Automated solution for generating API clients, reducing development time and maintenance costs. Identified high API client maintenance costs and proposed this solution that was adopted in the product roadmap.',
    imageUrl: '/assets/images/project1.jpg',
    techStack: ['TypeScript', 'Java', 'OpenAPI', 'SpringBoot'],
    demoLink: '#',
    codeLink: '#',
  },
  {
    id: 2,
    title: 'Transaction System Refactoring',
    description: 'Comprehensive refactoring of a large-scale POS transaction system. Improved code structure with appropriate class design and introduced a tree structure for transaction processing.',
    imageUrl: '/assets/images/project2.jpg',
    techStack: ['PHP', 'JavaScript', 'MySQL', 'jQuery'],
    demoLink: '#',
    codeLink: '#',
  },
  {
    id: 3,
    title: 'Test Automation Framework',
    description: 'Automated test framework for industrial robot software that reduced evaluation workload by approximately 30%. Independently developed using VBS and UWSC for custom scripts.',
    imageUrl: '/assets/images/project3.jpg',
    techStack: ['VBS', 'UWSC', 'Testing', 'Automation'],
    demoLink: '#',
    codeLink: '#',
  },
  {
    id: 4,
    title: 'Progress Tracking System',
    description: 'Automated project progress tracking system using Redmine and Excel VBA. Developed to address visibility issues in project management and later adopted as a team standard.',
    imageUrl: '/assets/images/project4.jpg',
    techStack: ['VBA', 'Excel', 'Redmine', 'Project Management'],
    demoLink: '#',
    codeLink: '#',
  },
  {
    id: 5,
    title: 'Dynamic Advertisement Management',
    description: 'System to control advertisement content from the database instead of hardcoding, significantly reducing developer workload for content updates.',
    imageUrl: '/assets/images/project5.jpg',
    techStack: ['PHP', 'MySQL', 'JavaScript', 'Web Development'],
    demoLink: '#',
    codeLink: '#',
  },
  {
    id: 6,
    title: 'Three.js Portfolio',
    description: 'This portfolio website featuring Three.js for 3D graphics and animations, with a modern, responsive design and interactive elements.',
    imageUrl: '/assets/images/project6.jpg',
    techStack: ['TypeScript', 'React', 'Three.js', 'Emotion'],
    demoLink: '#',
    codeLink: '#',
  }
];

const Projects = () => {
  const location = useLocation();
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
    <Container>
      <Navigation />
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </Title>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginBottom: '2rem', maxWidth: '800px' }}
        >
          Here's a selection of projects I've worked on throughout my career. Each project 
          represents a unique challenge that I've approached with my focus on efficiency 
          optimization and quality enhancement.
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
                  {project.demoLink && (
                    <ProjectLink href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </ProjectLink>
                  )}
                  {project.codeLink && (
                    <ProjectLink href={project.codeLink} target="_blank" rel="noopener noreferrer">
                      View Code
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
