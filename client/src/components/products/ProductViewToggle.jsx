// client/src/components/products/ProductViewToggle.jsx
import React from 'react';
import { FaThList, FaThLarge } from 'react-icons/fa';

function ProductViewToggle({ view, setView }) {
  const baseClass = "p-2 rounded-lg transition-colors duration-200";
  const activeClass = "bg-pastel-purple text-white shadow-md";
  const inactiveClass = "bg-white text-pastel-gray hover:bg-pastel-purple-lightest";

  return (
    <div className="flex bg-white p-1 rounded-xl shadow-sm w-min">
      <button onClick={() => setView('list')} className={`${baseClass} ${view === 'list' ? activeClass : inactiveClass}`}>
        <FaThList size={20} />
      </button>
      <button onClick={() => setView('grid')} className={`${baseClass} ${view === 'grid' ? activeClass : inactiveClass}`}>
        <FaThLarge size={20} />
      </button>
    </div>
  );
}

export default ProductViewToggle;
