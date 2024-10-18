from pydantic import BaseModel
from typing import List

# Модель для получения данных
class SolveRequest(BaseModel):
    equations: list[str]
    variablesCount: int
    initialPoint: list[str]
    method: str

    model_config  = {
        "json_schema_extra": {
            "example": {
                "equations": [
                    "x_1^2 - 2*x_2^2", 
                    "x_2^2 - 17"],
                "variablesCount": 2,
                "method": "newton",
                "initialPoint": ['1.0', '0.5']
            }
        }
    }

# Модель для вывода данных
class SolveResponse(BaseModel):
    solution: List[float]
    iterations: List[dict]

    model_config  = {
            "json_schema_extra": {
                "example": {
                    "solution": [1.2, 3.4],
                    "iterations": [
                        {"iteration": 1, "x": [1.0, 0.5], "F": [0.1, 0.2]},
                        {"iteration": 2, "x": [1.2, 0.7], "F": [0.01, 0.02]}
                    ]
                }
            }
        }
