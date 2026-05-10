import cron from "node-cron"
import examinationCol from "../Models/examinationModel.mjs"
import { format, isAfter, parse } from "date-fns";

export default () => {
    // Schedule a cron job to run every 1 hour
    cron.schedule('0 0 * * * *', async () => { 
        try {
            // Get the current date and time
            const now = new Date();

            // Find exams where examTimeOver is false and the date/time has passed
            const exams = await examinationCol.find({
                examTimeOver: false,
                date: { $ne: "NA" },
                time: { $ne: "NA" }
            });

            for (const exam of exams) {
                // Parse the exam date and time using 'yyyy-MM-dd h:mm a' format
                const examDateTime = parse(`${exam.date} ${exam.time}`, 'yyyy-MM-dd h:mm a', new Date());

                // Check if the current time is after the exam time
                if (isAfter(now, examDateTime)) {
                    // If current time is after the exam time, update examTimeOver to true
                    await examinationCol.updateOne(
                        { _id: exam._id },
                        { $set: { examTimeOver: true } }
                    );
                }
            }
        } catch (error) {
            console.error('Error updating examTimeOver:', error);
        }
    });
}

// * * * * * *
// │ │ │ │ │ │
// │ │ │ │ │ └─── Day of week (0 - 7) (Sunday = 0 or 7)
// │ │ │ │ └────── Month (1 - 12)
// │ │ │ └──────── Day of month (1 - 31)
// │ │ └────────── Hour (0 - 23)
// │ └──────────── Minute (0 - 59)
// └────────────── Second (0 - 59) (optional in `node-cron`)