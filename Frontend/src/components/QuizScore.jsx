import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const ScoreCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
}));

const QuizScore = ({ title, score, totalQuestions, date }) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <ScoreCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h3" component="div" sx={{ mr: 2 }}>
            {score}/{totalQuestions}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                },
              }}
            />
          </Box>
        </Box>
        <Typography variant="body2">
          Completed on: {date}
        </Typography>
      </CardContent>
    </ScoreCard>
  );
};

export default QuizScore; 