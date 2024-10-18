from abc import ABC, abstractmethod
import numpy as np
from sympy import lambdify, Matrix

# Абстрактый класс для решения уравнений, он определяет общий интерфейс
class EquationSolver(ABC):
    @abstractmethod
    def solve(self, f_matrix, x, x0):
        pass

# Класс для решения уравнений методом Ньютона
class NewtonSolver(EquationSolver):
    def solve(self, f_matrix, x, x0, tol=1e-6, max_iter=1000, regularization=1e-6):
        f_lambdified = lambdify(x, f_matrix, 'numpy')
        iterations = []
        for _ in range(max_iter):
            J = f_matrix.jacobian(x)
            J_substituted = J.subs({x[i]: float(x0[i]) for i in range(len(x))})
            J_lambdified = lambdify(x, J_substituted, 'numpy')
            F = f_lambdified(*x0)
            F = np.array(F, dtype=float).flatten()
            J_eval = J_lambdified(*x0)
            if np.linalg.cond(J_eval) > 1 / regularization:
                J_eval = np.array(J_eval, dtype=np.float64)  # Приведение к float64
                J_eval += np.eye(len(x0), dtype=np.float64) * regularization  # Приведение единичной матрицы к float64

            delta_x = np.linalg.solve(J_eval, -F)
            x0 = [x0[i] + delta_x[i] for i in range(len(x0))]
            iterations.append({"iteration": len(iterations) + 1, "x": x0, "F": F.tolist(), "delta_x": delta_x.tolist()})
            if np.linalg.norm(delta_x) < tol:
                return x0, iterations
        return x0, iterations

# Класс для решения уравнений методом Бройдена
class BroydenSolver(EquationSolver):
    def solve(self, f_matrix, x, x0, tol=1e-6, max_iter=1000):
        f_lambdified = lambdify(x, f_matrix, 'numpy')
        iterations = []
        B = np.eye(len(x0))
        F = f_lambdified(*x0)
        F = np.array(F, dtype=float).flatten()
        for _ in range(max_iter):
            delta_x = np.linalg.solve(B, -F)
            x0 = [x0[i] + delta_x[i] for i in range(len(x0))]
            F_new = f_lambdified(*x0)
            F_new = np.array(F_new, dtype=float).flatten()
            if np.linalg.norm(delta_x) < tol:
                return x0, iterations
            y = F_new - F
            s = delta_x
            B += np.outer((y - B @ s), s) / (s @ s)
            F = F_new
            iterations.append({"iteration": len(iterations) + 1, "x": x0, "F": F.tolist(), "delta_x": delta_x.tolist(), "B": B.tolist()})
        return x0, iterations
