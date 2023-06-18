import os
from rule_engine import Rule
import uvicorn

from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class Answer(BaseModel):
    questionId: str
    question: str
    answer: bool

class Answers(BaseModel):
    answers: List[Answer]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

def stringifyBools(boolsArray):
    returnedString = str(boolsArray[0])
    for value in boolsArray[1:]:
        returnedString += f"-´{str(value)}"
    return returnedString

def getRulesDict(rulesArray): # `[(result, bools)]`
    rulesDict = {}
    for rule in rulesArray:
        result = rule[0]
        bools = rule[1]
        rulesDict[stringifyBools(bools)] = result
    return rulesDict

globalRulesdict = getRulesDict([
    ("E7", [False, False, False]),
    ("E3", [False, False, True]),
    ("E6", [False, True, False]),
    ("E1", [False, True, True, False, False]),
    ("E1", [False, True, True, False, True]),
    ("E2", [True, False, False, True, False]),
    ("E2", [True, False, False, True, True]),
    ("E4", [True, False, True, False]),
    ("E4", [True, False, True, True, False]),
    ("E5", [True, False, True, True, True]),
    ("E1", [True, True, True, False, False]),
    ("E1", [True, True, True, False, True]),
    ("E4", [True, True, True, True, False]),
    ("E5", [True, True, True, True, True])
])

questionsOrder = ["C1", "C2", "C3", "C4", "C5"]

questionsDict = {
    "C1": "",
    "C2": "",
    "C3": "",
    "C4": "",
    "C5": "",
}

answersDict = {
    "E1": "",
    "E2": "",
    "E3": "",
    "E4": "",
    "E5": "",
    "E6": "",
    "E7": "",
}

def processAnswers(boolsArray):
    answersAmount = len(boolsArray)
    answerKey = stringifyBools(boolsArray)
    if (not (answerKey in globalRulesdict)):
        return { "gotAnswer": False, "question": questionsOrder[answersAmount] }
    return { "gotAnswer": True, "answer": globalRulesdict[answerKey] }

@app.get("/")
async def home():
    print("GET request received at '/'")
    return JSONResponse(
        status_code=200,
        content={'hello': 'get'})

@app.post("/")
async def get_fix(answersBody: Answers):
    print("POST request received at '/'")
    answersDict = answersBody.dict()
    answersArray = answersDict["answers"]
    print(f"answersArray: {answersArray}")
    booleanValues = [answer ["answer"] for answer in answersArray]
    print(f"booleanValues: {booleanValues}")
    return JSONResponse(
        status_code=200,
        content={"fix": "none"}) # Rta si no cumple ninguna regla


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
