import {
  Button,
  Card, CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  FormControl, FormControlLabel,
  Grid,
  Paper, Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import React, {Fragment} from "react";
import {IAnswer} from "../services/apicalls";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import RestartAlt from "@mui/icons-material/RestartAlt";

type Props = {
  answer: IAnswer,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleBack: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  handleNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  handleReset: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  disableNext: boolean
  imageUrl: string
}


function QuestionForm({answer, handleChange, handleBack, handleNext, handleReset, disableNext, imageUrl}: Props) {
  // TODO: ver si con answer puedo setear el valor del radio button
  // de manera de que al volver para atras quede la ultima seleccion
  return (
    <React.Fragment>

      <CardMedia
        component="img"
        alt="aves"
        height="300"
        image={imageUrl}
        style={{ objectFit: 'cover', objectPosition: 'top' }}
      />
      <CardHeader
        titleTypographyProps={{ align: 'center'}}
        title={`Pregunta ${answer.questionId}`}
      />
      <CardContent>
        <Container component="main" maxWidth="sm" sx={{mb: 4}}>
          <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
            {answer.questionText}
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="controlled-radio-buttons-group"
                  onChange={handleChange}
                >
                  <FormControlLabel value="ALTO" control={<Radio/>} label="Si"/>
                  <FormControlLabel value="BAJO" control={<Radio/>} label="No"/>
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="error" onClick={handleReset} endIcon={<RestartAlt />}> Reiniciar </Button>
        <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack/>}> Atras </Button>
        <Button variant="outlined" endIcon={<ArrowForward />} disabled={disableNext} onClick={handleNext}> Siguiente </Button>
      </CardActions>
    </React.Fragment>
  )
}

export default QuestionForm
