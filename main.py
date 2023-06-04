import os
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

# Example usage
    return JSONResponse(
        status_code=200,
        content={'hello': 'post'})


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
