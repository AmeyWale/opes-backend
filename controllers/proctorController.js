import { processFrame } from "../services/proctorService.js";
import fs from "fs"
import path from "path"

export const handleCamFeed = async (req,res) => {
    try {
        const { frame } = req.body; // Extract the base64-encoded frame
        if (!frame) {
            return res.status(400).json({ error: "Frame data is missing" });
        }
        // console.log(frame);

        // const base64Data = frame.replace(/^data:image\/jpeg;base64,/, '');
  
        // Save the image to a file (you can modify the path and naming convention as needed)
        // const imagePath = path.join('frames', `${Date.now()}.jpg`);
        
        // fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        //     if (err) {
        //     console.error('Error saving the image:', err);
        //     return res.status(500).send('Error saving the image');
        //     }
        // })
        // Call the service to process the frame
        // const result = await processFrame(frame);

        // // Send the response back to the client
        // res.status(200).json({ message: "Frame processed successfully", result });


//The following code needs to be tested for frame feed
         // Immediate response
         res.status(200).json({ message: "Frame processing started" });

        // Offload the frame processing to a background task (non-blocking)
         setImmediate(async () => {
             try {
                 const result = await processFrame(frame);
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