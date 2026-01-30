import cron from "node-cron";
import axios from "axios";


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cron.schedule("0 8 * * *", async () => {
    try {
        const emailRes = await axios.post("http://localhost:5000/emails", { 
            clientEmail: "akshayaarul1310@gmail.com" 
        });
        if (emailRes.data.status === "S" && emailRes.data.data?.length > 0) {
            const emails = emailRes.data.data;
            const payload = {
                Flag: "I",
                Summary: emails[0].body,
                PriorityID: 2,
                SeverityID: 2,
                Description: emails[0].subject,
                CreatedBy: 1,
                UserId: 1,
                StatusID: 1,
                DepartmentId: 1,
                ModifiedBy: 1,
                TicketID: null,
                TargetDate: null,
                FileSource: null,
                FileName: ''
            };
            const ticketRes = await axios.post(
                "https://localhost:7174/api/UserDashboard/AddUpdateTickets",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        // "Authorization": `Bearer ${token}` 
                    }
                }
            );
            console.log("Ticket response:", ticketRes.data);
        } else {
            console.log("No new emails to process today.");
        }
    } catch (err) {
        console.error("Error running automation:", err);
    }
}, {
    timezone: "Asia/Kolkata"
});
console.log("Schedule started");
