import nodemailer from 'nodemailer';
import juice from 'juice';
import htmlToText from 'html-to-text';
import pug from 'pug';
import util from 'util';
import { email } from '../config/email';

export const sendEmail = async (options) => {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: email.host,
        port: email.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: email.user, // generated ethereal user
            pass: email.password, // generated ethereal password
        },
    });

    const styleEmail = () => {
        const style = pug.renderFile(`${__dirname}/../view/email/${options.archive}.pug`, options);
        return juice(style);
    }

    const html = styleEmail();
    const text = htmlToText.fromString(html);

    let info = await transporter.sendMail({
        from: '"Up-Task" <no-reply@Up-task.com>', // sender address
        to: options.auth.email, // list of receivers
        subject: options.subject, // Subject line
        text: text, // plain text body
        html: html 
    });

    //const envio = util.promisify(info, transporter);
    //return envio.call(transporter, info);
}
