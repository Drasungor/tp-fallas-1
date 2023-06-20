import client from "./config";

export interface IAnswer {
  questionId: string
  questionText: string,
  answer: boolean | null
}
// USER
export const postAnswer = async (answers: IAnswer[]) => {
  try {
    const requestData = {
      answers: answers.slice(1, answers.length)
    }
    console.log("requestData", requestData)
    const {data: nextQuestion} = await client.post(`/`, requestData);
    console.log("respuesta back", nextQuestion)
    return nextQuestion

  } catch (error: any) {
    console.error(
      "Request failed, response:",
      error
    );
    return {data: null, statusCode: error.statusCode}
  }
}
