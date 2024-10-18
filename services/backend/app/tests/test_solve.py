import pytest
from fastapi.testclient import TestClient
from main import app  # Импорт вашего FastAPI приложения

client = TestClient(app)

# Пример теста для решения системы уравнений
def test_solve_system():
    response = client.post(
        "/solve",
        json={
            "equations": [
                "x_1^2 - 7*x_2^3", 
                "x_2^2 - 17"
            ],
            "variablesCount": 2,
            "method": "newton",
            "initialPoint": ['0', '0']
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "solution" in data
    assert "iterations" in data

def test_solve_system_invalid_data():
    response = client.post(
        "/solve",
        json={
            "equations": ["invalid equation"],
            "variablesCount": 2,
            "method": "newton",
            "initialPoint": [0, 0]
        }
    )
    assert response.status_code == 422  # Проверка на ошибку валидации
