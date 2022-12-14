import { useEffect, useState } from "react";
import apiAgent from '../makeRequest'

const useFetch = (resource, action, reqData = undefined) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiAgent[resource][action](reqData);
        setData(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [resource,action,reqData]);

  return { data, loading, error };
};

export default useFetch;
