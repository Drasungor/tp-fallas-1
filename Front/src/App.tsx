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
import {IAnswer, postAnswer} from "./services/apicalls";

type Props = {
  answer: IAnswer,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: Level
}

function QuestionForm({answer, handleChange, value}: Props) {
  // TODO: ver si con answer puedo setear el valor del radio button
  // de manera de que al volver para atras quede la ultima seleccion
  return (
    <Fragment>
      <Container component="main" maxWidth="sm" sx={{mb: 4}}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
          <Typography component="h1" variant="h4" align="center">
            Determinar tipo de Medida de Prevención - Paso {answer.questionId}
          </Typography>
          <Fragment>
            <Typography variant="h6" gutterBottom>
              {answer.questionText}
            </Typography>
            <Grid container spacing={3}>
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
          </Fragment>
        </Paper>
      </Container>
    </Fragment>

  )
}

enum Level {
  BAJO,
  ALTO
}

type LevelStrings = keyof typeof Level;

const QUESTIONS : IAnswer[] = [
  {
    questionId: "0",
    questionText: "Empezar",
    answer: null
  },
  {
    questionId: "C1",
    questionText: "¿Requiere que la medida sea viable con bajo presupuesto?",
    answer: null
  }, {
    questionId: "C2",
    questionText: "¿Sus aves tienen una alta exposición ante aves silvestres?",
    answer: null
  }, {
    questionId: "C3",
    questionText: "¿Sus aves tienen un alto grado de interacción con humanos?",
    answer: null
  } ,
  {
    questionId: "C4",
    questionText: "¿Tiene una gran cantidad de aves (por ej. mas de 100)?",
    answer: null
  },
  {
    questionId: "C5",
    questionText: "¿Tiene una gran cantidad de personal (por ej. mas de 10)?",
    answer: null
  }

]

const ANSWERS = new Map<string, string>()
ANSWERS.set("E1", "Confinamiento avícola")
ANSWERS.set("E2", "Evitar visitar otras granjas")
ANSWERS.set("E3", "Indumentaria de bioseguridad")
ANSWERS.set("E4", "Disponer alimentos en lugares solo accesibles por las aves")
ANSWERS.set("E5", "Elementos de disipación de aves silvestres")
ANSWERS.set("E6", "Higiene intensificada")
ANSWERS.set("E7", "Monitoreo diario del estado de salud avícola")


const INIT_QUESTIONS: IAnswer[] = [QUESTIONS[0]]

function App() {
  const [answers, setAnswers] = useState<IAnswer[]>(INIT_QUESTIONS)
  // TODO: reemplazar value por una variable pq no se renderiza su valor
  // alternativa: manejarlo a partir del answer (si es null nada, si es true ALTO, si es false BAJO)
  const [value, setValue] = useState<Level>(Level.BAJO)
  const [answerId, setAnswerId] = useState<string>("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value
    const level = Level[input as LevelStrings]
    setValue(level)
  }

  const handleNext = () => {
    if(answers.length === 1) {
      setAnswers(oldAnswers => [...oldAnswers, QUESTIONS[answers.length]])
      return
    }
    if (answers.length > 1) {
      // envio la respuesta
      const isYes = (value === Level.ALTO)
      const newAnswer = {...answers[answers.length - 1], answer: isYes}
      setAnswers(oldAnswers => {oldAnswers[answers.length - 1] = newAnswer; return oldAnswers})
      postAnswer(answers).then(response => {
        if (response.data === null) {
          return response.statusCode
        }
        if ("answerId" in response) {
          console.log("answerId", response.answerId)
          setAnswerId(response.answerId)
          setAnswers(oldAnswers => [...oldAnswers, QUESTIONS[answers.length]])
        } else if ("questionId" in response) {
          console.log("questionId", response.questionId)
          // paso a la siguiente pregunta
          setAnswers(oldAnswers => [...oldAnswers, QUESTIONS[answers.length]])
        }

      })

    }

  }

  const handleBack = () => {
    setAnswers(oldAnswers => {
      const newAnswers = [...oldAnswers]
      newAnswers.pop()
      return newAnswers
    })
    setAnswerId("")
  }

  const handleReset = () => {
    setAnswers(INIT_QUESTIONS)
    setAnswerId("")
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
          {answers.length === 1 &&
            <CardHeader title={"Medida de prevención de influenza aviar"}
                        subheader={"A continuación deberá completar una seríe de preguntas respecto a las características de su negocio " +
                          "y a partir de esto se podra determinar la medida de prevención contra la influenza aviar más adecuada para usted"}
            />}
          {answers.length > 1 && answerId === "" &&<QuestionForm answer={answers[answers.length - 1]} handleChange={handleChange} value={value}/>}
          {answerId !== "" && <CardHeader title={"Medida de prevención a utilizar"}
                                    subheader={ANSWERS.get(answerId)}
          />
          }

          <CardContent>
            <Box sx={{display: 'flex', justifyContent: "center"}}>
              {answers.length > 1 && <Button variant={'contained'} onClick={handleBack}> {"Atras"} </Button>}
              {answerId === "" && <Button variant={'contained'}
                       onClick={handleNext}> {answers.length === 1 ? "Empezar" : "Siguiente"} </Button>}
              {answers.length > 1 &&  <Button variant={'contained'} onClick={handleReset}> {"Reiniciar"} </Button>}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default App;
