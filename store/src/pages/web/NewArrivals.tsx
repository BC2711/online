'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import GalleryWithTab from '../../components/Gallery'
import { Breadcrumb, Typography } from '@material-tailwind/react'
import { useSearchParams } from 'react-router-dom'

interface SortOption {
    name: string;
    href: string;
    current: boolean;
}

interface SubCategory {
    name: string;
    href: string;
}

interface FilterOption {
    value: string;
    label: string;
    checked: boolean;
}

interface FilterSection {
    id: string;
    name: string;
    options: FilterOption[];
}

interface ImageData {
    imageLink: string;
    title: string;
    price: string;
    category: string;
}

interface TabData {
    label: string;
    value: string;
    images: ImageData[];
}

const sortOptions: SortOption[] = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]

const subCategories: SubCategory[] = [
    { name: 'Totes', href: '#' },
    { name: 'Backpacks', href: '#' },
    { name: 'Travel Bags', href: '#' },
    { name: 'Hip Bags', href: '#' },
    { name: 'Laptop Sleeves', href: '#' },
]

const filters: FilterSection[] = [
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: 'white', label: 'White', checked: false },
            { value: 'beige', label: 'Beige', checked: false },
            { value: 'blue', label: 'Blue', checked: true },
            { value: 'brown', label: 'Brown', checked: false },
            { value: 'green', label: 'Green', checked: false },
            { value: 'purple', label: 'Purple', checked: false },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'New Arrivals', checked: false },
            { value: 'sale', label: 'Sale', checked: false },
            { value: 'travel', label: 'Travel', checked: true },
            { value: 'organization', label: 'Organization', checked: false },
            { value: 'accessories', label: 'Accessories', checked: false },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: '2l', label: '2L', checked: false },
            { value: '6l', label: '6L', checked: false },
            { value: '12l', label: '12L', checked: false },
            { value: '18l', label: '18L', checked: false },
            { value: '20l', label: '20L', checked: false },
            { value: '40l', label: '40L', checked: true },
        ],
    },
]

function classNames(...classes: (string | boolean)[]): string {
    return classes.filter(Boolean).join(' ')
}

const data: TabData[] = [
    {
        label: "All New Arrivals",
        value: "new-arrivals",
        images: [
            {
                imageLink: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
                title: "Summer Collection",
                price: "$49.99",
                category: "New Arrivals"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
                title: "Casual Outfit",
                price: "$39.99",
                category: "New Arrivals"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
                title: "Street Style",
                price: "$59.99",
                category: "New Arrivals"
            },
            {
                imageLink: "https://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog5.jpg",
                title: "Premium Jacket",
                price: "$89.99",
                category: "New Arrivals"
            },
            {
                imageLink: "https://material-taillwind-pro-ct-tailwind-team.vercel.app/img/content2.jpg",
                title: "Designer Dress",
                price: "$79.99",
                category: "New Arrivals"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1620064916958-605375619af8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1493&q=80",
                title: "Elegant Blouse",
                price: "$45.99",
                category: "New Arrivals"
            },
        ],
    },
    {
        label: "Tees",
        value: "tees",
        images: [
            {
                imageLink: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                title: "Classic Tee",
                price: "$29.99",
                category: "T-Shirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                title: "Graphic Tee",
                price: "$34.99",
                category: "T-Shirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
                title: "Vintage Tee",
                price: "$39.99",
                category: "T-Shirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
                title: "Oversized Tee",
                price: "$32.99",
                category: "T-Shirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
                title: "Pocket Tee",
                price: "$27.99",
                category: "T-Shirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
                title: "Long Sleeve Tee",
                price: "$36.99",
                category: "T-Shirts"
            },
        ],
    },
    {
        label: "Crewnecks",
        value: "crewnecks",
        images: [
            {
                imageLink: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
                title: "Classic Crewneck",
                price: "$59.99",
                category: "Sweaters"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
                title: "Oversized Crewneck",
                price: "$64.99",
                category: "Sweaters"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
                title: "Graphic Crewneck",
                price: "$69.99",
                category: "Sweaters"
            },
            {
                imageLink: "https://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog5.jpg",
                title: "Premium Crewneck",
                price: "$79.99",
                category: "Sweaters"
            },
            {
                imageLink: "https://material-taillwind-pro-ct-tailwind-team.vercel.app/img/content2.jpg",
                title: "Designer Crewneck",
                price: "$89.99",
                category: "Sweaters"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1620064916958-605375619af8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1493&q=80",
                title: "Vintage Crewneck",
                price: "$54.99",
                category: "Sweaters"
            },
        ],
    },
    {
        label: "Sweatshirts",
        value: "sweatshirts",
        images: [
            {
                imageLink: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                title: "Classic Sweatshirt",
                price: "$49.99",
                category: "Sweatshirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                title: "Hooded Sweatshirt",
                price: "$59.99",
                category: "Sweatshirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
                title: "Zip-Up Sweatshirt",
                price: "$64.99",
                category: "Sweatshirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
                title: "Oversized Sweatshirt",
                price: "$54.99",
                category: "Sweatshirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
                title: "Graphic Sweatshirt",
                price: "$59.99",
                category: "Sweatshirts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
                title: "Premium Sweatshirt",
                price: "$69.99",
                category: "Sweatshirts"
            },
        ],
    },
    {
        label: "Pants & Shorts",
        value: "pants-shorts",
        images: [
            {
                imageLink: "https://demos.creative-tim.com/material-kit-pro/assets/img/examples/blog5.jpg",
                title: "Classic Chinos",
                price: "$59.99",
                category: "Pants"
            },
            {
                imageLink: "https://material-taillwind-pro-ct-tailwind-team.vercel.app/img/content2.jpg",
                title: "Denim Jeans",
                price: "$69.99",
                category: "Pants"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1620064916958-605375619af8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1493&q=80",
                title: "Casual Shorts",
                price: "$39.99",
                category: "Shorts"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
                title: "Athletic Pants",
                price: "$54.99",
                category: "Pants"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
                title: "Linen Pants",
                price: "$49.99",
                category: "Pants"
            },
            {
                imageLink: "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
                title: "Cargo Shorts",
                price: "$44.99",
                category: "Shorts"
            },
        ],
    },
];

export default function NewArrivals() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [useSearchParam] = useSearchParams();
    const gender = useSearchParam.get('gender');

    let genderType;
    if (gender === 'women') {
        genderType = gender;
    }

    return (
        <div className="bg-white">
            {/* Mobile filter dialog */}
            <Dialog
                open={mobileFiltersOpen}
                onClose={setMobileFiltersOpen}
                className="relative z-40 lg:hidden"
            >
                <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-25" />

                <div className="fixed inset-0 z-40 flex">
                    <Transition
                        show={mobileFiltersOpen}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4 border-t border-gray-200">
                                <h3 className="sr-only">Categories</h3>
                                <ul className="px-2 py-3 font-medium text-gray-900">
                                    {subCategories.map((category) => (
                                        <li key={category.name}>
                                            <a href={category.href} className="block px-2 py-3">
                                                {category.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                {filters.map((section) => (
                                    <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-mx-2 -my-3 flow-root">
                                                    <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" />
                                                            )}
                                                        </span>
                                                    </DisclosureButton>
                                                </h3>
                                                <DisclosurePanel className="pt-6">
                                                    <div className="space-y-6">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    defaultValue={option.value}
                                                                    type="checkbox"
                                                                    defaultChecked={option.checked}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </DisclosurePanel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>
                        </DialogPanel>
                    </Transition>
                </div>
            </Dialog>
            <main className="mx-auto max-w-7xl px-4 pt-3 pb-10 sm:px-6 lg:px-8">
                <Breadcrumb className='uppercase'>
                    <Breadcrumb.Link href="/docs">{gender}</Breadcrumb.Link>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Link href="/docs/components/breadcrumb">
                        New Arrivals
                    </Breadcrumb.Link>
                </Breadcrumb>
                <div className="flex items-baseline justify-between border-b border-gray-200 pt-18 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                    <div className="flex items-center">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Sort
                                    <ChevronDownIcon
                                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                    />
                                </MenuButton>
                            </div>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                {({ active }) => (
                                                    <a
                                                        href={option.href}
                                                        className={classNames(
                                                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        {option.name}
                                                    </a>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Transition>
                        </Menu>

                        <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                            <span className="sr-only">View grid</span>
                            <Squares2X2Icon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                        >
                            <span className="sr-only">Filters</span>
                            <FunnelIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <section aria-labelledby="products-heading" className="pt-6 pb-24">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters */}
                        <form className="hidden lg:block">
                            <h3 className="sr-only">Categories</h3>
                            <Typography>Categories:</Typography>
                            {/* <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                                {subCategories.map((category) => (
                                    <li key={category.name}>
                                        <a href={category.href}>{category.name}</a>
                                    </li>
                                ))}
                            </ul> */}

                            {filters.map((section) => (
                                <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                                    {({ open }) => (
                                        <>
                                            <h3 className="-my-3 flow-root">
                                                <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <span className="font-medium text-gray-900">{section.name}</span>
                                                    <span className="ml-6 flex items-center">
                                                        {open ? (
                                                            <MinusIcon className="h-5 w-5" />
                                                        ) : (
                                                            <PlusIcon className="h-5 w-5" />
                                                        )}
                                                    </span>
                                                </DisclosureButton>
                                            </h3>
                                            <DisclosurePanel className="pt-6">
                                                <div className="space-y-4">
                                                    {section.options.map((option, optionIdx) => (
                                                        <div key={option.value} className="flex items-center">
                                                            <input
                                                                id={`filter-${section.id}-${optionIdx}`}
                                                                name={`${section.id}[]`}
                                                                defaultValue={option.value}
                                                                type="checkbox"
                                                                defaultChecked={option.checked}
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <label
                                                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                className="ml-3 text-sm text-gray-600"
                                                            >
                                                                {option.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </DisclosurePanel>
                                        </>
                                    )}
                                </Disclosure>
                            ))}
                        </form>

                        {/* Product grid */}
                        <div className="lg:col-span-3">
                            <GalleryWithTab data={data} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}