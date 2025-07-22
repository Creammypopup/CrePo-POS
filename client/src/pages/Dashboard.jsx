import React from 'react';
import { FaShoppingCart, FaBoxOpen, FaCog, FaChartBar } from 'react-icons/fa';

const NeumorphicButton = ({ icon, text, colorClass, path }) => (
  <button className={`w-full h-32 rounded-3xl transition-all duration-300 ${colorClass} shadow-neumorphic-button active:shadow-neumorphic-button-pressed`}>
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-4xl text-text-primary mb-2">{icon}</div>
      <p className="font-bold text-text-primary">{text}</p>
    </div>
  </button>
);

function Dashboard() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <NeumorphicButton icon={<FaShoppingCart />} text="Sales" colorClass="bg-pastel-pink" />
        <NeumorphicButton icon={<FaBoxOpen />} text="Inventory" colorClass="bg-pastel-yellow" />
        <NeumorphicButton icon={<FaChartBar />} text="Reports" colorClass="bg-pastel-teal" />
        <NeumorphicButton icon={<FaCog />} text="Settings" colorClass="bg-pastel-purple" />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Overview */}
        <div className="lg:col-span-2 p-6 rounded-3xl shadow-neumorphic-convex bg-pastel-bg">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Sales Overview</h2>
           <p className="text-text-secondary">Sales chart will be here...</p>
        </div>
        {/* Recent Activity */}
        <div className="p-6 rounded-3xl shadow-neumorphic-convex bg-pastel-bg">
           <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Activity</h2>
           <p className="text-text-secondary">Activity feed will be here...</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;