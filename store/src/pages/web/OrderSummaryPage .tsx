import React from 'react';
import {
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    Home as AddressIcon,
    CheckCircle as CheckIcon,
    AccessTime as ProcessingIcon,
    LocalMall as PackedIcon,
    DirectionsCar as ShippedIcon,
    AssignmentTurnedIn as DeliveredIcon
} from '@mui/icons-material';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    Typography
} from '@mui/material';

const OrderSummaryPage = () => {
    // Order data
    const order = {
        id: "ORD-2023-45678",
        date: "October 15, 2023",
        status: "shipped", // processing, packed, shipped, delivered
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
        shipping: {
            name: "John Doe",
            address: "123 Main Street, Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
            phone: "+1 (555) 123-4567"
        },
        payment: {
            method: "Credit Card",
            card: "VISA **** **** **** 4242",
            billingAddress: "Same as shipping address"
        },
        summary: {
            subtotal: 499.97,
            shipping: 9.99,
            tax: 39.99,
            discount: -50.00,
            total: 499.95
        }
    };

    // Order status steps
    const statusSteps = [
        { label: 'Processing', icon: <ProcessingIcon /> },
        { label: 'Packed', icon: <PackedIcon /> },
        { label: 'Shipped', icon: <ShippedIcon /> },
        { label: 'Delivered', icon: <DeliveredIcon /> }
    ];

    // Get current step based on order status
    const getActiveStep = () => {
        switch (order.status) {
            case 'processing': return 0;
            case 'packed': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 0;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Order Header */}
            <div className="mb-8">
                <Typography variant="h4" className="font-bold mb-2">
                    Order Summary
                </Typography>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Typography variant="body1" className="text-gray-600 mb-2 sm:mb-0">
                        Order #: <span className="font-semibold">{order.id}</span>
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                        Date: <span className="font-semibold">{order.date}</span>
                    </Typography>
                </div>
            </div>

            {/* Order Status Stepper */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <Stepper activeStep={getActiveStep()} alternativeLabel>
                        {statusSteps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    icon={step.icon}
                                    className={index <= getActiveStep() ? 'text-green-500' : 'text-gray-400'}
                                >
                                    <Typography
                                        variant="body2"
                                        className={index <= getActiveStep() ? 'font-semibold' : 'text-gray-500'}
                                    >
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {order.status === 'shipped' && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <Typography variant="body1" className="font-semibold mb-2">
                                Your order is on the way!
                            </Typography>
                            <Typography variant="body2">
                                Expected delivery date: <span className="font-semibold">October 20, 2023</span>
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Grid container spacing={4}>
                {/* Order Details */}
                <Grid item xs={12} md={8}>
                    {/* Order Items */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-bold mb-4">
                                Order Items ({order.items.length})
                            </Typography>

                            <List>
                                {order.items.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem className="py-4">
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    src={item.image}
                                                    alt={item.name}
                                                    sx={{ width: 80, height: 80 }}
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
                                                            Qty: {item.quantity}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            <Typography variant="subtitle1" className="font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                        {index < order.items.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Shipping and Payment Info */}
                    <Grid container spacing={3}>
                        {/* Shipping Address */}
                        <Grid item xs={12} sm={6}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <ShippingIcon className="mr-2 text-blue-500" />
                                        <Typography variant="h6" className="font-bold">
                                            Shipping Information
                                        </Typography>
                                    </div>
                                    <Typography variant="body1" className="font-semibold mb-1">
                                        {order.shipping.name}
                                    </Typography>
                                    <Typography variant="body1" className="mb-1">
                                        {order.shipping.address}
                                    </Typography>
                                    <Typography variant="body1" className="mb-1">
                                        {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                                    </Typography>
                                    <Typography variant="body1" className="mb-1">
                                        {order.shipping.country}
                                    </Typography>
                                    <Typography variant="body1">
                                        Phone: {order.shipping.phone}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Payment Method */}
                        <Grid item xs={12} sm={6}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <PaymentIcon className="mr-2 text-green-500" />
                                        <Typography variant="h6" className="font-bold">
                                            Payment Method
                                        </Typography>
                                    </div>
                                    <Typography variant="body1" className="font-semibold mb-2">
                                        {order.payment.method}
                                    </Typography>
                                    <Typography variant="body1" className="mb-2">
                                        {order.payment.card}
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.payment.billingAddress}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-bold mb-4">
                                Order Summary
                            </Typography>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">${order.summary.subtotal.toFixed(2)}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body1">Shipping:</Typography>
                                    <Typography variant="body1">${order.summary.shipping.toFixed(2)}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body1">Tax:</Typography>
                                    <Typography variant="body1">${order.summary.tax.toFixed(2)}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body1" className="text-green-600">
                                        Discount:
                                    </Typography>
                                    <Typography variant="body1" className="text-green-600">
                                        -${Math.abs(order.summary.discount).toFixed(2)}
                                    </Typography>
                                </div>
                            </div>

                            <Divider className="my-4" />

                            <div className="flex justify-between mb-6">
                                <Typography variant="h6" className="font-bold">
                                    Total:
                                </Typography>
                                <Typography variant="h6" className="font-bold">
                                    ${order.summary.total.toFixed(2)}
                                </Typography>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="py-3 mb-4"
                            >
                                Track Order
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                className="py-3"
                            >
                                Download Invoice
                            </Button>

                            {order.status === 'delivered' && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <CheckIcon className="mr-2 text-green-500" />
                                        <Typography variant="body1" className="font-semibold">
                                            Order Delivered
                                        </Typography>
                                    </div>
                                    <Typography variant="body2">
                                        Your order was delivered on October 18, 2023.
                                    </Typography>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        className="mt-2"
                                    >
                                        Leave a Review
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default OrderSummaryPage;