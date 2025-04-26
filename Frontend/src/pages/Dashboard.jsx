import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import CourseCard from '../components/CourseCard';
import QuizScore from '../components/QuizScore';
// import AnalyticsCard from '../components/AnalyticsCard';

// Mock data - Replace with actual data from your backend
const mockCourses = [
  { id: 1, title: 'Introduction to Programming', progress: 75, category: 'Programming', lastAccessed: '2 days ago' },
  { id: 2, title: 'Data Structures', progress: 60, category: 'Computer Science', lastAccessed: '1 week ago' },
  { id: 3, title: 'Web Development', progress: 90, category: 'Web', lastAccessed: '3 days ago' },
  { id: 4, title: 'Database Management', progress: 45, category: 'Database', lastAccessed: '5 days ago' },
  { id: 5, title: 'Machine Learning', progress: 30, category: 'AI', lastAccessed: '1 day ago' },
];

const mockQuizScores = [
  { id: 1, title: 'Programming Basics Quiz', score: 8, totalQuestions: 10, date: '2024-04-25' },
  { id: 2, title: 'Data Structures Quiz', score: 7, totalQuestions: 10, date: '2024-04-24' },
];

const mockAnalytics = {
  averageScore: 85,
  completedQuizzes: 12,
  feedbackRating: 4.5,
};

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Analytics Section */}
      <Box mb={4}>
        {/* <AnalyticsCard metrics={mockAnalytics} /> */}
      </Box>

      <Grid container spacing={4}>
        {/* Latest Courses Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Latest Courses
          </Typography>
          <Grid container spacing={2}>
            {mockCourses.map((course) => (
              <Grid item xs={12} sm={6} key={course.id}>
                <CourseCard {...course} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Quiz Scores Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Recent Quiz Scores
          </Typography>
          <Grid container spacing={2}>
            {mockQuizScores.map((quiz) => (
              <Grid item xs={12} key={quiz.id}>
                <QuizScore {...quiz} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
