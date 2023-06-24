import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  CardMedia
} from "@mui/material";
import RestartAlt from '@mui/icons-material/RestartAlt';

type Props = {
  handleReset: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  answer?: string
}

function SolutionCard ({handleReset, answer}: Props) {
  return (
    <Card sx={{ width: '500pt', minHeight: 500 }} variant="outlined">
      <CardMedia
          component="img"
          alt="aves"
          height="300"
          image="https://www.fincacasarejo.com/Docs/Noticias/madre.jpg"
        />
      <CardHeader
        titleTypographyProps={{ align: 'center' }}
        title={"Medida de prevención a utilizar"}
      />
      <CardContent style={{ textAlign: 'center' }}>
        {answer}
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button size="large" variant="outlined" endIcon={<RestartAlt/>} onClick={handleReset}> Reiniciar </Button>
      </CardActions>
    </Card>
  );
}

export default SolutionCard;
