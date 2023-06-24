import React, {useState} from 'react';
import './App.css';
import {Box, Card, Grid} from "@mui/material";
import {IQuestion, postAnswer} from "./services/apicalls";
import StartCard from './components/StartCard';
import SolutionCard from './components/SolutionCard';
import QuestionForm from "./components/QuestionForm";

enum Level {
  BAJO,
  ALTO
}

type LevelStrings = keyof typeof Level;

const QUESTIONS: IQuestion[] = [
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
ANSWERS.set("E1", "E1 - Confinamiento avícola.")
ANSWERS.set("E2", "E2 - Evitar contacto con otras granjas.")
ANSWERS.set("E3", "E3 - Indumentaria de bioseguridad.")
ANSWERS.set("E4", "E4 - Disponer alimentos en lugares solo accesibles por las aves.")
ANSWERS.set("E5", "E5 - Elementos de disipación de aves silvestres.")
ANSWERS.set("E6", "E6 - Higiene del personal intensificada.")
ANSWERS.set("E7", "E7 - Monitoreo diario del estado de salud avícola.")

const INIT_QUESTIONS: IQuestion[] = [QUESTIONS[0]]

const IMAGES = [
  '',
  '/images/pollo-blanco-granja.jpg',
  '/images/migracion.jpg',
  '/images/humanos.jpg',
  '/images/poblacion_gallinas.jpg',
  '/images/personas.jpg',
]

function App() {
  const [questions, setQuestions] = useState<IQuestion[]>(INIT_QUESTIONS)
  const [value, setValue] = useState<Level | null>(null)
  const [questionId, setQuestionId] = useState<string>("")
  const [radios, setRadios] = useState({alto: false, bajo:false})

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value
    const level = Level[input as LevelStrings]
    setValue(level)
    if (level === Level.ALTO) {
      setRadios({alto: true, bajo: false})
    } else {
      setRadios({alto: false, bajo: true})
    }
  }

  function nextQuestion() {
    setQuestions(oldAnswers => [...oldAnswers, QUESTIONS[questions.length]])
    setRadios({alto: false, bajo: false})
  }

  const handleStart = () => {
    nextQuestion();
  }

  const handleNext = () => {
    if (questions.length === 1) {
      return
    }
    if (questions.length > 1) {
      // envio la respuesta
      const isYes = (value === Level.ALTO)
      const newAnswer = {...questions[questions.length - 1], answer: isYes}
      setQuestions(oldQuestions => {
        oldQuestions[questions.length - 1] = newAnswer;
        return oldQuestions
      })
      postAnswer(questions).then(response => {
        if (response.data === null) {
          return response.statusCode
        }
        if ("answerId" in response) {
          // tengo la respuesta
          setQuestionId(response.answerId)
          nextQuestion();
        } else if ("questionId" in response) {
          // paso a la siguiente pregunta
          nextQuestion();
        }
      })
    }
    setValue(null)
  }

  const handleBack = () => {
    setQuestions(oldQuestions => {
      const newAnswers = [...oldQuestions]
      newAnswers.pop()
      return newAnswers
    })
    setQuestionId("")
  }

  const handleReset = () => {
    setQuestions(INIT_QUESTIONS)
    setQuestionId("")
    setValue(null)
  }

  const styles = {
    box: {
      background: 'url(/images/fondo.jpg) center top / cover transparent',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100vw',
      minHeight: '100vh',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }

  }

  return (
    <Box sx={styles.box}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Card sx={{width: '500pt', minHeight: 500}} variant="outlined">
            {questions.length === 1 &&
              <StartCard handleStart={handleStart}/>}
            {questions.length > 1 && questionId === "" &&
              <QuestionForm
                answer={questions[questions.length - 1]}
                handleChange={handleChange}
                handleBack={handleBack}
                handleNext={handleNext}
                handleReset={handleReset}
                disableNext={value === null}
                imageUrl={IMAGES[questions.length - 1]}
                radios={radios}
              />
            }
            {questionId !== "" &&
              <SolutionCard
                handleReset={handleReset}
                answer={questionId !== null ? ANSWERS.get(questionId) : "No se pudo encontrar una medida de prevención que se adecúe a las condiciones dadas"}
              />
            }
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


export default App;
