import client from "./config";

export interface IQuestion {
  questionId: string
  questionText: string,
  answer: boolean | null
}
// USER
export const postAnswer = async (answers: IQuestion[]) => {
  try {
    const requestData = {
      answers: answers.slice(1, answers.length)
    }
    const {data: nextQuestion} = await client.post(`/`, requestData);
    return nextQuestion

  } catch (error: any) {
    console.error(
      "Request failed, response:",
      error
    );
    return {statusCode: error.statusCode}
  }
}
