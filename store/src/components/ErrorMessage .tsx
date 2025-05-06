import { AlertTriangle, RefreshCw } from "lucide-react";
// import { cn } from "@/lib/utils";
import { Button } from "@material-tailwind/react";

interface ErrorMessageProps {
    message: string;
    retryFn?: () => void;
}

export function ErrorMessage({
    message,
    retryFn,
}: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center" >
            <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
                Something went wrong
            </h3>
            <p className="mb-6 max-w-md text-gray-600">{message}</p>
            {retryFn && (
                <Button
                    variant="outline"
                    onClick={retryFn}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}