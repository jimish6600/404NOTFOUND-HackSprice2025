import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../redux/slices/courseSlice';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    minWidth: '600px',
    maxWidth: '800px',
    borderRadius: '16px',
    padding: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 600,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.primary.main,
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: '1.1rem',
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputLabel-root': {
    fontSize: '1.1rem',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1.1rem',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  margin: theme.spacing(0, 1),
}));

const TopicBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    background: theme.palette.action.hover,
  },
}));

const steps = ['Select Subject', 'Choose Difficulty', 'Select Topics'];

// const subjects = [
//   { value: 'react', label: 'React' },
//   { value: 'springboot', label: 'Spring Boot' },
//   { value: 'nodejs', label: 'Node.js' },
//   { value: 'python', label: 'Python' },
// ];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const CourseCreationModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: courses, loading: coursesLoading } = useSelector((state) => state.course.getAllCourses);
  const { data: subtopics, loading: subtopicsLoading } = useSelector((state) => state.course.getSubTopicsForCourse);
  
  console.log(courses,"32");
  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const handleNext = async () => {
    if (activeStep === 1) {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockTopics = [
          { id: 1, name: 'Introduction to React' },
          { id: 2, name: 'Components and Props' },
          { id: 3, name: 'State and Lifecycle' },
          { id: 4, name: 'Hooks and Context' },
          { id: 5, name: 'Routing and Navigation' },
        ];
        setTopics(mockTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    onSubmit({
      subject: selectedSubject,
      difficulty: selectedDifficulty,
      topics: topics,
    });
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4, px: 4 }}>
            <StyledTextField
              select
              fullWidth
              label="Select Subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              variant="outlined"
              size="medium"
            >
              {courses.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </StyledTextField>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4, px: 4 }}>
            <StyledTextField
              select
              fullWidth
              label="Choose Difficulty Level"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              variant="outlined"
              size="medium"
            >
              {difficultyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4, px: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Available Topics:
                </Typography>
                {topics.map((topic) => (
                  <TopicBox key={topic.id}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      {topic.name}
                    </Typography>
                  </TopicBox>
                ))}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>Create New Course</StyledDialogTitle>
      <DialogContent>
        <StyledStepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(3) }}>
        <StyledButton onClick={onClose}>Cancel</StyledButton>
        <StyledButton onClick={handleBack} disabled={activeStep === 0}>
          Back
        </StyledButton>
        <StyledButton
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          variant="contained"
          color="primary"
        >
          {activeStep === steps.length - 1 ? 'Create Course' : 'Next'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CourseCreationModal; 