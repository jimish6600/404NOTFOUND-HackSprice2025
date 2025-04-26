import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProgressBar = styled(Box)(({ theme, progress }) => ({
  height: '4px',
  background: theme.palette.grey[200],
  borderRadius: '2px',
  marginTop: theme.spacing(1),
  '&::after': {
    content: '""',
    display: 'block',
    height: '100%',
    width: `${progress}%`,
    background: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const CourseCard = ({ id, title, progress, category, lastAccessed, topics, difficulty }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Convert title to URL-friendly format
    const courseId = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/course/${courseId}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h2" noWrap>
            {title}
          </Typography>
          <Chip label={category} size="small" color="primary" />
        </Box>
        <Box mt={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <IconButton size="small" sx={{ ml: 'auto' }}>
              <PlayCircleOutlineIcon />
            </IconButton>
          </Box>
          <ProgressBar progress={progress} />
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Last accessed: {lastAccessed}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard; 