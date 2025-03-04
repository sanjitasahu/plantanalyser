import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
} from '@mui/material';
import {
  Opacity as WaterIcon,
  WbSunny as SunIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Plant } from '../../types';

interface PlantCardProps {
  plant: Plant;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onDelete, showActions = true }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(plant.id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3,
        },
      }}
    >
      <CardActionArea component={Link} to={`/plants/${plant.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="140"
          image={plant.imageUrl || '/placeholder-plant.jpg'}
          alt={plant.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {plant.name}
          </Typography>
          
          {plant.species && (
            <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
              {plant.species}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {plant.wateringFrequency && (
              <Chip 
                icon={<WaterIcon fontSize="small" />} 
                label={`Water: ${plant.wateringFrequency}`} 
                size="small" 
                variant="outlined"
                color="primary"
              />
            )}
            
            {plant.sunlightNeeds && (
              <Chip 
                icon={<SunIcon fontSize="small" />} 
                label={`Light: ${plant.sunlightNeeds}`} 
                size="small" 
                variant="outlined"
                color="warning"
              />
            )}
          </Box>
          
          {plant.healthStatus && (
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={plant.healthStatus} 
                size="small"
                color={
                  plant.healthStatus === 'Healthy' ? 'success' :
                  plant.healthStatus === 'Needs attention' ? 'warning' : 'error'
                }
              />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      
      {showActions && (
        <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
          <IconButton 
            component={Link} 
            to={`/plants/${plant.id}/edit`} 
            size="small" 
            color="primary"
            onClick={(e) => e.stopPropagation()}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          
          {onDelete && (
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default PlantCard; 