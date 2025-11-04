import { useState, useEffect } from "react";

export const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchdata = async () => {
        try{
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);

        }catch(err){
            setError(err as Error);
        }finally{
            setLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    };

    useEffect(() => {
        if(autoFetch){
            fetchdata();
        }
    },[]);

    return { data, loading, error, refetch: fetchdata, reset };
}