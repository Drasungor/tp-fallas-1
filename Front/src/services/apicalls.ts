import client from "./config";

export interface IAnswer {
  questionId: string
  questionText: string,
  answer: boolean | null
}
// USER
export const postAnswer = async (answers: IAnswer[]) => {
  try {
    const {data: nextQuestion} = await client.post(`/`, {
      answers: answers
    });
    return nextQuestion

  } catch (error: any) {
    console.error(
      "Request failed, response:",
      error
    );
    return {data: null, statusCode: error.statusCode}
  }
}
