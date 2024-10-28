import React from 'react';

const EquationInput = ({ index, value, handleEquationChange, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        placeholder={`Уравнение ${index + 1} (например: x_1^2 - x_2 = 2)`}
        value={value}
        onChange={(e) => handleEquationChange(index, e.target.value)}
        className={`bg-input rounded p-2 mb-2 w-full max-w-[50%] resize-none focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      />
    </div>
  );
};

export default EquationInput;


// // components/EquationInput.js
// import React from 'react';

// const EquationInput = ({ index, handleEquationChange, className }) => {
//   return (
//     <div className={`flex items-center gap-2 ${className}`}>
//       <input
//         type="text"
//         placeholder={`Уравнение ${index + 1} (например: x_1^2 - x_2 = 2)`}
//         onChange={(e) => handleEquationChange(index, e.target.value)}
//         // className="flex-grow bg-input p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
//         className={`bg-input rounded p-2 mb-2 w-full max-w-[50%] resize-none focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
//       />
//     </div>
//   );
// };

// export default EquationInput;
