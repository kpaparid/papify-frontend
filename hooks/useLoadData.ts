import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
export interface UseLoadDataType<T> {
    data: T | null;      // data could be null initially
    loading: boolean;
    error: any;
    success: boolean;
    customFetch: (fetchFn: Function) => Promise<void>;
    fetchData : () => Promise<void>;
  }
  export function useLoadData<T>(fetchFn: () => Promise<T> | undefined, onSuccess?: Function, onError?: Function): UseLoadDataType<T> {
//   export function useLoadData(fetchFn: Function, onSuccess?: Function, onError?: Function) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const success = !loading && !error;
    const dispatch = useDispatch()

    const customFetch = async (fetchFn: Function) => {
        try {
            const response = await fetchFn();
            setData(response)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = useCallback(async () => {
        if(!fetchFn) return
        console.log('loading')
        setLoading(true);
        try {
            const response = await fetchFn();
            setLoading(false);
            setData(response)
            setError(null)
            if (onSuccess) onSuccess();
        }
        catch (error) {
            setLoading(false);
            setError(error);
            if (onError) onError();
            console.log(error);
        }
    }, [fetchFn, onSuccess]);

    useEffect(()=>{
        console.log('rerender')
        fetchData()
    },[fetchData])

    return { data, loading, error, success, fetchData, customFetch  }
}