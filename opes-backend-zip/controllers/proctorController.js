import { processFrame } from "../services/proctorService.js";
import { updateStudent } from "../repositories/studentRepository.js";

export const handleCamFeed = async (req,res) => {
    try {
        const { frame, student_object_id } = req.body; // Extract the base64-encoded frame
        if (!frame) {
            return res.status(400).json({ error: "Frame data is missing" });
        }
        
        //The following code needs to be tested for frame feed
         // Immediate response
         res.status(200).json({ message: "Frame processing started" });

        // Offload the frame processing to a background task (non-blocking)
         setImmediate(async () => {
             try {
                 const result = await processFrame(frame,student_object_id);
                 // Here you can store the result in a database or send it to the user later.
                 console.log("Frame processed:", result);
             } catch (error) {
                 console.error("Error processing frame:", error);
             }
         });

    } catch (error) {
        console.error("Error processing frame:", error);
        // res.status(500).json({ error: "Internal server error" });
    }
    
}

export const handleViolation = async (req, res) => {
    const {studentId, reason} = req.body
    
    try {
        const studentViolationPayload = {
            reason
        }

        await updateStudent(studentId, { "$push": { violations : studentViolationPayload}})
        res.status(200).json({ message: "Violation recorded" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}