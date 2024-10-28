from abc import ABC, abstractmethod
import numpy as np
from sympy import lambdify, Matrix

# Абстрактный класс для решения уравнений
class EquationSolver(ABC):
    @abstractmethod
    def solve(self, f_matrix, x, x0):
        pass

# Класс для метода Ньютона
class NewtonSolver(EquationSolver):
    def solve(self, f_matrix, x, x0, tol=1e-6, max_iter=1000, regularization=1e-6):
        f_lambdified = lambdify(x, f_matrix, 'numpy')
        iterations = []
        
        for _ in range(max_iter):
            # Символьный якобиан
            J = f_matrix.jacobian(x)
            J_substituted = J.subs({x[i]: float(x0[i]) for i in range(len(x))})
            J_lambdified = lambdify(x, Matrix(J_substituted), 'numpy')
            F = np.array(f_lambdified(*x0), dtype=np.float64).flatten()
            J_eval = np.array(J_lambdified(*x0), dtype=np.float64)
            
            # Регуляризация при вырожденности
            if np.linalg.cond(J_eval) > 1 / regularization:
                J_eval += np.eye(len(x0)) * regularization

            # Решение системы
            try:
                delta_x = np.linalg.solve(J_eval, -F)
            except np.linalg.LinAlgError:
                return x0, iterations  # Возвращаем текущее значение при ошибке

            x0 = np.array(x0) + delta_x
            iterations.append({
                "iteration": len(iterations) + 1, 
                "x": x0.tolist(), 
                "F": F.tolist(), 
                "delta_x": delta_x.tolist()
            })

            if np.linalg.norm(delta_x) < tol:
                return x0.tolist(), iterations
        return x0.tolist(), iterations

# Класс для метода Бройдена
class BroydenSolver(EquationSolver):
    def solve(self, f_matrix, x, x0, tol=1e-6, max_iter=1000, regularization=1e-6):
        f_lambdified = lambdify(x, f_matrix, 'numpy')
        iterations = []
        B = np.eye(len(x0), dtype=np.float64)  # Начальное приближение для якобиана (единичная матрица)
        
        x0 = np.array(x0, dtype=np.float64)
        F = np.array(f_lambdified(*x0), dtype=np.float64).flatten()
     
        for _ in range(max_iter):
            try:
                # Решение системы для шага delta_x
                delta_x = np.linalg.solve(B, -F)
            except np.linalg.LinAlgError:
                return x0, iterations  # Выход при проблеме с вырожденной матрицей

            # Обновляем x
            x0 = x0 + delta_x
            F_new = np.array(f_lambdified(*x0), dtype=np.float64).flatten()
            
            # Проверка сходимости
            if np.linalg.norm(delta_x) < tol:
                return x0.tolist(), iterations
            
            # Вычисляем изменения в F и x
            y = F_new - F
            s = delta_x
            
            # Проверка и корректировка для численной стабильности
            if np.dot(s, s) > regularization:
                B += np.outer((y - B @ s), s) / (s @ s)  # Обновление по Бройдену

            F = F_new
            iterations.append({
                "iteration": len(iterations) + 1, 
                "x": x0.tolist(), 
                "F": F.tolist(), 
                "delta_x": delta_x.tolist(), 
                "B": B.tolist()
            })
            
        return x0.tolist(), iterations