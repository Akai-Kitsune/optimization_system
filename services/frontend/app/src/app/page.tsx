"use client";
import { useState, useRef } from 'react';
import EquationInput from '../components/EquationInput';

// const hint = "Пример: 2x_1 + 3x_2 + сos(x_3) = 5";

export default function Home() {
  const [variablesCount, setVariablesCount] = useState(2);
  const [equations, setEquations] = useState(Array.from({ length: 2 }, () => ''));
  const [method, setMethod] = useState('newton');
  const [solution, setSolution] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [initialPoint, setInitialPoint] = useState(Array.from({ length: variablesCount }, () => '0'));
  // const [rightParts, setRightParts] = useState(Array.from({ length: 2 }, () => '0'));

  type IVariableCount = {
    target: {
      value: string
    }
  }

  type IIter = {
    iteration: number,
    F: object,
    x: object
  }

  const handleVariableCountChange = (e: IVariableCount) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count) && count > 0 && count <= 4) {  // Проверяем, что значение валидное
      setVariablesCount(count);
      setEquations(Array.from({ length: count }, () => ''));
      // setRightParts(Array.from({ length: count }, () => '0'));
      setInitialPoint(Array.from({ length: count }, () => '0'));
    } else {
      // Устанавливаем значение по умолчанию, если ввод некорректен
      setVariablesCount(2);
      setEquations(Array.from({ length: 2 }, () => ''));
      // setRightParts(Array.from({ length: 2 }, () => '0'));
      setInitialPoint(Array.from({ length: 2 }, () => '0'));
    }
  };

  // Используйте ref для ссылки на отчет
  const reportRef = useRef(null);

  const handleEquationChange = (eqIndex: number, value: string) => {
    const newEquations = [...equations];
    
    // Изменяем уравнение, добавляя правую часть со знаком минус
    if (value.includes('=')) {
      const [leftPart, rightPart] = value.split('=').map((part: string) => part.trim());
      newEquations[eqIndex] = `${leftPart} - (${rightPart})`; // Перемещаем правую часть
    } else {
      newEquations[eqIndex] = value; // Если нет знака равенства, просто обновляем
    }
  
    setEquations(newEquations);
  };

  const handleInitialPointChange = (index: number, value: string) => {
    console.log(index, value, initialPoint, '123');
    const newInitialPoint = [...initialPoint];
    newInitialPoint[index] = value;
    setInitialPoint(newInitialPoint);
  };
  
  const solve = async () => {
    // Убедитесь, что уравнения в нужном формате
    const formattedEquations = equations.map(eq => eq.trim());
    setErrorMessage(null);

    const response = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equations: formattedEquations,
        variablesCount,
        method,
        initialPoint, // Передаем начальную точку
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setSolution(data.solution);
      setIterations(data.iterations);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Произошла ошибка при обработке запроса");
      console.error("Error in response:", errorData);
    }
};

  const toggleReport = () => setShowReport(!showReport);

  return (
    <html>
    <body>
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      <h1 className="text-3xl mb-6 font-semibold">Система нелинейных уравнений</h1>
      
      <div className="flex flex-col gap-4 mb-6 w-full max-w-md">
        <div className="flex items-center gap-2">
          <label className="font-medium">Количество переменных:</label>
          <input
            type="number"
            min="1"
            max="4"
            value={variablesCount}
            onChange={handleVariableCountChange}
            className="bg-input p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent w-1/3"
          />
        </div>

        <button
          className="bg-button hover:bg-button-hover p-2 mt-2 rounded transition-colors duration-300"
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? "Скрыть подсказку" : "Показать подсказку для ввода формул"}
        </button>
        
        <div className={`collapsible ${showHint ? 'collapsible-visible' : 'collapsible-hidden'}`}>
          {showHint && (
            <div className="mt-2 bg-hint text-text-light p-2 rounded">
              <ul>
                <li>{"Переменные: x_1, x_2, x_3"}</li>
                <li>{"Возведение в степень: x_1^2, pow(x_1, 3/2)"}</li>
                <li>{"Тригонометрические функции: sin(x_1), cos(x_1), tan(x_1)"}</li>
                <li>{"Логарифм, экспонента: log(x_1, x_2), exp(x_3)"}</li>
              </ul>
            </div>
          )}
        </div>
    
        <div>
          <label className="font-medium">Метод решения:</label>
          <select
            className="bg-input p-2 rounded ml-2 focus:outline-none focus:ring-2 focus:ring-accent"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="newton">Ньютон</option>
            <option value="broyden">Бройден</option>
          </select>
        </div>
      </div>

      <div>
  <h2 className="text-lg text-gray-300">Начальная точка:</h2>
  <div className="flex flex-wrap mb-4">
    {[...Array(variablesCount)].map((_, i) => (
      <input
        key={i}
        type="text"
        value={initialPoint[i]}
        onChange={(e) => handleInitialPointChange(i, e.target.value)}
        className="bg-[#3b3b3b] text-white p-2 rounded mx-1 w-20"
        placeholder={`x₀${i + 1}`}
      />
    ))}
  </div>
  </div>


      <div className="w-full max-w-md mb-6">
        {[...Array(variablesCount)].map((_, i) => (
          <EquationInput
            key={i}
            index={i}
            handleEquationChange={handleEquationChange}
            className="bg-input rounded p-2 mb-2 w-full"
          />
        ))}
      </div>

      <button
        className="bg-button hover:bg-button-hover p-2 mt-4 rounded focus:outline-none transition-colors duration-300"
        onClick={solve}
      >
        Решить
      </button>
    
      {solution && !errorMessage && (
        <div className="mt-6 bg-solution p-4 rounded w-full max-w-md shadow-md">
          <h2 className="text-lg font-semibold">Решение:</h2>
          <pre>{JSON.stringify(solution, null, 2)}</pre>
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-400 rounded">
          {errorMessage}
        </div>
      )}
      
      {iterations?.length > 0 && (
        <button
        className="bg-button hover:bg-button-hover p-2 mt-4 rounded focus:outline-none transition-colors duration-300"
        onClick={toggleReport}
        >
          {showReport ? "Скрыть отчет" : "Подробный отчет"}
        </button>
      )}
    
    <div ref={reportRef} className={`collapsible ${showReport ? 'collapsible-visible' : 'collapsible-hidden'}`}>
        {showReport && iterations.length > 0 && (
          <div className="mt-6 bg-report p-4 rounded overflow-x-auto">
            <h2 className="text-lg">Подробный отчет:</h2>
            <table className="min-w-full rounded">
              <thead>
                <tr>
                  <th className="p-2 border-b text-left">Итерация</th>
                  <th className="p-2 border-b text-left">x</th>
                  <th className="p-2 border-b text-left">F(x)</th>
                  {/* <th className="p-2 border-b text-left">Якобиан</th>
                  <th className="p-2 border-b text-left">Δx</th> */}
                </tr>
              </thead>
              <tbody>
                {iterations.map((iter: IIter, index: number) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{iter?.iteration}</td>
                    <td className="p-2 border-b">{JSON.stringify(iter.x)}</td>
                    <td className="p-2 border-b">{JSON.stringify(iter.F)}</td>
                    {/* <td className="p-2 border-b">{JSON.stringify(iter.Jacobian)}</td>
                    <td className="p-2 border-b">{JSON.stringify(iter.delta_x)}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </body>
    </html>
  );
}
