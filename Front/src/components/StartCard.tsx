import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  CardMedia
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type Props = {
  handleStart: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function StartCard ({handleStart}: Props) {
  return (
    <Card sx={{ width: '500pt', minHeight: 500 }} variant="outlined">
      <CardMedia
          component="img"
          alt="aves"
          height="300"
          image="https://i0.wp.com/www.corpmontana.com/blog/wp-content/uploads/2022/12/gripe-aviar-scaled.jpg?resize=1280%2C640&ssl=1"
        />
      <CardHeader 
        titleTypographyProps={{ align: 'center' }}
        title={"Medida de prevención de influenza aviar"}
      />
      <CardContent style={{ textAlign: 'center' }}>
        A continuación deberá completar una seríe de preguntas respecto a las características de su negocio 
        y a partir de esto se podra determinar la medida de prevención contra la influenza aviar más adecuada para usted.
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button size="large" variant="outlined" endIcon={<PlayArrowIcon />} onClick={handleStart}> Empezar </Button>
      </CardActions>
    </Card>
  );
}

export default StartCard;