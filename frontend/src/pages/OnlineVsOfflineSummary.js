// OnlineVsOfflineSummary.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2"; // Import Pie for pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Import necessary components for pie chart

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const OnlineVsOfflineSummary = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API endpoint to fetch online vs offline rounds summary
        const response = await axios.get("/api/rounds/online-vs-offline/summary");
        console.log("API Response:", response.data); // Log the response for debugging

        // Prepare the data for the pie chart
        setChartData({
          labels: ["Total Online Rounds", "Total Offline Rounds"],
          datasets: [
            {
              label: "Rounds",
              data: [response.data.total_online_rounds, response.data.total_offline_rounds],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)", // Color for online rounds
                "rgba(153, 102, 255, 0.6)", // Color for offline rounds
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching online vs offline summary data:", error);
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
      <h2 className="text-xl font-bold mb-4">Online vs Offline Rounds Summary</h2>
      <div style={{ width: '300px', height: '300px' }}> {/* Set a fixed size for the chart */}
        <Pie data={chartData} options={{ responsive: true }} /> {/* Use Pie component */}
      </div>
    </div>
  );
};

export default OnlineVsOfflineSummary;