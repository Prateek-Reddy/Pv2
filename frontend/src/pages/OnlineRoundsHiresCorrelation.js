// ScatterPlotWithJitter.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const ScatterPlotWithJitter = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rounds/correlation/online-rounds-hires");
        console.log("API Response:", response.data);

        const dataPoints = response.data
          .filter(item => item.no_of_students_hired !== null)
          .map(item => ({
            x: item.no_of_online_rounds + (Math.random() - 0.5) * 0.1, // Add jitter
            y: item.no_of_students_hired,
          }));

        setChartData({
          datasets: [
            {
              label: "Online Rounds vs Hires",
              data: dataPoints,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              pointRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching correlation data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Scatter Plot with Jitter: Online Rounds vs Hires</h2>
      <Scatter 
        data={chartData} 
        options={{ 
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Scatter Plot of Online Rounds vs Hires',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Online Rounds',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of Students Hired',
              },
            },
          },
        }} 
      />
    </div>
  );
};

export default ScatterPlotWithJitter;