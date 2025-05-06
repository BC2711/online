import { JSX, useState } from 'react';
import {
    Star as StarIcon,
    StarHalf as StarHalfIcon,
    StarBorder as StarBorderIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Pagination,
    Rating,
    TextField,
    Typography
} from '@mui/material';
import ReactDOM from 'react-dom/client';

// Define types
interface Review {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    helpful: number;
    unhelpful: number;
    verified: boolean;
}

interface Product {
    name: string;
    price: number;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    colors: string[];
    inStock: boolean;
}

interface NewReview {
    rating: number;
    title: string;
    comment: string;
}

const ProductReviewPage = () => {
    // Product data
    const product: Product = {
        name: "Premium Wireless Headphones",
        price: 199.99,
        description: "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation and 30-hour battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviewCount: 128,
        colors: ["Black", "Silver", "Blue"],
        inStock: true
    };

    // Reviews data
    const initialReviews: Review[] = [
        {
            id: 1,
            user: "Alex Johnson",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 5,
            date: "2023-10-15",
            title: "Amazing sound quality!",
            comment: "These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is as advertised.",
            helpful: 24,
            unhelpful: 2,
            verified: true
        },
        {
            id: 2,
            user: "Sarah Miller",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 4,
            date: "2023-09-28",
            title: "Great headphones with minor issues",
            comment: "Sound quality is excellent, but the ear cushions could be more comfortable for long sessions.",
            helpful: 18,
            unhelpful: 5,
            verified: true
        },
        {
            id: 3,
            user: "David Wilson",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
            rating: 3,
            date: "2023-09-10",
            title: "Decent but overpriced",
            comment: "Good sound but not worth the premium price in my opinion. There are better options at this price point.",
            helpful: 10,
            unhelpful: 8,
            verified: false
        },
    ];

    // State
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [page, setPage] = useState<number>(1);
    const [newReview, setNewReview] = useState<NewReview>({
        rating: 0,
        title: "",
        comment: ""
    });
    const [activeFilter, setActiveFilter] = useState<string>("all");

    // Rating distribution
    const ratingDistribution: Record<number, number> = {
        5: 72,
        4: 32,
        3: 12,
        2: 8,
        1: 4
    };

    // Filter reviews
    const filteredReviews = activeFilter === "all"
        ? reviews
        : reviews.filter(review => {
            if (activeFilter === "5") return review.rating === 5;
            if (activeFilter === "4") return review.rating === 4;
            if (activeFilter === "3") return review.rating === 3;
            if (activeFilter === "2") return review.rating === 2;
            if (activeFilter === "1") return review.rating === 1;
            return true;
        });

    // Pagination
    const reviewsPerPage = 3;
    const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
    const paginatedReviews = filteredReviews.slice(
        (page - 1) * reviewsPerPage,
        page * reviewsPerPage
    );

    // Handlers
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const review: Review = {
            id: reviews.length + 1,
            user: "You",
            avatar: "",
            rating: newReview.rating,
            date: new Date().toISOString().split('T')[0],
            title: newReview.title,
            comment: newReview.comment,
            helpful: 0,
            unhelpful: 0,
            verified: true
        };
        setReviews([review, ...reviews]);
        setNewReview({ rating: 0, title: "", comment: "" });
        setPage(1);
    };

    const handleHelpful = (id: number) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, helpful: review.helpful + 1 } : review
        ));
    };

    const handleUnhelpful = (id: number) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, unhelpful: review.unhelpful + 1 } : review
        ));
    };

    // Render star rating
    const renderStars = (rating: number) => {
        const stars: JSX.Element[] = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<StarIcon key={i} className="text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<StarHalfIcon key={i} className="text-yellow-500" />);
            } else {
                stars.push(<StarBorderIcon key={i} className="text-yellow-500" />);
            }
        }

        return stars;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Header */}
            <div className="mb-8">
                <Typography variant="h4" className="font-bold mb-2">{product.name}</Typography>
                <div className="flex items-center mb-4">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
            </div>

            <Grid container spacing={4}>
                {/* Product Image and Info */}
                <Grid item xs={12} md={5}>
                    <Card className="h-full">
                        <CardContent className="flex flex-col items-center p-6">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full max-w-xs h-auto mb-6 rounded-lg"
                            />
                            <Typography variant="h5" className="font-bold mb-2">
                                ${product.price.toFixed(2)}
                            </Typography>
                            <Typography variant="body1" className="mb-4">
                                {product.description}
                            </Typography>
                            <div className="w-full mb-4">
                                <Typography variant="subtitle1" className="font-semibold mb-2">
                                    Available Colors:
                                </Typography>
                                <div className="flex space-x-2">
                                    {product.colors.map(color => (
                                        <Chip
                                            key={color}
                                            label={color}
                                            className="cursor-pointer"
                                            variant="outlined"
                                        />
                                    ))}
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className="w-full py-3"
                                disabled={!product.inStock}
                            >
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reviews Section */}
                <Grid item xs={12} md={7}>
                    <Card>
                        <CardContent className="p-6">
                            {/* Rating Summary */}
                            <div className="mb-8">
                                <Typography variant="h6" className="font-bold mb-4">
                                    Customer Reviews
                                </Typography>

                                <div className="flex flex-col md:flex-row items-center mb-6">
                                    <div className="flex items-center mb-4 md:mb-0 md:mr-8">
                                        <Typography variant="h2" className="font-bold mr-2">
                                            {product.rating}
                                        </Typography>
                                        <div>
                                            <div className="flex">{renderStars(product.rating)}</div>
                                            <Typography variant="body2" className="text-gray-600">
                                                {product.reviewCount} reviews
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center mb-1">
                                                <Button
                                                    size="small"
                                                    onClick={() => setActiveFilter(star.toString())}
                                                    className={`mr-2 ${activeFilter === star.toString() ? 'text-blue-500' : 'text-gray-500'}`}
                                                >
                                                    {star} star
                                                </Button>
                                                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-yellow-500 h-2.5 rounded-full"
                                                        style={{ width: `${(ratingDistribution[star] / product.reviewCount) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <Typography variant="body2" className="ml-2 text-gray-600">
                                                    {ratingDistribution[star]}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setActiveFilter("all")}
                                    className={activeFilter === "all" ? 'bg-blue-50' : ''}
                                >
                                    All Reviews
                                </Button>
                            </div>

                            <Divider className="my-6" />

                            {/* Review List */}
                            <div className="mb-8">
                                {paginatedReviews.length > 0 ? (
                                    paginatedReviews.map((review) => (
                                        <div key={review.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                                            <div className="flex items-start mb-2">
                                                <Avatar src={review.avatar} alt={review.user} className="mr-3" />
                                                <div>
                                                    <div className="flex items-center">
                                                        <Typography variant="subtitle1" className="font-semibold mr-2">
                                                            {review.user}
                                                        </Typography>
                                                        {review.verified && (
                                                            <CheckCircleIcon className="text-blue-500" fontSize="small" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Rating
                                                            value={review.rating}
                                                            readOnly
                                                            size="small"
                                                            className="mr-2"
                                                        />
                                                        <Typography variant="body2" className="text-gray-500">
                                                            {review.date}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                            <Typography variant="h6" className="font-semibold mb-1">
                                                {review.title}
                                            </Typography>
                                            <Typography variant="body1" className="mb-3">
                                                {review.comment}
                                            </Typography>
                                            <div className="flex items-center">
                                                <Typography variant="body2" className="text-gray-500 mr-4">
                                                    Was this helpful?
                                                </Typography>
                                                <Button
                                                    startIcon={<ThumbUpIcon fontSize="small" />}
                                                    size="small"
                                                    onClick={() => handleHelpful(review.id)}
                                                    className="mr-2"
                                                >
                                                    {review.helpful}
                                                </Button>
                                                <Button
                                                    startIcon={<ThumbDownIcon fontSize="small" />}
                                                    size="small"
                                                    onClick={() => handleUnhelpful(review.id)}
                                                >
                                                    {review.unhelpful}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <Typography variant="body1" className="text-center py-8">
                                        No reviews match your selected filter.
                                    </Typography>
                                )}

                                {pageCount > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <Pagination
                                            count={pageCount}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </div>
                                )}
                            </div>

                            <Divider className="my-6" />

                            {/* Review Form */}
                            <div>
                                <Typography variant="h6" className="font-bold mb-4">
                                    Write a Review
                                </Typography>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="mb-4">
                                        <Typography variant="subtitle1" className="mb-2">
                                            Your Rating *
                                        </Typography>
                                        <Rating
                                            name="rating"
                                            value={newReview.rating}
                                            onChange={(event:any, newValue:any) => {
                                                setNewReview({ ...newReview, rating: newValue || 0 });
                                            }}
                                            precision={0.5}
                                            size="large"
                                            required
                                        />
                                    </div>
                                    <TextField
                                        label="Review Title"
                                        variant="outlined"
                                        fullWidth
                                        className="mb-4"
                                        value={newReview.title}
                                        onChange={(e:any) => setNewReview({ ...newReview, title: e.target.value })}
                                        required
                                    />
                                    <TextField
                                        label="Your Review"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        className="mb-4"
                                        value={newReview.comment}
                                        onChange={(e:any) => setNewReview({ ...newReview, comment: e.target.value })}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                    >
                                        Submit Review
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProductReviewPage;
export const root = ReactDOM.createRoot(document.getElementById('root'));
