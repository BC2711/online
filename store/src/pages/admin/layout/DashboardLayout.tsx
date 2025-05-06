import React, { useState, useEffect, useRef } from 'react';
import {
  HomeIcon, ShoppingBagIcon, UsersIcon, ChartBarIcon, CogIcon, CreditCardIcon,
  QuestionMarkCircleIcon, XMarkIcon, Bars3Icon, ChevronLeftIcon, ChevronRightIcon,
  FolderIcon, DocumentIcon, TagIcon, ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { Typography, IconButton, Avatar, Badge, Card } from '@material-tailwind/react';

const SidebarItem = ({ icon, label, active, onClick, collapsed, isSubmenu = false, hasSubmenu = false, onMouseEnter, onMouseLeave }) => (
  <li
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors 
      ${active ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'} 
      ${collapsed ? 'justify-center' : ''} 
      ${isSubmenu ? (collapsed ? 'pl-3' : 'pl-8') : ''}`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <span className={collapsed && !isSubmenu ? '' : 'mr-3'}>{icon}</span>
    {!collapsed && <Typography variant="small" className="font-medium">{label}</Typography>}
  </li>
);

const SubmenuCard = ({ items, visible, position, activeTab, onItemClick, onMouseEnter, onMouseLeave }) => {
  const cardRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (visible && cardRef.current) {
      const card = cardRef.current;
      const viewportHeight = window.innerHeight;
      const cardBottom = position.top + card.offsetHeight;
      
      setAdjustedPosition(
        cardBottom > viewportHeight ? { ...position, top: viewportHeight - card.offsetHeight - 20 } : position
      );
    }
  }, [visible, position]);

  if (!visible) return null;

  return (
    <Card
      ref={cardRef}
      className={`fixed z-50 w-56 p-2 shadow-xl transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ top: `${adjustedPosition.top}px`, left: `${adjustedPosition.left}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className="space-y-1">
        {items.map(({ icon, label, value }) => (
          <li
            key={value}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${activeTab === value ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
            onClick={() => onItemClick(value)}
          >
            <span className="mr-3">{icon}</span>
            <Typography variant="small" className="font-medium">{label}</Typography>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard', value: 'dashboard' },
    { icon: <ShoppingBagIcon className="h-5 w-5" />, label: 'Products', value: 'products', submenu: [
        { icon: <TagIcon className="h-4 w-4" />, label: 'All Products', value: 'all-products' },
        { icon: <FolderIcon className="h-4 w-4" />, label: 'Categories', value: 'categories' },
        { icon: <DocumentIcon className="h-4 w-4" />, label: 'Inventory', value: 'inventory' }
    ] },
    { icon: <UsersIcon className="h-5 w-5" />, label: 'Customers', value: 'customers' },
    { icon: <ChartBarIcon className="h-5 w-5" />, label: 'Analytics', value: 'analytics', submenu: [
        { icon: <ShoppingCartIcon className="h-4 w-4" />, label: 'Sales', value: 'sales-analytics' },
        { icon: <UsersIcon className="h-4 w-4" />, label: 'Customers', value: 'customer-analytics' }
    ] },
    { icon: <CreditCardIcon className="h-5 w-5" />, label: 'Orders', value: 'orders' },
    { icon: <CogIcon className="h-5 w-5" />, label: 'Settings', value: 'settings' },
    { icon: <QuestionMarkCircleIcon className="h-5 w-5" />, label: 'Help', value: 'help' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} />
      
      <div className={`fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            {!collapsed && <Typography variant="h5" color="blue">E-Commerce</Typography>}
            <div className="flex items-center space-x-2">
              <IconButton variant="text" className="lg:hidden" onClick={toggleSidebar}><XMarkIcon className="h-5 w-5" /></IconButton>
              <IconButton variant="text" className="hidden lg:inline-flex" onClick={toggleCollapse}>{collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}</IconButton>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map(({ icon, label, value, submenu }) => (
                <React.Fragment key={value}>
                  <SidebarItem icon={icon} label={label} active={activeTab === value} onClick={() => setActiveTab(value)} collapsed={collapsed} hasSubmenu={!!submenu} />
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
    </div>
  );
};
