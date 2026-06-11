import nodemailer from 'nodemailer'
import { STOCK_ALERT_LOWER_EMAIL_TEMPLATE, STOCK_ALERT_UPPER_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './template'


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.
        replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: "Signalist<signalist@guptashruti232.com>",
        to: email,
        subject: `Welcome to Signalist- your stock market toolkit is ready`,
        text: 'Thanks for joining Signalist',
        html: htmlTemplate
    }

    await transporter.sendMail(mailOptions);
}
export const sendStockAlertEmail = async ({ symbol, company, targetPrice, condition, currPrice, email }: any) => {

    let htmlTemplate;
    if (condition == 'below') {
        htmlTemplate = STOCK_ALERT_LOWER_EMAIL_TEMPLATE.
            replaceAll('{{symbol}}', symbol).
            replaceAll('{{targetPrice}}', targetPrice).
            replaceAll('{{currentPrice}}', currPrice).
            replaceAll('{{timestamp}}', new Date().toLocaleTimeString()).
            replaceAll('{{company}}', company);
    }
    else {

        htmlTemplate = STOCK_ALERT_UPPER_EMAIL_TEMPLATE.
            replaceAll('{{symbol}}', symbol).
            replaceAll('{{targetPrice}}', targetPrice).
            replaceAll('{{currentPrice}}', currPrice).
            replaceAll('{{timestamp}}', new Date().toLocaleTimeString()).
            replaceAll('{{company}}', company);
        ;
    }

    const mailOptions = {
        from: "Signalist<signalist@guptashruti232.com>",
        to: email,
        subject: `Stock Alert: ${symbol} has reached your target!`,
        text: 'Thanks for joining Signalist',
        html: htmlTemplate
    }

    await transporter.sendMail(mailOptions);
}

