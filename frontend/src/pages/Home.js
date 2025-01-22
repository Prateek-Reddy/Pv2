import React from "react";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary fw-bold mb-3">Welcome to Placement Assistant</h1>
      <p className="lead text-muted">
        Your one-stop solution to ace campus placements with curated insights,
        curriculum analysis, and a personalized AI assistant.
      </p>
      <div className="mt-4">
        <a href="/pyqs" className="btn btn-outline-primary me-3">
          Explore PYQs
        </a>
        <a href="/data-viz" className="btn btn-primary">
          View Data Insights
        </a>
      </div>
      
    </div>
  );
};

export default Home;
