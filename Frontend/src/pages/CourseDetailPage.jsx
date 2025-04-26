import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  useTheme,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Fade,
  Tabs,
  Tab,
  Collapse,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TerminalIcon from '@mui/icons-material/Terminal';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  minHeight: '100vh',
  background: theme.palette.background.default,
  maxWidth: '1200px',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const ContentSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  minHeight: '500px',
}));

const CodeDemo = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.grey[900],
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(3, 0),
  fontFamily: 'monospace',
  overflowX: 'auto',
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

const ResourceCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.background.default,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const ContentTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  lineHeight: 1.8,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

const mockCourses = {
  'react-fundamentals': {
    id: 1,
    title: 'React Fundamentals',
    progress: 75,
    category: 'React',
    difficulty: 'Beginner',
    lastAccessed: '2 days ago',
    // instructor: {
    //   name: 'John Doe',
    //   avatar: 'https://i.pravatar.cc/150?img=1',
    //   expertise: 'Senior React Developer',
    // },
    topics: [
      {
        id: 1,
        name: 'Introduction to React',
        content: 'React is a JavaScript library for building user interfaces. Learn the fundamentals of React and how to create reusable components. React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
        duration: '30 minutes',
        completed: true,
        videoUrl: 'https://example.com/video1',
        codeDemo: `import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

export default App;`,
        resources: [
          { 
            title: 'React Documentation', 
            url: 'https://reactjs.org/docs',
            type: 'documentation',
            icon: <DescriptionIcon color="primary" />,
          },
          { 
            title: 'Getting Started Guide', 
            url: 'https://reactjs.org/docs/getting-started.html',
            type: 'guide',
            icon: <CodeIcon color="primary" />,
          },
        ],
        quiz: {
          questions: 5,
          completed: true,
        },
        assignment: {
          title: 'Create Your First React Component',
          dueDate: '2024-03-20',
          completed: true,
        },
      },
      {
        id: 2,
        name: 'Components and Props',
        content: 'Components are the building blocks of React applications. Learn how to create and use components, and how to pass data using props. Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. This page provides an introduction to the idea of components.',
        duration: '45 minutes',
        completed: true,
        videoUrl: 'https://example.com/video2',
        codeDemo: `import React from 'react';

function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);`,
        resources: [
          { 
            title: 'Components and Props Guide', 
            url: 'https://reactjs.org/docs/components-and-props.html',
            type: 'guide',
            icon: <CodeIcon color="primary" />,
          },
        ],
        quiz: {
          questions: 8,
          completed: true,
        },
        assignment: {
          title: 'Build a Clock Component',
          dueDate: '2024-03-22',
          completed: true,
        },
      },
      {
        id: 3,
        name: 'State and Lifecycle',
        content: 'Learn how to manage state in React components and understand the component lifecycle methods. State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.',
        duration: '60 minutes',
        completed: false,
        videoUrl: 'https://example.com/video3',
        codeDemo: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`,
        resources: [
          { 
            title: 'State and Lifecycle Guide', 
            url: 'https://reactjs.org/docs/state-and-lifecycle.html',
            type: 'guide',
            icon: <CodeIcon color="primary" />,
          },
        ],
        quiz: {
          questions: 10,
          completed: false,
        },
        assignment: {
          title: 'Implement State Management',
          dueDate: '2024-03-25',
          completed: false,
        },
      },
    ],
  },
};

const CourseDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [expandedDemo, setExpandedDemo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const course = mockCourses[courseId];
  const currentTopic = course?.topics[activeStep];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!course) {
    return (
      <StyledContainer>
        <Typography variant="h4">Course not found</Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Header>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={() => navigate('/my-courses')}
            sx={{ 
              background: theme.palette.background.default,
              '&:hover': { background: theme.palette.action.hover }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
              {course.title}
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <Chip 
                label={course.category} 
                color="primary" 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                label={course.difficulty} 
                variant="outlined" 
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Bookmark">
              <IconButton>
                <BookmarkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <ProgressSection>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Course Progress
            </Typography>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${course.progress}% Complete`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={course.progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }} 
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {course.topics.filter(t => t.completed).length} of {course.topics.length} topics completed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last accessed: {course.lastAccessed}
            </Typography>
          </Box>
        </ProgressSection>

        <Box display="flex" alignItems="center" gap={2}>
          {/* <Avatar src={course.instructor.avatar} /> */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {/* {course.instructor.name} */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* {course.instructor.expertise} */}
            </Typography>
          </Box>
        </Box>
      </Header>
      <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 4,
              position: 'sticky',
              top: theme.spacing(4),
              boxShadow: theme.shadows[1],
              background: theme.palette.background.paper,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              orientation="horizontal"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<TerminalIcon />} 
                label="Topics" 
                sx={{ alignItems: 'flex-start' }}
              />
              <Tab 
                icon={<QuizIcon />} 
                label="Quizzes" 
                sx={{ alignItems: 'flex-start' }}
              />
              <Tab 
                icon={<AssignmentIcon />} 
                label="Assignments" 
                sx={{ alignItems: 'flex-start' }}
              />
            </Tabs>

            {activeTab === 0 && (
              <Box mt={2}>
                <StyledStepper activeStep={activeStep} orientation="vertical">
                  {course.topics.map((topic, index) => (
                    <Step key={topic.id} completed={topic.completed}>
                      <StepLabel>
                        {topic.completed && (
                          <CheckCircleIcon
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              color: 'success.main',
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {topic.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topic.duration}
                          </Typography>
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </StyledStepper>
              </Box>
            )}

            {activeTab === 1 && (
              <List sx={{ padding: 0 ,display: 'flex', flexDirection: 'row', gap: 2 }}>
                {course.topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Badge
                        color={topic.quiz.completed ? "success" : "default"}
                        badgeContent={topic.quiz.completed ? "✓" : "0"}
                      >
                        <QuizIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={topic.name}
                      secondary={`${topic.quiz.questions} questions`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {activeTab === 2 && (
              <List>
                {course.topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Badge
                        color={topic.assignment.completed ? "success" : "default"}
                        badgeContent={topic.assignment.completed ? "✓" : "!"}
                      >
                        <AssignmentIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={topic.assignment.title}
                      secondary={`Due: ${topic.assignment.dueDate}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ContentSection>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <PlayCircleOutlineIcon color="primary" fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                {currentTopic.name}
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />
            
            <Box mb={6}>
              <ContentTypography>
                {currentTopic.content}
              </ContentTypography>
              <Box display="flex" alignItems="center" gap={1} mt={3}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Duration: {currentTopic.duration}
                </Typography>
              </Box>
            </Box>

            <Box mb={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Code Demo
                </Typography>
                <IconButton onClick={() => setExpandedDemo(!expandedDemo)}>
                  {expandedDemo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={expandedDemo}>
                <CodeDemo>
                  <pre style={{ margin: 0 }}>{currentTopic.codeDemo}</pre>
                </CodeDemo>
              </Collapse>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Resources
              </Typography>
              {currentTopic.resources.map((resource, index) => (
                <Fade in timeout={500} key={index}>
                  <ResourceCard>
                    <Box display="flex" alignItems="center" gap={3} flex={1}>
                      {resource.icon}
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {resource.title}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<DownloadIcon />}
                      sx={{ 
                        px: 3,
                        py: 1,
                        fontWeight: 500,
                      }}
                    >
                      Download
                    </Button>
                  </ResourceCard>
                </Fade>
              ))}
            </Box>
          </ContentSection>
        </Grid>
      </Grid>

      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          mt: 4,
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Previous Topic
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === course.topics.length - 1}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Next Topic
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default CourseDetailPage; 