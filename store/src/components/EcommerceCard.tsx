import { Card, Typography, Button, CardHeader, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import { HeartIcon, EyeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import FeaturedImageGallery from "./DialogWithImage";

interface EcommerceCardProps {
    image: string;
    title?: string;
    price?: string;
    description?: string;
    category?: string;
    rating?: number;
}

export default function EcommerceCard({
    image,
    title = "Apple AirPods",
    price = "$95.00",
    description = "With plenty of talk and listen time.",
    category = "Electronics",
    rating = 4.5
}: EcommerceCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(!openModal);

    return (
        <>
            <Card
                className="w-full max-w-[300px] mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        className="rounded-xl h-64 overflow-hidden"
                    >
                        <img
                            alt={title}
                            src={image}
                            className="h-64 w-auto rounded-lg object-cover object-center"
                        />
                        {isHovered && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center gap-4">
                                <IconButton
                                    variant="gradient"
                                    color="primary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenModal();
                                    }}
                                >
                                    <EyeIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton
                                    variant="gradient"
                                    color="primary"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFavorite(!isFavorite);
                                    }}
                                >
                                    {isFavorite ? (
                                        <SolidHeartIcon className="h-4 w-4 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-4 w-4" />
                                    )}
                                </IconButton>
                            </div>
                        )}
                    </CardHeader>
                    {isHovered && (
                        <Button
                            variant="gradient"
                            color="primary"
                            size="sm"
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ShoppingBagIcon className="h-4 w-4" />
                            Add to Cart
                        </Button>
                    )}
                </div>

                <CardBody className="p-4">
                    <Typography variant="small" color="primary" className="mb-1">
                        {category}
                    </Typography>
                    <div className="flex items-center justify-between mb-2">
                        <Typography variant="h5" className="font-medium">
                            {title}
                        </Typography>
                        <Typography variant="h5" color="primary">
                            {price}
                        </Typography>
                    </div>
                    <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <Typography variant="small" color="primary" className="ml-1">
                            ({rating})
                        </Typography>
                    </div>
                    <Typography variant="paragraph" color="primary" className="text-sm">
                        {description}
                    </Typography>
                </CardBody>

                <CardFooter className="pt-0 px-4 pb-4">
                    <Button
                        variant="gradient"
                        color="primary"
                        className="flex items-center justify-center gap-2"
                    >
                        <ShoppingBagIcon className="h-4 w-4" />
                        Add to Cart
                    </Button>
                </CardFooter>
            </Card>

            {/* Image Modal */}
            <dialog open={openModal} onClose={handleOpenModal} className="bg-transparent">
                <div className="fixed inset-0 bg-black/50 z-40" onClick={handleOpenModal} />
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{title}</h3>
                            <button
                                onClick={handleOpenModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-auto max-h-[80vh]">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-auto object-contain max-h-[70vh]"
                            />
                            <FeaturedImageGallery />
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-semibold">{price}</span>
                            <Button
                                variant="gradient"
                                color="primary"
                                className="flex items-center gap-2"
                            >
                                <ShoppingBagIcon className="h-4 w-4" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}