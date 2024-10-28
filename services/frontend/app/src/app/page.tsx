"use client";
import { useState, useRef, useEffect} from 'react';
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

  useEffect(() => {
    // Обновление начальной точки при изменении количества переменных
    setInitialPoint(Array.from({ length: variablesCount }, () => '0'));
  }, [variablesCount]);

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

  const handleAutoSetup1 = () => {
    setVariablesCount(3);
    setEquations([
      "(x_1-2)^2 + (x_2 - 1)^2 + (x_3 + 0.5)^2 - 250",
      "2*x_1 + x_2 - 0.5*x_3 - 5",
      "-0.5*x_1 - 5*x_1 + 3*x_3 + 2"
    ]);
    setInitialPoint(["2.5", "2", "5"]);
  };

  const handleAutoSetup2 = () => {
    setVariablesCount(3);
    setEquations([
      "5*cos(x_2)",
      "3*x_1^2 + 7*x_2*x_3",
      "5*cos(x_2)^2 + (3*x_1^2 + 7*x_2*x_3)^2"
    ]);
    setInitialPoint(["4", "1.5", "5"]);
  };

  const handleAutoSetup3 = () => {
    setVariablesCount(2);
    setEquations([
      "3*x_1^2 + 4*x_2",
      "4*x_1-x_1^3"
    ]);
    setInitialPoint(["1", ".5"]);
  };

  const handleAutoSetup4 = () => {
    setVariablesCount(3);
    setEquations([
      "2.5*x_1^2 + (x_2-2)^2 + 4 - 16*25",
      "2.5*x_1 + 2*x_2 - 2*x_3",
      "x_1 + x_2 + x_3 - 10"
    ]);
    setInitialPoint(["3.5", "1", "26"]);
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      <h1 className="text-3xl mb-6 font-semibold">Система нелинейных уравнений</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          className="bg-button hover:bg-button-hover p-2 rounded transition-colors duration-300"
          onClick={handleAutoSetup1}
        >
          Задача 1
        </button>
        <button
          className="bg-button hover:bg-button-hover p-2 rounded transition-colors duration-300"
          onClick={handleAutoSetup2}
        >
          Задача 2
        </button>
        <button
          className="bg-button hover:bg-button-hover p-2 rounded transition-colors duration-300"
          onClick={handleAutoSetup3}
        >
          Задача 3
        </button>
        <button
          className="bg-button hover:bg-button-hover p-2 rounded transition-colors duration-300"
          onClick={handleAutoSetup4}
        >
          Задача 4
        </button>
      </div>

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
      {equations.map((eq, index) => (
        <EquationInput
          key={`equation-${index}`}
          index={index}
          value={eq} // Передаем значение уравнения
          handleEquationChange={handleEquationChange}
          className="w-full"
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

  );
}
