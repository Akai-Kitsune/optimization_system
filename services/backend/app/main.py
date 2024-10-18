from fastapi import FastAPI
from controllers import solve_controller
import uvicorn

app = FastAPI()

app.include_router(solve_controller.router)

if __name__ == "__main__":
    
    uvicorn.run(app, host="localhost", port=5000)
