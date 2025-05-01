import { Home, Brain, Gamepad2, Book, User } from "lucide-react";
import { useState } from "react";

export default function BottomNavigationBar() {
  const [activeTab, setActiveTab] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  
  const tabs = [
    { id: "home", label: "Home", icon: Home, gradient: "from-purple-500 to-blue-500" },
    { id: "quiz", label: "Quiz", icon: Brain, gradient: "from-green-500 to-teal-400" },
    { id: "game", label: "Mini Game", icon: Gamepad2, gradient: "from-red-500 to-orange-400" },
    { id: "story", label: "Story", icon: Book, gradient: "from-amber-500 to-yellow-300" },
    { id: "profile", label: "Profile", icon: User, gradient: "from-indigo-500 to-purple-400" },
  ];

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center">
      {/* Elegant toggle button with subtle animation */}
      <div 
        className="relative flex justify-center"
        onClick={toggleVisibility}
      >
        <div className="absolute -top-3 w-12 h-6 bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-full flex justify-center items-center cursor-pointer shadow-lg border border-gray-800 transform transition-transform duration-300 hover:scale-105">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 glow-sm"></div>
          <div className={`absolute w-6 h-1 bg-white bg-opacity-60 rounded-full transform transition-all duration-300 ${isVisible ? 'rotate-0' : 'rotate-90'}`}></div>
        </div>
      </div>
      
      {/* Tab bar with animation */}
      <div 
        className={`bg-black bg-opacity-85 backdrop-blur-md shadow-2xl rounded-t-2xl border-t border-gray-800 w-full
          transition-all duration-300 ease-in-out overflow-hidden
          ${isVisible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="mx-2 my-2 flex justify-between items-center">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <div key={tab.id} className="flex-1 relative">
                <button
                  className="w-full flex flex-col items-center relative group"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {/* Background glow effect that's always present but only visible when active */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-xl blur-sm
                      transition-opacity duration-300 ease-in-out ${isActive ? 'opacity-15' : 'opacity-0'}`} 
                  />
                  
                  {/* Icon container with smooth transitions */}
                  <div 
                    className={`p-2 rounded-full transition-all duration-300 ease-in-out transform
                      ${isActive ? `bg-gradient-to-br ${tab.gradient} shadow-lg` : 'bg-transparent'}`}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-all duration-300 ease-in-out
                        ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  
                  {/* Label with smooth fade and position transition - improved spacing */}
                  <div className="h-6 relative mt-1">
                    <span 
                      className={`absolute left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap
                        transition-all duration-300 ease-in-out
                        ${isActive 
                          ? 'opacity-100 translate-y-0 text-white' 
                          : 'opacity-0 translate-y-2 text-gray-400'}`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </button>
                
                {/* Dividers between items */}
                {index < tabs.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-800"></div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="h-1 w-full bg-gray-900"></div>
      </div>
      
      {/* Add custom CSS for the glow effect */}
      <style jsx>{`
        .glow-sm {
          box-shadow: 0 0 8px 1px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
