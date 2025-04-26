import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const CourseCard = ({ title, progress, category, lastAccessed }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h2" noWrap>
            {title}
          </Typography>
          <Chip label={category} size="small" color="primary" />
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Progress: {progress}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last accessed: {lastAccessed}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard; 