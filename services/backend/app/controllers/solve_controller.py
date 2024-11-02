from fastapi import APIRouter, HTTPException, Request
from use_cases.solve_equations import SolveEquationsUseCase
from solvers.solve import NewtonSolver
from solvers.solve import BroydenSolver

from models.solve_models import SolveRequest
from models.solve_models import SolveResponse

import numpy as np

router = APIRouter()


@router.get('/api/ping')
def ping():
    return {"message": "pong"}

@router.post("/api/solve")
def solve(request: SolveRequest) -> SolveResponse:
    if len(request.equations) != request.variablesCount:
        raise HTTPException(status_code=400, detail="Number of equations must match variables count")
    
    solver = None
    if request.method == "newton":
        solver = NewtonSolver()
    elif request.method == "broyden":
        solver = BroydenSolver()
    else:
        raise HTTPException(status_code=400, detail="Unknown method")
    
    use_case = SolveEquationsUseCase(solver)

    solution, iterations = use_case.execute(
        # request.equations, request.variablesCount,  [np.float64(request.initialPoint[0]), np.float64(request.initialPoint[1])]
        request.equations, request.variablesCount,  [np.float64(request.initialPoint[i]) for i in range(len(request.initialPoint))]

    )
    return {"solution": solution, "iterations": iterations}
