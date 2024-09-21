import { useEffect, useState } from "react";

    
    async function fetchWeather() {
        const response = await fetch(`http://localhost:5107/weatherforecast`);
        return await response.json();
    }
    

const Backend: React.FC = () => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchWeather();
                setWeatherData(data[0].date);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
      <>{weatherData}</>
    )
  }
  
  export default Backend;