import { success } from "better-auth";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendStockAlertEmail, sendWelcomeEmail } from "../nodemailer";
import { connectToDatabase } from "@/database/mongoose";
import Alert from "@/database/models/alert.model";
import { fetchStockPrice } from "../api/stocks-server";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";

export const sendSignUpEmail = inngest.createFunction(

    { id: 'sign-up-email' },
    { event: 'app/user.created' },

    async ({ event, step }) => {
        const userProfile =
            `-Country: ${event.data.country}
    -Investment Goals: ${event.data.investmentGoals}
    -Risk Tolerance: ${event.data.riskTolerance}
    -Preferred Industry: ${event.data.preferredIndustry}
    `


        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [{
                            text: prompt
                        }]
                    }
                ]
            }
        })


        await step.run('send-welcome-email', async () => {

            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null)
                || 'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves'

            return await sendWelcomeEmail({
                email: event.data.email,
                name: event.data.name,
                intro: introText
            })


        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }

    })

export const processStockAlert = inngest.createFunction(
    { id: 'process-stock-alerts' },
    { cron: '0 * * * *' },
    async ({ step }) => {
        await step.run('check-and-process-alerts', async () => {

            // get all active alerts
            await connectToDatabase();
            const activeAlerts = await Alert.find({ isActive: true });
            const db = mongoose.connection.db;

            for (const alert of activeAlerts) {
                const symbol = alert.symbol;
                const stockData = await fetchStockPrice(symbol)
                const currPrice = stockData.c;
                const condition = alert.condition;
                const targetPrice = alert.targetPrice;
                const user = await db?.collection("user").findOne({ _id: alert.userId });
                const email = user?.email;

                if (condition == "above") {
                    if (currPrice > targetPrice) {
                        await sendStockAlertEmail({ symbol, targetPrice, condition, currPrice, email });
                        alert.isActive = false;
                        await alert.save();
                    }
                }
                else {
                    if (currPrice < targetPrice) {
                        await sendStockAlertEmail({ symbol, targetPrice, condition, currPrice, email })
                        alert.isActive = false;
                        await alert.save();
                    }
                }




                // fetch price for that symbol from finhub quote api.
            }


        })
    }



)