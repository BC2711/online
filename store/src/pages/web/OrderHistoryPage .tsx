import React, { useState } from 'react';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as DeliveredIcon,
    Cancel as CancelledIcon,
    AccessTime as ProcessingIcon,
    FilterList as FilterIcon,
    Sort as SortIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { format } from 'date-fns';

// Define types
type OrderStatus = 'delivered' | 'processing' | 'cancelled';
type SortOption = 'date-desc' | 'date-asc' | 'total-desc' | 'total-asc';

interface OrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
}

interface Order {
    id: string;
    date: Date;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    trackingNumber: string | null;
}

// StatusChip component props
interface StatusChipProps {
    status: OrderStatus;
}

const OrderHistoryPage: React.FC = () => {
    // Sample order data
    const orders: Order[] = [
        {
            id: "ORD-2023-45678",
            date: new Date(2023, 9, 15),
            status: "delivered",
            items: [
                {
                    id: "PROD-123",
                    name: "Wireless Bluetooth Headphones",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 99.99,
                    quantity: 1,
                    color: "Black"
                },
                {
                    id: "PROD-456",
                    name: "Smart Watch Series 5",
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 199.99,
                    quantity: 2,
                    color: "Silver"
                }
            ],
            total: 499.95,
            trackingNumber: "TRK123456789"
        },
        {
            id: "ORD-2023-34567",
            date: new Date(2023, 8, 22),
            status: "cancelled",
            items: [
                {
                    id: "PROD-789",
                    name: "Wireless Charging Pad",
                    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 29.99,
                    quantity: 3,
                    color: "White"
                }
            ],
            total: 89.97,
            trackingNumber: null
        },
        {
            id: "ORD-2023-23456",
            date: new Date(2023, 7, 5),
            status: "delivered",
            items: [
                {
                    id: "PROD-321",
                    name: "Bluetooth Speaker",
                    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 59.99,
                    quantity: 1,
                    color: "Blue"
                },
                {
                    id: "PROD-654",
                    name: "Phone Case",
                    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 19.99,
                    quantity: 1,
                    color: "Black"
                }
            ],
            total: 79.98,
            trackingNumber: "TRK987654321"
        },
        {
            id: "ORD-2023-12345",
            date: new Date(2023, 6, 18),
            status: "processing",
            items: [
                {
                    id: "PROD-987",
                    name: "Fitness Tracker",
                    image: "https://images.unsplash.com/photo-1551649001-7a2485554199?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    price: 79.99,
                    quantity: 1,
                    color: "Pink"
                }
            ],
            total: 79.99,
            trackingNumber: null
        }
    ];

    // State
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
    const [anchorElSort, setAnchorElSort] = useState<null | HTMLElement>(null);

    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => {
            if (filterStatus !== 'all' && order.status !== filterStatus) return false;
            if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'date-desc': return b.date.getTime() - a.date.getTime();
                case 'date-asc': return a.date.getTime() - b.date.getTime();
                case 'total-desc': return b.total - a.total;
                case 'total-asc': return a.total - b.total;
                default: return 0;
            }
        });

    // Pagination
    const ordersPerPage = 3;
    const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice(
        (page - 1) * ordersPerPage,
        page * ordersPerPage
    );

    // Handlers
    const handleExpandOrder = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElFilter(event.currentTarget);
    };

    const handleFilterClose = (status: string) => {
        setFilterStatus(status);
        setAnchorElFilter(null);
        setPage(1);
    };

    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElSort(event.currentTarget);
    };

    const handleSortClose = (option: SortOption) => {
        setSortOption(option);
        setAnchorElSort(null);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Status chip component
    const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
        const statusConfig = {
            delivered: { icon: <DeliveredIcon fontSize="small" />, color: "success" as const, label: "Delivered" },
            processing: { icon: <ProcessingIcon fontSize="small" />, color: "info" as const, label: "Processing" },
            cancelled: { icon: <CancelledIcon fontSize="small" />, color: "error" as const, label: "Cancelled" }
        };

        return (
            <Chip
                icon={statusConfig[status].icon}
                label={statusConfig[status].label}
                color={statusConfig[status].color}
                variant="outlined"
                size="small"
            />
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <Typography variant="h4" className="font-bold mb-2">
                    Order History
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                    View and manage your past orders
                </Typography>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <TextField
                        placeholder="Search by order ID..."
                        variant="outlined"
                        size="small"
                        className="w-full md:w-64"
                        InputProps={{
                            startAdornment: <SearchIcon className="text-gray-400 mr-2" />
                        }}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={handleFilterClick}
                        >
                            Filter: {filterStatus === 'all' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<SortIcon />}
                            onClick={handleSortClick}
                        >
                            Sort: {sortOption === 'date-desc' ? 'Newest' :
                                sortOption === 'date-asc' ? 'Oldest' :
                                    sortOption === 'total-desc' ? 'Highest Total' : 'Lowest Total'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Filter Menu */}
            <Menu
                anchorEl={anchorElFilter}
                open={Boolean(anchorElFilter)}
                onClose={() => handleFilterClose(filterStatus)}
            >
                <MenuItem onClick={() => handleFilterClose('all')} selected={filterStatus === 'all'}>
                    All Orders
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('delivered')} selected={filterStatus === 'delivered'}>
                    Delivered
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('processing')} selected={filterStatus === 'processing'}>
                    Processing
                </MenuItem>
                <MenuItem onClick={() => handleFilterClose('cancelled')} selected={filterStatus === 'cancelled'}>
                    Cancelled
                </MenuItem>
            </Menu>

            {/* Sort Menu */}
            <Menu
                anchorEl={anchorElSort}
                open={Boolean(anchorElSort)}
                onClose={() => handleSortClose(sortOption)}
            >
                <MenuItem onClick={() => handleSortClose('date-desc')} selected={sortOption === 'date-desc'}>
                    Newest First
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('date-asc')} selected={sortOption === 'date-asc'}>
                    Oldest First
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('total-desc')} selected={sortOption === 'total-desc'}>
                    Highest Total
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('total-asc')} selected={sortOption === 'total-asc'}>
                    Lowest Total
                </MenuItem>
            </Menu>

            {/* Orders List */}
            {paginatedOrders.length > 0 ? (
                <div className="space-y-4 mb-6">
                    {paginatedOrders.map((order) => (
                        <Accordion
                            key={order.id}
                            expanded={expandedOrder === order.id}
                            onChange={() => handleExpandOrder(order.id)}
                            className="shadow-sm"
                        >
                            <AccordionSummary
                                expandIcon={expandedOrder === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                aria-controls={`${order.id}-content`}
                                id={`${order.id}-header`}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1" className="font-semibold">
                                            Order #{order.id}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {format(order.date, 'MMM dd, yyyy')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <StatusChip status={order.status} />
                                    </Grid>
                                    <Grid item xs={6} sm={2} className="text-right sm:text-left">
                                        <Typography variant="body1">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4} className="text-right">
                                        <Typography variant="subtitle1" className="font-semibold">
                                            ${order.total.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="space-y-4">
                                    {/* Order Items */}
                                    <List>
                                        {order.items.map((item) => (
                                            <ListItem key={`${order.id}-${item.id}`} className="py-3">
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={item.image}
                                                        alt={item.name}
                                                        sx={{ width: 60, height: 60 }}
                                                        className="mr-4"
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" className="font-semibold">
                                                            {item.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" component="span" className="block">
                                                                Color: {item.color}
                                                            </Typography>
                                                            <Typography variant="body2" component="span" className="block">
                                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <Typography variant="subtitle1" className="font-semibold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>

                                    {/* Order Actions */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200">
                                        <div className="mb-4 sm:mb-0">
                                            {order.trackingNumber && (
                                                <div className="flex items-center">
                                                    <ShippingIcon className="text-blue-500 mr-2" />
                                                    <Typography variant="body2">
                                                        Tracking #: {order.trackingNumber}
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            {order.status === 'delivered' && (
                                                <Button variant="outlined" size="small">
                                                    Buy Again
                                                </Button>
                                            )}
                                            {order.status === 'delivered' && (
                                                <Button variant="outlined" size="small">
                                                    Return Item
                                                </Button>
                                            )}
                                            {order.status === 'processing' && (
                                                <Button variant="outlined" color="error" size="small">
                                                    Cancel Order
                                                </Button>
                                            )}
                                            <Button variant="outlined" size="small">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ) : (
                <Card className="py-12 text-center">
                    <Typography variant="h6" className="mb-2">
                        No orders found
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                        {filterStatus === 'all'
                            ? "You haven't placed any orders yet."
                            : `You don't have any ${filterStatus} orders.`}
                    </Typography>
                    <Button variant="contained" color="primary" className="mt-4">
                        Start Shopping
                    </Button>
                </Card>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;