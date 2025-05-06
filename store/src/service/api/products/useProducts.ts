import { useEffect, useState } from "react"

const useProdusts = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const results = await fetchFunction();
            setData(results);
        } catch (error) {
            // @ts-ignore
            console.log('errors:',error)
            setErrors(error instanceof Error ? error : new Error('An error occurred'))
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setData(null);
        setLoading(false);
        setErrors(null);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [])
    return { data, loading, errors, refetch: fetchData, reset }
}

export default useProdusts;