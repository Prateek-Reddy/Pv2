// HiredTrend.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HiredTrend = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rounds/total-hired-trend");
        console.log("API Response:", response.data); // Log the response for debugging
        const companies = response.data.map((item) => item.company);
        const hired = response.data.map((item) => item.no_of_students_hired);

        setChartData({
          labels: companies,
          datasets: [
            {
              label: "Number of Students Hired",
              data: hired,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching hired trend data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: 'easeOutBounce', // Easing function for the animation
    },
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Hired Trend</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HiredTrend;