from flask import Flask, request, jsonify

from solve import  newton_method, broyden_method
from sympy import symbols, Matrix, sympify
import numpy as np

app = Flask(__name__)

@app.route('/solve', methods=['POST'])
def solve(x0=None):
    data = request.json
    equations = data.get('equations', [])
    variables_count = data.get('variablesCount', 0)
    method = data.get('method', '')
    initial_point = data.get('initialPoint', [])

    print(data)
    if len(equations) != variables_count:
        return jsonify({"error": "The number of equations must match the number of variables."}), 400

    # Определяем символы для переменных в формате x_1, x_2, ...
    x = symbols('x_1:{}'.format(variables_count + 1))  # Создаем символы x_1, x_2, ..., x_n

    # Формируем систему уравнений, используя sympify для безопасного парсинга строк в уравнения
    f = []
    try:
        for eq in equations:
            f.append(sympify(eq, evaluate=False))  # Используем sympify для безопасного парсинга
    except Exception as e:
        print(e)
        return jsonify({"error": f"Invalid equation format: {str(e)}"}), 400
    
    # Преобразуем в матрицу
    f_matrix = Matrix(f)

    print(data)
    print(f_matrix)
    
    # Определяем начальные приближения (можно задать по умолчанию)
    if not x0:
        x0 = np.ones(variables_count).tolist()  # Преобразуем в списокvffd
    #x0 =  np.array([-5, 0.5, 3])
    if method == "newton":
        solution, iterations = newton_method(f_matrix, x, x0)
    elif method == "broyden":
        solution, iterations = broyden_method(f_matrix, x, x0)
    else:
        return jsonify({"error": "Unknown method"}), 400
    
    return jsonify({"solution": solution, "iterations": iterations})


if __name__ == '__main__':
    app.run(debug=True)
