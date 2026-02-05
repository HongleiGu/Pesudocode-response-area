import { ExpectedAnswer, StudentResponse } from "./input";

export const callAPI = async(response: StudentResponse, answer: ExpectedAnswer, params: any) => {
  const data = await fetch("http://localhost:8000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      response,
      answer,
      params
    }),
  })
  return data
}