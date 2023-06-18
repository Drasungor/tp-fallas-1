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

def create_rule(input_1, input_2, input_3, input_4, input_5):
    # CUIDADO, lo que es texto tiene que tener el mismo nombre que los argumentos del body, sino tira una exception gigante
    rule = Rule(f"input_1 == {str(input_1).lower()} and input_2 == {str(input_2).lower()} and input_3 == {str(input_3).lower()} and input_4 == {str(input_4).lower()} and input_5 == {str(input_5).lower()} ")
    return rule

# aca tenemos que agregar todas las rules que creamos. La primera parte de la tupla, la funcion, crea la regla que se cumple si lo que 
# nos pasan de front es igual que los args. La segunda de la tupla parte es lo que le devolvemos al cliente si se cumple esa regla, osea la E elegida

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

# Para chequear que esten todos los args del body del post, hay que ponerle nombres decentes y hacer que queden iguales en create_rule
body_args = ["input_1", "input_2", "input_3", "input_4", "input_5"]

@app.post("/")
# async def get_fix(request: Request):
async def get_fix(answersBody: Answers):
    print("POST request received at '/'")
    # request_body = await request.json()
    # print(request_body)
    answersDict = answersBody.dict()
    answersArray = answersDict["answers"]
    print(f"answersArray: {answersArray}")
    booleanValues = [answer ["answer"] for answer in answersArray]
    print(f"booleanValues: {booleanValues}")
    # for attr in body_args:
    #     if attr not in request_body:
    #         return JSONResponse(
    #                             status_code=400,
    #                             content={'error': f"Attribute '{attr}' should be included in the request body"})
    #     if not isinstance(request_body[attr], bool):
    #         return JSONResponse(
    #                             status_code=400,
    #                             content={'error': f"Attribute '{attr}' should have a boolean value"})
    # for rule in rules:
    #     rule_func = rule[0]
    #     output = rule[1]
    #     result = rule_func.matches(request_body)
    #     if (result):
    #         return JSONResponse(
    #                             status_code=200,
    #                             content={"fix": output})
    return JSONResponse(
        status_code=200,
        content={"fix": "none"}) # Rta si no cumple ninguna regla


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
