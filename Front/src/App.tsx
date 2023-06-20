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
  CardActions,
  CardMedia
} from "@mui/material";
import {IAnswer, postAnswer} from "./services/apicalls";
import StartCard from './components/StartCard';
import SolutionCard from './components/SolutionCard';

type Props = {
  answer: IAnswer,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleBack: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  handleNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  handleReset: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  disableNext: boolean
}

function QuestionForm({answer, handleChange, handleBack, handleNext, handleReset, disableNext}: Props) {
  // TODO: ver si con answer puedo setear el valor del radio button
  // de manera de que al volver para atras quede la ultima seleccion
  return (
    <Card sx={{ width: '500pt', minHeight: 500 }} variant="outlined">
      <CardHeader 
        title={`Determinar tipo de Medida de Prevención \n Paso ${answer.questionId}`}
        titleTypographyProps={{ align: 'center' }}
      />
      <CardMedia
          component="img"
          alt="aves"
          height="200"
          image="https://www.ospat.com.ar/wp-content/uploads/2023/04/pollo-blanco-granja.jpg"
          style={{ objectFit: 'cover', objectPosition: 'top' }}
        />
      <CardContent>
        <Fragment>
          <Container component="main" maxWidth="sm" sx={{mb: 4}}>
            <Paper sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
              <Fragment>
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
              </Fragment>
            </Paper>
          </Container>
        </Fragment>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button color="error" onClick={handleReset}> Reiniciar </Button>
        <Button onClick={handleBack}> Atras </Button>
        <Button disabled={disableNext} onClick={handleNext}> Siguiente </Button>
      </CardActions>
    </Card>
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
                <StartCard handleStart={handleStart}/> }
              {answers.length > 1 && answerId === "" &&
                <QuestionForm 
                  answer={answers[answers.length - 1]} 
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleNext={handleNext}
                  handleReset={handleReset}
                  disableNext={value === null}
                />
              }
              {answerId !== "" && 
                <SolutionCard 
                  handleReset={handleReset} 
                  answer={answerId !== null ? ANSWERS.get(answerId) : "No se pudo encontrar una medida de prevención que se adecúe a las condiciones dadas"} 
                /> 
              }
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
