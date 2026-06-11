import { success } from "better-auth";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendStockAlertEmail, sendWelcomeEmail } from "../nodemailer";
import { connectToDatabase } from "@/database/mongoose";
import Alert from "@/database/models/alert.model";
import { fetchStockPrice, getCompanyProfile } from "../api/stocks-server";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const sendSignUpEmail = inngest.createFunction(
    {
        id: "sign-up-email",
        triggers: { event: "app/user.created" }
    },
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

    }

)

export const processStockAlert = inngest.createFunction(
    {
        id: "process-stock-alerts",
        triggers: { cron: '0 * * * *' }
    },
    async ({ step }) => {
        await step.run('check-and-process-alerts', async () => {

            console.log("check-and-process-alerts");
            try {
                console.log("---------- STARTING CRON JOB ----------");
                await connectToDatabase();
                const activeAlerts = await Alert.find({ isActive: true });
                console.log(`Found ${activeAlerts.length} active alerts to process.`);

                const db = mongoose.connection.db;

                for (const alert of activeAlerts) {
                    try {
                        console.log(`Processing alert: Symbol=${alert.symbol}, Target=${alert.targetPrice}, Condition=${alert.condition}`);

                        const stockData = await fetchStockPrice(alert.symbol);
                        const companyProfile = await getCompanyProfile(alert.symbol);
                        const currPrice = stockData.c;
                        console.log("companyProfile", companyProfile);
                        console.log(`[${alert.symbol}] Current Price from Finnhub: $${currPrice}`);
                        const user = await db?.collection("user").findOne({ _id: new ObjectId(alert.userId) });
                        console.log("alert.userId=", alert.userId);
                        console.log("user", user);
                        if (!user || !user.email) {
                            console.error(`[ERROR] Could not find email for userId: ${alert.userId}. Skipping this alert.`);
                            continue; // Skip to next alert if email is missing
                        }

                        console.log(`[${alert.symbol}] Found user email: ${user.email}`);

                        if (alert.condition == "above") {
                            if (currPrice > alert.targetPrice) {
                                console.log(`[TRIGGERED] ${currPrice} is ABOVE ${alert.targetPrice}. Sending email...`);
                                await sendStockAlertEmail({ symbol: alert.symbol, company: companyProfile?.name, targetPrice: alert.targetPrice, condition: alert.condition, currPrice, email: user.email });
                                alert.isActive = false;
                                await alert.save();
                                console.log(`[SUCCESS] Email sent and alert deactivated.`);
                            } else {
                                console.log(`[IGNORED] ${currPrice} is not above ${alert.targetPrice}`);
                            }
                        }
                        else {
                            if (currPrice < alert.targetPrice) {
                                console.log(`[TRIGGERED] ${currPrice} is BELOW ${alert.targetPrice}. Sending email...`);
                                await sendStockAlertEmail({
                                    symbol: alert.symbol, company: companyProfile?.name,
                                    targetPrice: alert.targetPrice, condition: alert.condition, currPrice, email: user.email
                                })
                                alert.isActive = false;
                                await alert.save();
                                console.log(`[SUCCESS] Email sent and alert deactivated.`);
                            } else {
                                console.log(`[IGNORED] ${currPrice} is not below ${alert.targetPrice}`);
                            }
                        }
                    } catch (innerError) {
                        console.error(`[ERROR processing alert ${alert._id}]:`, innerError);
                    }
                }
                console.log("---------- FINISHED CRON JOB ----------");
            } catch (globalError) {
                console.error("---------- MASSIVE CRON ERROR ----------");
                console.error(globalError);
                throw globalError; // Re-throw so Inngest knows it failed
            }
        })
    }



)