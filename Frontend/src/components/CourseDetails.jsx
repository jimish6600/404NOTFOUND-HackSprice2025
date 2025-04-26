import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '75%',
  height: '100vh',
  overflowY: 'auto',
  borderRadius: 0,
  boxShadow: theme.shadows[10],
  zIndex: 1200,
  background: theme.palette.background.paper,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  '& .MuiStepLabel-root .Mui-completed': {
    color: theme.palette.success.main,
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: theme.palette.primary.main,
  },
}));

const TopicContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
  minHeight: '400px',
}));

const CourseDetails = ({ course, onClose }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const mockContent = {
    'Introduction to React': {
      title: 'Introduction to React',
      content: 'React is a JavaScript library for building user interfaces. Learn the fundamentals of React and how to create reusable components.',
      duration: '30 minutes',
      completed: true,
    },
    'Components and Props': {
      title: 'Components and Props',
      content: 'Components are the building blocks of React applications. Learn how to create and use components, and how to pass data using props.',
      duration: '45 minutes',
      completed: true,
    },
    'State and Lifecycle': {
      title: 'State and Lifecycle',
      content: 'Learn how to manage state in React components and understand the component lifecycle methods.',
      duration: '60 minutes',
      completed: false,
    },
    'Hooks and Context': {
      title: 'Hooks and Context',
      content: 'Modern React development using Hooks and Context API for state management.',
      duration: '50 minutes',
      completed: false,
    },
    'Routing and Navigation': {
      title: 'Routing and Navigation',
      content: 'Implement client-side routing in your React applications using React Router.',
      duration: '40 minutes',
      completed: false,
    },
  };

  return (
    <StyledPaper>
      <ContentContainer>
        <Header>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {course.category} • {course.difficulty}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="large">
            <ArrowBackIcon />
          </IconButton>
        </Header>

        <StyledStepper activeStep={activeStep} alternativeLabel>
          {course.topics.map((topic, index) => (
            <Step key={topic.id} completed={mockContent[topic.name]?.completed}>
              <StepLabel>
                {mockContent[topic.name]?.completed && (
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      color: 'success.main',
                    }}
                  />
                )}
                {topic.name}
              </StepLabel>
            </Step>
          ))}
        </StyledStepper>

        <TopicContent>
          <Typography variant="h5" gutterBottom>
            {course.topics[activeStep]?.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {mockContent[course.topics[activeStep]?.name]?.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Duration: {mockContent[course.topics[activeStep]?.name]?.duration}
          </Typography>
        </TopicContent>

        <NavigationContainer>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === course.topics.length - 1}
            endIcon={<ArrowForwardIcon />}
          >
            Next
          </Button>
        </NavigationContainer>
      </ContentContainer>
    </StyledPaper>
  );
};

export default CourseDetails; 