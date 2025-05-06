// import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    isLoading?: boolean;
    asChild?: boolean;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, isLoading = true, asChild = false, ...props }, ref) => {
        if (!isLoading && asChild) {
            return <div ref={ref} className={className} {...props} />;
        }

        if (!isLoading) {
            return null;
        }

        return (
            <div
                ref={ref} className= "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
                {...props}
            />
        );
    }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };