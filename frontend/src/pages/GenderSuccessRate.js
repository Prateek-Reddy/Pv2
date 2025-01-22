// GenderSuccessRate.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GenderSuccessRate = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMales, setTotalMales] = useState(0);
  const [totalFemales, setTotalFemales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rounds/gender-success-rate");
        console.log("API Response:", response.data);

        const labels = response.data.data.map(item => item._id); // Company names
        const maleData = response.data.data.map(item => item.male_passed); // Male passed counts
        const femaleData = response.data.data.map(item => item.female_passed); // Female passed counts

        setTotalMales(response.data.totalMales);
        setTotalFemales(response.data.totalFemales);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Male Passed",
              data: maleData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Female Passed",
              data: femaleData,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching gender success rate data:", error);
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
    <div className="container mt-5">
      <h2 className="text-xl font-bold mb-4">Gender Success Rate</h2>
      <Bar data={chartData} options={{ responsive: true }} />
      <div className="mt-4">
        <h4>Total Males Recruited: {totalMales}</h4>
        <h4>Total Females Recruited: {totalFemales}</h4>
      </div>
    </div>
  );
};

export default GenderSuccessRate;