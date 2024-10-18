import numpy as np
from sympy import symbols, cos, Matrix, lambdify, sympify

def newton_method(f_matrix, x, x0, tol=1e-6, max_iter=100, regularization=1e-6):
    f_lambdified = lambdify(x, f_matrix, 'numpy')  # Используем 'numpy' для компиляции функции
    iterations = []  # Список для хранения информации о каждой итерации
    
    for _ in range(max_iter):
        # Вычисляем Якобиан
        J = f_matrix.jacobian(x)
        
        # Подставляем значения из x0
        J_substituted = J.subs({x[i]: float(x0[i]) for i in range(len(x))})

        J_lambdified = lambdify(x, J_substituted, 'numpy')  # Используем 'numpy' для компиляции функции
        
        F = f_lambdified(*x0)  # Передаем список x0 как аргументы
        F = np.array(F, dtype=float).flatten()
        J_eval = J_lambdified(*x0)  # Передаем список x0 как аргументы
        
        # Проверка на сингулярность
        if np.linalg.cond(J_eval) > 1 / regularization:
            print("Warning: Jacobian is close to singular, adjusting regularization.")
            J_eval += np.eye(len(x0)) * regularization  # Регуляризация Якобиана
        
        # Решаем систему линейных уравнений J * delta_x = -F
        delta_x = np.linalg.solve(J_eval, -F)
        x0 = [x0[i] + delta_x[i] for i in range(len(x0))]  # Обновляем x0
        
        # Сохраняем текущее состояние
        iterations.append({
            "iteration": len(iterations) + 1,
            "x": x0,
            "F": F.tolist(),
            "delta_x": delta_x.tolist()
        })
        
        if np.linalg.norm(delta_x) < tol:
            return x0, iterations
    
    print(x0)
    return x0, iterations

def broyden_method(f_matrix, x, x0, tol=1e-6, max_iter=100):
    f_lambdified = lambdify(x, f_matrix, 'numpy')  # Используем 'numpy' для компиляции функции
    iterations = []  # Список для хранения информации о каждой итерации
    
    # Инициализация B как приближение Якобиана
    B = np.eye(len(x0))  # Начальное приближение - единичная матрица
    F = f_lambdified(*x0)  # Вычисляем начальное значение функции в x0
    F = np.array(F, dtype=float).flatten()
    
    for _ in range(max_iter):
        # Решаем систему линейных уравнений B * delta_x = -F
        delta_x = np.linalg.solve(B, -F)
        x0 = [x0[i] + delta_x[i] for i in range(len(x0))]  # Обновляем x0
        F_new = f_lambdified(*x0)  # Вычисляем новое значение F в x0
        F_new = np.array(F_new, dtype=float).flatten()
        
        # Проверяем условие остановки
        if np.linalg.norm(delta_x) < tol:
            return x0, iterations
        
        # Обновляем приближение B (методом Бройдена)
        y = F_new - F  # Изменение в F
        s = delta_x  # Изменение в x
        
        B += np.outer((y - B @ s), s) / (s @ s)
        
        # Обновляем F и сохраняем итерацию
        F = F_new
        
        iterations.append({
            "iteration": len(iterations) + 1,
            "x": x0,
            "F": F.tolist(),
            "delta_x": delta_x.tolist(),
            "B": B.tolist()  # Сохраняем текущее приближение B
        })
    
    return x0, iterations
