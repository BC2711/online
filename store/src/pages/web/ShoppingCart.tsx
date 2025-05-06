import { useState } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    size?: string;
}

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Basic Tee',
            price: 35.00,
            quantity: 1,
            image: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
            color: 'Black',
            size: 'M'
        },
        {
            id: '2',
            name: 'Artwork Tee',
            price: 45.00,
            quantity: 2,
            image: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
            color: 'White',
            size: 'L'
        }
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                    Shopping Cart
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Cart items */}
                    <div className="lg:col-span-7">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <h2 className="text-lg font-medium text-gray-900">Your cart is empty</h2>
                                <p className="mt-1 text-gray-500">Start shopping to add items to your cart</p>
                                <Link
                                    to="/products"
                                    className="mt-6 inline-block rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex py-6 sm:py-10">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                                            <div className="flex justify-between">
                                                <div className="pr-6">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                                                    </h3>
                                                    {item.color && (
                                                        <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>
                                                    )}
                                                    {item.size && (
                                                        <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                                                    )}
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ZMK {item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-1 items-end justify-between">
                                                <div className="flex items-center">
                                                    <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                                        Quantity
                                                    </label>
                                                    <select
                                                        id={`quantity-${item.id}`}
                                                        name={`quantity-${item.id}`}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        className="rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        <span>Remove</span>
                                                    </button>
                                                </div>

                                                <div className="flex">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ZMK {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Order summary */}
                    <div className="mt-10 lg:col-span-5 lg:mt-0">
                        <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
                            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Subtotal</p>
                                    <p className="text-sm font-medium text-gray-900">ZMK {subtotal.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <p className="text-sm text-gray-600">Shipping estimate</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {shipping === 10 ? 'Free' : `ZMK ${shipping.toFixed(2)}`}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <p className="text-sm text-gray-600">Tax estimate</p>
                                    <p className="text-sm font-medium text-gray-900">ZMK {tax.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <p className="text-base font-medium text-gray-900">Order total</p>
                                    <p className="text-base font-medium text-gray-900">ZMK {total.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    disabled={cartItems.length === 0}
                                    className={`w-full rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${cartItems.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                        }`}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="mt-6 text-center text-sm text-gray-500">
                                <p>
                                    or{' '}
                                    <Link
                                        to="/products"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}