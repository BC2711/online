import React, { useReducer, useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Location } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSwipeable, SwipeableHandlers } from 'react-swipeable';
import {
  HomeIcon,
  FolderIcon,
  ShoppingCartIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { UsersIcon, MegaphoneIcon, ChartBarIcon, CogIcon } from 'lucide-react';
import ReactDOM from 'react-dom';
import { logout } from '../../../service/api/admin/login/login';
import { useAuth } from '../../../context/AuthContext';

// Type Definitions
interface NavSubItem {
  name: string;
  link: string;
  badge?: number | null;
}

interface NavItem {
  name: string;
  icon: React.ReactElement;
  items?: NavSubItem[];
  badge?: number | null;
}

interface SidebarProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  navItems?: NavItem[];
  isLoading?: boolean;
}

interface State {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activeItem: string;
  hoveredItem: NavItem | null;
  hoverPosition: { top: number; left: number };
  expandedSections: Record<string, boolean>;
  showLogoutModal: boolean;
}

type Action =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_SIDEBAR' }
  | { type: 'SET_ACTIVE_ITEM'; payload: string }
  | {
    type: 'SET_HOVERED_ITEM';
    payload: { item: NavItem | null; position?: { top: number; left: number } };
  }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'SET_LOGOUT_MODAL'; payload: boolean }
  | { type: 'RESTORE_STATE'; payload: Partial<State> };

interface ThemeClasses {
  sidebar: string;
  hoverCard: string;
  button: string;
  activeItem: string;
  subItem: string;
}


// Animation Variants
const sidebarVariants = {
  expanded: { width: '16rem' },
  collapsed: { width: '4.5rem' },
};

const hoverCardVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// Initial State
const initialState: State = {
  isCollapsed: false,
  isMobileOpen: false,
  activeItem: 'Dashboard',
  hoveredItem: null,
  hoverPosition: { top: 0, left: 0 },
  expandedSections: {},
  showLogoutModal: false,
};

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
        hoveredItem: null,
        isMobileOpen: false,
      };
    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, isMobileOpen: !state.isMobileOpen };
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.payload };
    case 'SET_HOVERED_ITEM':
      return {
        ...state,
        hoveredItem: action.payload.item,
        hoverPosition: action.payload.position || state.hoverPosition,
      };
    case 'TOGGLE_SECTION':
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.payload]: !state.expandedSections[action.payload],
        },
      };
    case 'SET_LOGOUT_MODAL':
      return { ...state, showLogoutModal: action.payload };
    case 'RESTORE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// NavItem Component
interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  activeItem: string;
  isCollapsed: boolean;
  expandedSections: Record<string, boolean>;
  themeClasses: ThemeClasses;
  onHover: (item: NavItem) => void;
  onLeave: () => void;
  onClick: (name: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, item: NavItem) => void;
  onToggleSection: (name: string) => void;
  itemRef: (el: HTMLButtonElement | null) => void;
}

const NavItem: React.FC<NavItemProps> = React.memo(
  ({
    item,
    isActive,
    activeItem,
    isCollapsed,
    expandedSections,
    themeClasses,
    onHover,
    onLeave,
    onClick,
    onKeyDown,
    onToggleSection,
    itemRef,
  }) => {
    return (
      <li>
        <button
          ref={itemRef}
          onMouseEnter={() => onHover(item)}
          onMouseLeave={onLeave}
          onClick={() => {
            if (item.items && !isCollapsed) {
              onToggleSection(item.name);
            } else if (item.items?.[0]) {
              onClick(item.items[0].name);
            } else {
              onClick(item.name);
            }
          }}
          onKeyDown={(e) => onKeyDown(e, item)}
          className={`group relative flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 pointer-events-auto z-10 ${isActive
            ? themeClasses.activeItem
            : `${themeClasses.subItem} ${themeClasses.button}`
            } ${isCollapsed ? 'justify-center' : ''}`}
          aria-expanded={expandedSections[item.name] || false}
          aria-controls={`submenu-${item.name}`}
          aria-label={item.name}
          tabIndex={0}
          data-testid={`nav-item-${item.name.toLowerCase().replace(/\s/g, '-')}`}
        >
          <div className="flex items-center relative">
            <span className={isCollapsed ? '' : 'mr-3'}>
              {React.cloneElement(item.icon, {
                className: `h-5 w-5 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
                  }`,
              })}
            </span>
            {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
            {item.badge && (
              <span
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${isCollapsed ? 'top-0 right-0' : ''
                  }`}
              >
                {item.badge}
              </span>
            )}
          </div>
          {!isCollapsed && item.items && (
            <span className="text-gray-400 group-hover:text-indigo-500">
              {expandedSections[item.name] ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </span>
          )}
        </button>

        {!isCollapsed && item.items && (
          <motion.ul
            id={`submenu-${item.name}`}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
            initial={false}
            animate={{
              height: expandedSections[item.name] ? 'auto' : 0,
              opacity: expandedSections[item.name] ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            layout
          >
            {item.items.map((subItem) => (
              <li key={subItem.name}>
                <Link
                  to={subItem.link}
                  onClick={() => onClick(subItem.name)}
                  className={`flex items-center justify-between w-full p-2 rounded-lg text-sm transition-all duration-150 ${isActive && subItem.name === activeItem
                    ? themeClasses.activeItem
                    : themeClasses.subItem
                    }`}
                  tabIndex={expandedSections[item.name] ? 0 : -1}
                  data-testid={`sub-nav-item-${subItem.name.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3"></span>
                    <span>{subItem.name}</span>
                  </div>
                  {subItem.badge && (
                    <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </li>
    );
  }
);

// HoverCard Component
interface HoverCardProps {
  item: NavItem | null;
  position: { top: number; left: number };
  activeItem: string;
  themeClasses: ThemeClasses;
  onClick: (name: string) => void;
  onHoverCardEnter: () => void;
  onHoverCardLeave: () => void;
}

const HoverCard: React.FC<HoverCardProps> = React.memo(
  ({ item, position, activeItem, themeClasses, onClick, onHoverCardEnter, onHoverCardLeave }) => {
    if (!item || !document.body) return null;
    return ReactDOM.createPortal(
      <motion.div
        onMouseEnter={onHoverCardEnter}
        onMouseLeave={onHoverCardLeave}
        className={`fixed z-50 ${themeClasses.hoverCard} shadow-2xl rounded-lg p-4 min-w-[220px] border pointer-events-auto`}
        style={{ top: position.top, left: position.left }}
        variants={hoverCardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role="menu"
        data-testid="hover-card"
      >
        <div className="flex items-center mb-3 pb-2 border-b border-gray-700">
          {React.cloneElement(item.icon, {
            className: 'h-5 w-5 mr-2 text-indigo-400',
          })}
          <span className="font-semibold text-sm">{item.name}</span>
          {item.badge && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </div>
        <ul className="space-y-1" role="menu">
          {item.items ? (
            item.items.map((subItem) => (
              <li key={subItem.name} role="menuitem">
                <Link
                  to={subItem.link}
                  onClick={() => onClick(subItem.name)}
                  className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-sm transition-all ${activeItem === subItem.name
                    ? themeClasses.activeItem
                    : themeClasses.subItem
                    }`}
                  data-testid={`hover-sub-item-${subItem.name.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <span>{subItem.name}</span>
                  {subItem.badge && (
                    <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-2 py-1.5 text-sm text-gray-500" role="menuitem">
              No submenu items
            </li>
          )}
        </ul>
      </motion.div>,
      document.body
    );
  }
);

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({
  children,
  theme = 'dark',
  navItems = [],
  isLoading = false,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHoverCardHovered, setIsHoverCardHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location: Location = useLocation();
  const navigate = useNavigate();
  const { authToken, user } = useAuth();

  // Swipe Handlers
  const swipeHandlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () =>
      state.isMobileOpen && dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' }),
    onSwipedRight: () =>
      !state.isMobileOpen && dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' }),
    trackMouse: false,
  });

  // Merge Refs
  const setSidebarRef = useCallback(
    (node: HTMLDivElement | null) => {
      sidebarRef.current = node;
      if (swipeHandlers.ref) {
        swipeHandlers.ref(node);
      }
    },
    [swipeHandlers]
  );

  // Default Nav Items
  const defaultNavItems: NavItem[] = useMemo(
    () => [
      {
        name: 'Dashboard',
        icon: <HomeIcon className="h-5 w-5" />,
        items: [
          { name: 'Home', link: '/admin/home' },
          { name: 'Analytics', link: '/admin/analytics', badge: 3 },
        ],
      },
      {
        name: 'Product Categories',
        icon: <UsersIcon className="h-5 w-5" />,
        items: [{ name: 'All Categories', link: '/admin/category/all-categories' }],
      },
      {
        name: 'Products',
        icon: <FolderIcon className="h-5 w-5" />,
        badge: 12,
        items: [
          { name: 'All Products', link: '/admin/products/all-products' },
          { name: 'Inventory', link: '/admin/products/inventory' },
          { name: 'Bulk Import/Export', link: '#' },
          { name: 'Product Reviews', link: '/admin/products/review', badge: 5 },
          { name: 'Low Stock Alerts', link: '/admin/products/low-stock-alert', badge: 7 },
        ],
      },
      {
        name: 'Orders',
        icon: <ShoppingCartIcon className="h-5 w-5" />,
        badge: 8,
        items: [
          { name: 'All Orders', link: '/admin/orders/all-orders' },
          { name: 'Pending Orders', link: '/admin/orders/pending', badge: 5 },
          { name: 'Completed Orders', link: '/admin/orders/completed' },
          { name: 'Cancelled Orders', link: '/admin/orders/cancelled' },
          { name: 'Returns & Refunds', link: '/admin/orders/returns-and-refunds', badge: 2 },
        ],
      },
      {
        name: 'Customers',
        icon: <UserGroupIcon className="h-5 w-5" />,
        items: [
          { name: 'Customer List', link: '/admin/customers' },
          { name: 'Customer Groups', link: '/admin/customers/customer-groups' },
          { name: 'Loyalty Program', link: '/admin/customers/loyalty-program' },
          { name: 'Customer Feedback', link: '/admin/customers/customer-feedback' },
        ],
      },
      {
        name: 'Marketing',
        icon: <MegaphoneIcon className="h-5 w-5" />,
        items: [
          { name: 'Promotions', link: '/admin/marketing/promotions' },
          { name: 'Discount Coupons', link: '/admin/marketing/discount-coupons' },
          { name: 'Email Campaigns', link: '/admin/marketing/email-campaigns' },
          { name: 'Social Media', link: '/admin/marketing/social-media' },
          { name: 'Affiliate Program', link: '/admin/marketing/affiliate-program' },
        ],
      },
      {
        name: 'Reports',
        icon: <ChartBarIcon className="h-5 w-5" />,
        items: [
          { name: 'Sales Reports', link: '/admin/reports/sales-reports' },
          { name: 'Customer Reports', link: '/admin/reports/customer-reports' },
          { name: 'Inventory Reports', link: '/admin/reports/inventory-reports' },
          { name: 'Channel Payments', link: '/admin/reports/channelpayment-reports' },
          { name: 'Tax Reports', link: '/admin/reports/tax-reports' },
        ],
      },
      {
        name: 'Settings',
        icon: <CogIcon className="h-5 w-5" />,
        items: [
          { name: 'Store Settings', link: '/admin/settings/store' },
          { name: 'Payment Methods', link: '/admin/settings/payment-method' },
          { name: 'Shipping Options', link: '/admin/settings/shipping-options' },
          { name: 'Tax Settings', link: '/admin/settings/tax' },
          { name: 'Staff Accounts', link: '/admin/settings/staff' },
        ],
      },
    ],
    []
  );

  const items: NavItem[] = navItems.length > 0 ? navItems : defaultNavItems;

  // Persist State
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      dispatch({ type: 'RESTORE_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'sidebarState',
      JSON.stringify({
        isCollapsed: state.isCollapsed,
        expandedSections: state.expandedSections,
      })
    );
  }, [state.isCollapsed, state.expandedSections]);

  // Update Active Item
  useEffect(() => {
    const currentPath: string = location.pathname;
    let newActiveItem: string = 'Dashboard';
    items.forEach((item: NavItem) => {
      if (item.items?.some((subItem) => subItem.link === currentPath)) {
        newActiveItem =
          item.items.find((subItem) => subItem.link === currentPath)?.name ||
          item.name;
      }
    });
    dispatch({ type: 'SET_ACTIVE_ITEM', payload: newActiveItem });
  }, [location, items]);

  // Handlers
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' });
  }, []);

  const toggleSection = useCallback((sectionName: string) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: sectionName });
  }, []);

  const handleItemHover = useCallback(
    (item: NavItem) => {
      if (!state.isCollapsed) {
        dispatch({ type: 'SET_HOVERED_ITEM', payload: { item: null } });
        return;
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      const ref = itemRefs.current[item.name];
      if (ref) {
        const rect = ref.getBoundingClientRect();
        dispatch({
          type: 'SET_HOVERED_ITEM',
          payload: {
            item,
            position: { top: rect.top, left: rect.right + 5 },
          },
        });
      }
    },
    [state.isCollapsed]
  );

  const handleItemLeave = useCallback(() => {
    if (isHoverCardHovered) return;
    leaveTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'SET_HOVERED_ITEM', payload: { item: null } });
    }, 200);
  }, [isHoverCardHovered]);

  const handleHoverCardEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHoverCardHovered(true);
  }, []);

  const handleHoverCardLeave = useCallback(() => {
    setIsHoverCardHovered(false);
    leaveTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'SET_HOVERED_ITEM', payload: { item: null } });
    }, 200);
  }, []);

  const handleItemClick = useCallback((itemName: string) => {
    dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemName });
    dispatch({ type: 'SET_HOVERED_ITEM', payload: { item: null } });
    dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' });
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (item.items && !state.isCollapsed) {
          toggleSection(item.name);
        } else if (item.items?.[0]) {
          handleItemClick(item.items[0].name);
        } else {
          handleItemClick(item.name);
        }
      }
    },
    [state.isCollapsed, toggleSection, handleItemClick]
  );

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout(authToken as string);
      if (response.id) {
        toast.success('Logged out successfully');
        dispatch({ type: 'SET_LOGOUT_MODAL', payload: false });
        localStorage.removeItem('authToken');
        navigate('/auth/login');
      } 
    } catch (error) {

    }

  }, [navigate]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' });
        dispatch({ type: 'SET_HOVERED_ITEM', payload: { item: null } });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup Timeout on Unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Theme Classes
  const themeClasses: ThemeClasses = useMemo(
    () => ({
      sidebar:
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
          : 'bg-white text-gray-900 border-r border-gray-200',
      hoverCard:
        theme === 'dark'
          ? 'bg-gray-800 text-gray-100 border-gray-700/50'
          : 'bg-white text-gray-900 border-gray-200',
      button:
        theme === 'dark'
          ? 'hover:bg-gray-700/50 text-gray-300'
          : 'hover:bg-gray-100 text-gray-600',
      activeItem:
        theme === 'dark'
          ? 'bg-indigo-900/50 text-indigo-300'
          : 'bg-indigo-100 text-indigo-700',
      subItem:
        theme === 'dark'
          ? 'text-gray-400 hover:bg-indigo-900/30 hover:text-white'
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
    }),
    [theme]
  );

  // Focus Management for Accessibility
  useEffect(() => {
    items.forEach((item: NavItem) => {
      if (state.expandedSections[item.name] && item.items?.[0]) {
        const firstSubItem = document.querySelector(
          `[data-testid="sub-nav-item-${item.items[0].name.toLowerCase().replace(/\s/g, '-')}"`
        );
        if (firstSubItem instanceof HTMLElement) {
          firstSubItem.focus();
        }
      }
    });
  }, [state.expandedSections, items]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Backdrop */}
      {state.isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={state.isMobileOpen}
        data-testid="mobile-toggle"
      >
        {state.isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        ref={setSidebarRef}
        className={`fixed inset-y-0 left-0 ${themeClasses.sidebar} shadow-2xl z-40 transition-transform duration-300 ease-in-out ${state.isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        variants={sidebarVariants}
        animate={state.isCollapsed ? 'collapsed' : 'expanded'}
        role="navigation"
        aria-label="Main navigation"
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Collapse Button */}
          <div className="flex items-center justify-between mb-6">
            {!state.isCollapsed && (
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-300">Admin Panel</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-full ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              aria-label={state.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              data-testid="collapse-toggle"
            >
              {state.isCollapsed ? (
                <ChevronDoubleRightIcon className="h-5 w-5" />
              ) : (
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <ul className="space-y-1">
              {items.map((item: NavItem) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={
                    state.activeItem === item.name ||
                    (item.items?.some((subItem) => subItem.name === state.activeItem) ?? false)
                  }
                  activeItem={state.activeItem}
                  isCollapsed={state.isCollapsed}
                  expandedSections={state.expandedSections}
                  themeClasses={themeClasses}
                  onHover={handleItemHover}
                  onLeave={handleItemLeave}
                  onClick={handleItemClick}
                  onKeyDown={handleKeyDown}
                  onToggleSection={toggleSection}
                  itemRef={(el) => (itemRefs.current[item.name] = el)}
                />
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="mt-auto">
            <div
              className={`flex items-center p-3 rounded-lg ${themeClasses.button} cursor-pointer transition-all ${state.isCollapsed ? 'justify-center' : 'justify-between'
                }`}
              data-testid="user-profile"
            >
              <div className="flex items-center">
                <img
                  src={user?.email}
                  alt="User profile"
                  className="h-9 w-9 rounded-full border-2 border-indigo-500/50 shadow-sm"
                />
                {!state.isCollapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-200">{user?.username}</p>
                    <p className="text-xs text-gray-400">{user?.username}</p>
                  </div>
                )}
              </div>
              {!state.isCollapsed && (
                <button
                  onClick={() => dispatch({ type: 'SET_LOGOUT_MODAL', payload: true })}
                  className={`p-1 rounded-full ${themeClasses.button}`}
                  aria-label="Log out"
                  data-testid="logout-button"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hover Card */}
      <AnimatePresence>
        {state.isCollapsed && state.hoveredItem && (
          <HoverCard
            item={state.hoveredItem}
            position={state.hoverPosition}
            activeItem={state.activeItem}
            themeClasses={themeClasses}
            onClick={handleItemClick}
            onHoverCardEnter={handleHoverCardEnter}
            onHoverCardLeave={handleHoverCardLeave}
          />
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {state.showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-labelledby="logout-modal-title"
            aria-modal="true"
            data-testid="logout-modal"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h2 id="logout-modal-title" className="text-xl font-bold mb-4">
                Confirm Logout
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => dispatch({ type: 'SET_LOGOUT_MODAL', payload: false })}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  aria-label="Cancel logout"
                  data-testid="cancel-logout"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  aria-label="Confirm logout"
                  data-testid="confirm-logout"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${state.isCollapsed ? 'md:ml-[4.5rem]' : 'md:ml-64'
          }`}
      >
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{state.activeItem}</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64 text-sm"
                  aria-label="Search"
                  data-testid="search-input"
                />
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Notifications"
                data-testid="notifications"
              >
                <BellIcon className="h-6 w-6 text-gray-500" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Help"
                data-testid="help"
              >
                <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Error Boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 text-red-500">Error: {this.state.error.message}</div>
      );
    }
    return this.props.children;
  }
}

export { Sidebar, ErrorBoundary };
export default Sidebar;