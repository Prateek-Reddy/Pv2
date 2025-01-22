// CompanyRounds.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompanyRounds = ({ companyName }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API endpoint to fetch online and offline rounds for a specific company
        const response = await axios.get(`/api/online-vs-offline/company/${companyName}`);
        console.log("API Response:", response.data); // Log the response for debugging

        // Prepare the data for the bar chart
        setChartData({
          labels: ["Online Rounds", "Offline Rounds"],
          datasets: [
            {
              label: `Rounds for ${companyName}`,
              data: [response.data.no_of_online_rounds, response.data.no_of_offline_rounds],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)", // Color for online rounds
                "rgba(153, 102, 255, 0.6)", // Color for offline rounds
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching company-specific data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{`Rounds for ${companyName}`}</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default CompanyRounds;