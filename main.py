import os
from rule_engine import Rule
# import rule_engine
import uvicorn

from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# TODO LO DE RULE ENGINE ESTA MAL USADO, ver docu
def create_rule(input1, input2, input3, input4, input5, output_string):
    rule = Rule(
        condition=lambda: input1 and input2 and input3 and input4 and input5,
        action=lambda: output_string
    )

    return rule

rules = [
    create_rule(True, True, True, True, True, "Test"),
    create_rule(False, False, False, False, False, "Test")
] # aca tenemos que agregar todas las rules que creamos

@app.get("/")
async def home():
    print("GET request received at '/'")
    return JSONResponse(
        status_code=200,
        content={'hello': 'get'})

body_args = ["input_1", "input_2", "input_3", "input_4", "input_5"]

@app.post("/")
async def get_fix(request: Request):
    print("POST request received at '/'")
    request_body = await request.json()
    for attr in body_args:
        if attr not in request_body:
            return JSONResponse(
                                status_code=400,
                                content={'error': f"Attribute '{attr}' should be included in the request body"})
        if not isinstance(request_body[attr], bool):
            return JSONResponse(
                                status_code=400,
                                content={'error': f"Attribute '{attr}' should have a boolean value"})
    for rule in rules:
        result = rule.evaluate(request_body["input1"], request_body["input2"], request_body["input3"], request_body["input4"], request_body["input5"])
        print(result)

# Example usage
    return JSONResponse(
        status_code=200,
        content={'hello': 'post'})


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
