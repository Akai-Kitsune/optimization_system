from sympy import symbols, Matrix, sympify
from solvers.solve import NewtonSolver
from solvers.solve import BroydenSolver

class SolveEquationsUseCase:
    def __init__(self, solver):
        self.solver = solver
        print('solveEquationsUseCase')

    def execute(self, equations, variables_count, initial_point):
        print(123)
        x = symbols('x_1:{}'.format(variables_count + 1))
        f_matrix = Matrix([sympify(eq) for eq in equations])
        return self.solver.solve(f_matrix, x, initial_point)
