import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface UseFetchReturnType<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export const useFetch = <T>(url: string): UseFetchReturnType<T> => {
    const { toast } = useToast();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        setData(null);
        setError(null);

        apiClient(url)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err);
                toast({
                    title: "Error occured!",
                    description: `${err}`,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url]);

    return { data, loading, error };
};
