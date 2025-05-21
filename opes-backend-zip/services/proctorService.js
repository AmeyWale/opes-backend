import axios from "axios";

export const processFrame = async (frame,student_object_id) => {
    try {
        // Forward the frame to the Python service
        const response = await axios.post('http://localhost:8000/process_frame', { frame,student_object_id });
        return response.data; 
    } catch (error) {
        console.error("Error communicating with Python service:", error);
        throw new Error("Failed to process frame");
    }
}
