export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { equations, variablesCount, method, initialPoint } = req.body;
    // Отправляем запрос на Python-сервер
    console.log(equations, variablesCount, initialPoint, method);
    console.log('host:', `${process.env.PYTHON_SERVER}/solve`);
    const response = await fetch(`http://${process.env.PYTHON_SERVER}/solve`, {
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

