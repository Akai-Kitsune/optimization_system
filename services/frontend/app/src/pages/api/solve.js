// export default async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { equations, variablesCount, method } = req.body;

//   // Пример начальных данных и подготовки ответа
//   const initialGuess = Array(variablesCount).fill(1.0);
  
//   // Пример решения уравнения — для демонстрации замените на настоящий вызов сервера Python
//   const solution = initialGuess.map((_, i) => i + 1); // Решение (например, [1, 2, 3, 4])
//   const steps = [
//     { iteration: 1, x: initialGuess, F_x: initialGuess.map(x => x * x), Jacobian: 'Матрица Якобиана' },
//     { iteration: 2, x: solution, F_x: solution.map(x => x * x), Jacobian: 'Обновленная матрица Якобиана' }
//   ]; // Пример пошаговых действий

//   res.status(200).json({ solution, steps });
// };
// export default async () => {
//   const response = await fetch('http://127.0.0.1:5000/solve', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       equations: ["x1**2 + x2 - 4", "x1**2 + x2**2 - 5"],  // Пример квадратной системы
//       variablesCount: 2,
//       method: 'newton',  // или 'broyden'
//     }),
//   });
//   console.log(response);
//   if (response.ok) {
//     const data = await response.json();
//     console.log("Решение:", data.solution);
//     console.log("Пошаговое решение:", data.steps);
//     res.status(200).json(result);
//   } else {
//     console.error("Ошибка решения:", await response.json());
//     res.status(response.status).json(errorResponse);
//   }
// };

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { equations, variablesCount, method, initialPoint } = req.body;
    // Отправляем запрос на Python-сервер
    console.log(equations, variablesCount, initialPoint, method);
    const response = await fetch('http://127.0.0.1:5000/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equations, variablesCount, method, initialPoint }),
    });


    // Проверяем, успешно ли решено уравнение
    if (response.ok) {
      const result = await response.json();
      res.status(200).json(result);
    } else {
      const errorResponse = await response.json();
      res.status(response.status).json(errorResponse);
    }
  } catch (error) {
    console.error('Error connecting to Python server:', error);
    res.status(500).json({ error: 'Failed to connect to Python server' });
  }
};

