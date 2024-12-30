import axios from "axios";

export const processFrame = async (frame) => {
    try {
        // Forward the frame to the Python service
        const response = await axios.post('http://localhost:8000/process_frame', { frame });
        return response.data; // Return the processed result
    } catch (error) {
        console.error("Error communicating with Python service:", error);
        throw new Error("Failed to process frame");
    }
}
