const { Client } = require("@gradio/client");

const runGradioClient = async () => {
    try {
        // Connect to the Gradio API
        const client = await Client.connect("https://hf.space/embed/DivijaSistla/placementAi-API");

        // Send a prediction request
        const result = await client.predict("/predict", {
            user_query: "Hello!!", // Example user query
        });

        // Log the response data
        console.log(result.data);
    } catch (error) {
        console.error("Error connecting to Gradio API:", error.message);
    }
};

// Run the function
runGradioClient();