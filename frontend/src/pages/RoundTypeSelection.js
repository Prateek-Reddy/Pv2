// RoundTypeSelection.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoundTypeSelection = () => {
  const [roundType, setRoundType] = useState("aptitude_round");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hardcoded round types
  const roundTypes = [
    "aptitude_round",
    "technical_round",
    "managerial_round",
    "technical_hr",
    "group_discussion",
    "online_coding",
    "written_coding_round",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/rounds/typerounds/${roundType}`);
        console.log("API Response:", response.data);

        const labels = response.data.map(item => item._id); // Company names
        const data = response.data.map(item => item.count); // Counts

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `Number of ${roundType.replace(/_/g, ' ')}`,
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching round type data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roundType]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-xl font-bold mb-4">Select Round Type</h2>
      <select 
        value={roundType} 
        onChange={(e) => setRoundType(e.target.value)} 
        className="form-select mb-4"
      >
        {roundTypes.map((type) => (
          <option key={type} value={type}>
            {type.replace(/_/g, ' ')} {/* Replace underscores with spaces for display */}
          </option>
        ))}
      </select>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default RoundTypeSelection;