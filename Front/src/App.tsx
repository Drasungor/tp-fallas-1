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
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  styled,
} from "@mui/material";
import {IAnswer, postAnswer} from "./services/apicalls";

type Props = {
  answer: IAnswer,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function QuestionForm({answer, handleChange}: Props) {
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

const QUESTIONS: IAnswer[] = [
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
  },
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
ANSWERS.set("E1", "E1 - Confinamiento avícola")
ANSWERS.set("E2", "E2 - Evitar visitar otras granjas")
ANSWERS.set("E3", "E3 - Indumentaria de bioseguridad")
ANSWERS.set("E4", "E4 - Disponer alimentos en lugares solo accesibles por las aves")
ANSWERS.set("E5", "E5 - Elementos de disipación de aves silvestres")
ANSWERS.set("E6", "E6 - Higiene intensificada")
ANSWERS.set("E7", "E7 - Monitoreo diario del estado de salud avícola")

const INIT_QUESTIONS: IAnswer[] = [QUESTIONS[0]]

function App() {
  const [answers, setAnswers] = useState<IAnswer[]>(INIT_QUESTIONS)
  const [value, setValue] = useState<Level | null>(null)
  const [answerId, setAnswerId] = useState<string>("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value
    const level = Level[input as LevelStrings]
    setValue(level)
  }

  function nextQuestion() {
    setAnswers(oldAnswers => [...oldAnswers, QUESTIONS[answers.length]])
  }

  const handleStart = () => {
    nextQuestion();
  }

  const handleNext = () => {
    if (answers.length === 1) {
      return
    }
    if (answers.length > 1) {
      // envio la respuesta
      const isYes = (value === Level.ALTO)
      const newAnswer = {...answers[answers.length - 1], answer: isYes}
      setAnswers(oldAnswers => {
        oldAnswers[answers.length - 1] = newAnswer;
        return oldAnswers
      })
      postAnswer(answers).then(response => {
        if (response.data === null) {
          return response.statusCode
        }
        if ("answerId" in response) {
          // tengo la respuesta
          setAnswerId(response.answerId)
          nextQuestion();
        } else if ("questionId" in response) {
          // paso a la siguiente pregunta
          nextQuestion();
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
    setValue(null)
  }

  const styles = {
    box: { opacity: 0.7, zIndex: 0, background: 'url(/images/fondo.jpg) center top / cover transparent'},
    typography: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#FFFFFF'
    }
  };

  return (
    <Box 
      sx={{
        background: 'url(/images/fondo.jpg) center top / cover transparent',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        minHeight: '100vh'
      }}
    >
      <CenteredContainer>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography
              variant="h4"
              mb={5}
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              Prevención Influenza Aviar
            </Typography>
          </Grid>
          <Grid item>
            <Card sx={{ width: '500pt', minHeight: 500 }} variant="outlined">
              {answers.length === 1 &&
                <CardHeader title={"Medida de prevención de influenza aviar"}
                            subheader={"A continuación deberá completar una seríe de preguntas respecto a las características de su negocio " +
                              "y a partir de esto se podra determinar la medida de prevención contra la influenza aviar más adecuada para usted"}
                />}
              {answers.length > 1 && answerId === "" &&
                <QuestionForm answer={answers[answers.length - 1]} handleChange={handleChange}/>}
              {answerId !== "" && <CardHeader title={"Medida de prevención a utilizar"}
                                              subheader={answerId !== null ? ANSWERS.get(answerId) : "No se pudo encontrar una medida de prevención que se adecúe a las condiciones dadas"}
              />
              }
              <CardContent>
                <Box sx={{display: 'flex', justifyContent: "center"}}>
                  {answers.length > 1 && <Button onClick={handleBack}> {"Atras"} </Button>}
                  {answers.length === 1 && <Button onClick={handleStart}> Empezar </Button>}
                  {answerId === "" && answers.length > 1 && <Button disabled={value === null} onClick={handleNext}> Siguiente </Button>}
                  {answers.length > 1 && <Button onClick={handleReset}> Reiniciar </Button>}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CenteredContainer>
    </Box>
  )
}

const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default App;
