import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  containerWidth?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  containerWidth = "w-1/2"
}) => {
  const tabWidth = `w-1/${tabs.length}`;
  return (
    <div className={`${className}`}>
      <nav className={`flex justify-between md:${containerWidth}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium cursor-pointer text-sm ${tabWidth} ${
                isActive
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {Icon ? <Icon className='h-4 w-4' /> : <></>}
                {tab.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
