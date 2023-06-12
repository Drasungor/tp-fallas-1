import React, {Fragment, useState} from 'react';
import './App.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";

type Props = {
  step: IStep
}

interface IStep {
  id: string
  textoPregunta: string,
  respuesta: string
}

function StepForm({step}: Props) {
  const [value, setValue] = useState("medio")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return (
    <Fragment>
      <Container component="main" maxWidth="sm" sx={{mb: 4}}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
          <Typography component="h1" variant="h4" align="center">
            Determinar tipo de Medida de Prevención - Paso {step.id}
          </Typography>
          <Fragment>
            <Typography variant="h6" gutterBottom>
              {step.textoPregunta}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Nivel</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="alto" control={<Radio/>} label="Alto"/>
                    <FormControlLabel value="medio" control={<Radio/>} label="Medio"/>
                    <FormControlLabel value="bajo" control={<Radio/>} label="Bajo"/>
                  </RadioGroup>
                </FormControl>

              </Grid>
            </Grid>
          </Fragment>
        </Paper>
      </Container>
    </Fragment>

  )
}

const initSteps: IStep[] = [{id: "0", textoPregunta: "Empezar", respuesta: ""}, {
  id: "1",
  textoPregunta: "Ingresar tipo presupuesto",
  respuesta: ""
}]

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<IStep[]>(initSteps)

  const handleNext = () => {
    setActiveStep(oldActiveStep => ((oldActiveStep + 1) < steps.length) ? (oldActiveStep + 1) : oldActiveStep)
  }

  const handleBack = () => {
    setActiveStep(oldActiveStep => ((oldActiveStep - 1) >= 0) ? (oldActiveStep - 1) : oldActiveStep)
  }

  const handleReset = () => {
    setSteps(initSteps)
    setActiveStep(0)
  }

  return (
    <Grid container>
      <Box component={Grid}
           item xs={12}
           height={500}
           sx={{opacity: 0.7, zIndex: 0, background: 'url(/images/fondo.jpg) center top / cover transparent'}}
      />
      <Grid item xs={12} container pr={2} pl={2} justifyContent={'center'} mt={-50} zIndex={1}>
        <Typography
          mb={5}
          sx={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#FFFFFF'
          }}
        >Prevención Influenza Aviar</Typography>

        <Card sx={{width: '90%', minHeight: 500}}>
          {activeStep === 0 ? (
            <CardHeader title={"Medida de prevención de influenza aviar"}
                        subheader={"A continuación deberá completar una seríe de preguntas respecto a las características de su negocio " +
                          "y a partir de esto se podra determinar la medida de prevención contra la influenza aviar más adecuada para usted"}
            />) : (
            <StepForm step={steps[activeStep]}/>
          )}

          <CardContent>
            <Box sx={{display: 'flex', justifyContent: "center"}}>
              <Button variant={'contained'} onClick={handleBack}> {"Atras"} </Button>
              <Button variant={'contained'} onClick={handleNext}> {activeStep === 0 ? "Empezar" : "Siguiente"} </Button>
              <Button variant={'contained'} onClick={handleReset}> {"Reiniciar"} </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default App;
