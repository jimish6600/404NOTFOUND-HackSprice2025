import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CourseCard from '../components/CourseCard';
import CourseCreationModal from '../components/CourseCreationModal';
import AddIcon from '@mui/icons-material/Add';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  minHeight: '100vh',
  background: theme.palette.background.default,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(6),
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const AddButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1.1rem',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  letterSpacing: '0.5px',
}));

const MyCourse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      progress: 75,
      category: 'React',
      lastAccessed: '2 days ago',
      difficulty: 'Beginner',
      topics: [
        { id: 1, name: 'Introduction to React' },
        { id: 2, name: 'Components and Props' },
        { id: 3, name: 'State and Lifecycle' },
        { id: 4, name: 'Hooks and Context' },
        { id: 5, name: 'Routing and Navigation' },
      ],
    },
    {
      id: 2,
      title: 'Spring Boot Basics',
      progress: 30,
      category: 'Spring Boot',
      lastAccessed: '1 week ago',
      difficulty: 'Intermediate',
      topics: [
        { id: 1, name: 'Introduction to Spring Boot' },
        { id: 2, name: 'Spring Boot Configuration' },
        { id: 3, name: 'Spring Data JPA' },
        { id: 4, name: 'RESTful Web Services' },
        { id: 5, name: 'Spring Security' },
      ],
    },
  ]);

  const handleCreateCourse = (courseData) => {
    const newCourse = {
      id: courses.length + 1,
      title: `${courseData.subject} - ${courseData.difficulty}`,
      progress: 0,
      category: courseData.subject,
      lastAccessed: 'Just now',
      difficulty: courseData.difficulty,
      topics: courseData.topics,
    };
    setCourses([...courses, newCourse]);
  };

  return (
    <StyledContainer maxWidth="xl">
      <Header>
        <PageTitle variant="h1">
          My Courses
        </PageTitle>
        <AddButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Course
        </AddButton>
      </Header>

      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <CourseCard
              title={course.title}
              progress={course.progress}
              category={course.category}
              lastAccessed={course.lastAccessed}
              difficulty={course.difficulty}
              topics={course.topics}
            />
          </Grid>
        ))}
      </Grid>

      <CourseCreationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    </StyledContainer>
  );
};

export default MyCourse;