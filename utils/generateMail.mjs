import Nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

const SENDER_MAIL = process.env.SENDER_EMAIL_ACCOUNT;

const transporter = Nodemailer.createTransport({
    // service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    // auth: {
    //     user: SENDER_MAIL,
    //     pass: process.env.APP_PASSWORD
    // }
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL_ACCOUNT,
        pass: process.env.APP_PASSWORD, // ✅ Gmail App Password (16 chars)
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
})

// ADMIN CREATION MAIL
export const adminCreationMail = (deptInfo, adminInfo, password) => {
    const mailOptions = {
        from: {
            name: deptInfo.instituteName,
            address: SENDER_MAIL
        },
        to: adminInfo.adminEmail,
        subject: `Admin Account Created At ${deptInfo.departmentName}, ${deptInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Admin Account Created At ${deptInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${adminInfo.adminFirstName} ${adminInfo.adminLastName}</strong>,</p>
                        <p>Your Admin Account has been created at ${deptInfo.departmentName}, ${deptInfo.instituteName}.</p>
                        <p><strong>Institute Id</strong> : ${deptInfo.instituteId}</p>
                        <p><strong>Institute Pass</strong> : ${deptInfo.institutePass}</p>
                        <p><strong>Admin Name</strong> : ${adminInfo.adminFirstName} ${adminInfo.adminLastName}</p>
                        <p><strong>Email Id</strong> : ${adminInfo.adminEmail}</p>
                        <p><strong>Password</strong> : ${password}</p>
                        <p><strong>Designation</strong> : ${adminInfo.designation}</p>
                        <p>Best regards,</p>
                        <p>
                            ${deptInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${deptInfo.departmentName}, ${deptInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : admin account creation mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}

// Faculty Mail
export const facultyCreationMail = (deptInfo, facultyInfo, password) => {
    const mailOptions = {
        from: {
            name: deptInfo.instituteName,
            address: SENDER_MAIL
        },
        to: facultyInfo.facultyEmail,
        subject: `Faculty Account Created At ${deptInfo.departmentName}, ${deptInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Faculty Account Created At ${deptInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${facultyInfo.facultyName.firstName} ${facultyInfo.facultyName.lastName}</strong>,</p>
                        <p>Your Faculty Account has been created at ${deptInfo.departmentName}, ${deptInfo.instituteName}.</p>
                        <p><strong>Institute Id</strong> : ${deptInfo.instituteId}</p>
                        <p><strong>Institute Pass</strong> : ${deptInfo.institutePass}</p>
                        <p><strong>Faculty Name</strong> : ${facultyInfo.facultyName.firstName} ${facultyInfo.facultyName.lastName}</p>
                        <p><strong>Email Id</strong> : ${facultyInfo.facultyEmail}</p>
                        <p><strong>Faculty Id</strong> : ${facultyInfo.facultyId}</p>
                        <p><strong>Password</strong> : ${password}</p>
                        <p><strong>Designation</strong> : ${facultyInfo.designation}</p>
                        <p>Best regards,</p>
                        <p>
                            ${deptInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${deptInfo.departmentName}, ${deptInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : faculty account creation mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}
export const facultyModificationMail = (deptInfo, facultyInfo) => {
    const mailOptions = {
        from: {
            name: deptInfo.instituteName,
            address: SENDER_MAIL
        },
        to: facultyInfo.studentEmail,
        subject: `Faculty Account Modified At ${deptInfo.departmentName}, ${deptInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Faculty Account Modified At ${deptInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${facultyInfo.studentName.firstName} ${facultyInfo.studentName.lastName}</strong>,</p>
                        <p>Your Faculty Account has been modified at ${deptInfo.departmentName}, ${deptInfo.instituteName}.</p>
                        <p><strong>Faculty Name</strong> : ${facultyInfo.studentName.firstName} ${facultyInfo.studentName.lastName}</p>
                        <p><strong>Email Id</strong> : ${facultyInfo.studentEmail}</p>
                        <p><strong>Faculty Id</strong> : ${facultyInfo.studentId}</p>
                        <p><strong>Designation</strong> : ${facultyInfo.designation}</p>
                        <p>Best regards,</p>
                        <p>
                            ${deptInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${deptInfo.departmentName}, ${deptInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : faculty account modification mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}
export const removeFacultyMail = (deptInfo, facultyInfo) => {
    const mailOptions = {
        from: {
            name: deptInfo.instituteName,
            address: SENDER_MAIL
        },
        to: facultyInfo.facultyEmail,
        subject: `Faculty Account Removed From ${deptInfo.departmentName}, ${deptInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Faculty Account Removed From ${deptInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Your Faculty Account bearing faculty Id ${facultyInfo.facultyId} has been removed from ${deptInfo.departmentName}, ${deptInfo.instituteName}.</p>
                        <p>Best regards,</p>
                        <p>
                            ${deptInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${deptInfo.departmentName}, ${deptInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : student account remove mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}


// Student Mail
export const studentCreationMail = (batchInfo, studentInfo, password) => {
    const mailOptions = {
        from: {
            name: batchInfo.instituteName,
            address: SENDER_MAIL
        },
        to: studentInfo.studentEmail,
        subject: `Student Account Created At ${batchInfo.departmentName}, ${batchInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Student Account Created At ${batchInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${studentInfo.studentName.firstName} ${studentInfo.studentName.lastName}</strong>,</p>
                        <p>Your Student Account has been created at ${batchInfo.departmentName}, ${batchInfo.instituteName}.</p>
                        <p><strong>Institute Id</strong> : ${batchInfo.instituteId}</p>
                        <p><strong>Institute Pass</strong> : ${batchInfo.institutePass}</p>
                        <p><strong>Student Name</strong> : ${studentInfo.studentName.firstName} ${studentInfo.studentName.lastName}</p>
                        <p><strong>Email Id</strong> : ${studentInfo.studentEmail}</p>
                        <p><strong>DOB</strong> : ${studentInfo.studentDOB}</p>
                        <p><strong>Student Id</strong> : ${studentInfo.studentId}</p>
                        <p><strong>Password</strong> : ${password}</p>
                        <p><strong>Your Batch</strong> : ${batchInfo.batchName}</p>
                        <p>Best regards,</p>
                        <p>
                            ${batchInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${batchInfo.departmentName}, ${batchInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : student account creation mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}
export const studentModificationMail = (batchInfo, studentInfo) => {
    const mailOptions = {
        from: {
            name: batchInfo.instituteName,
            address: SENDER_MAIL
        },
        to: studentInfo.studentEmail,
        subject: `Student Account Modified At ${batchInfo.departmentName}, ${batchInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Student Account Modified At ${batchInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${studentInfo.studentName.firstName} ${studentInfo.studentName.lastName}</strong>,</p>
                        <p>Your Student Account has been modified at ${batchInfo.departmentName}, ${batchInfo.instituteName}.</p>
                        <p><strong>Student Name</strong> : ${studentInfo.studentName.firstName} ${studentInfo.studentName.lastName}</p>
                        <p><strong>Email Id</strong> : ${studentInfo.studentEmail}</p>
                        <p><strong>DOB</strong> : ${studentInfo.studentDOB}</p>
                        <p><strong>Student Id</strong> : ${studentInfo.studentId}</p>
                        <p>Best regards,</p>
                        <p>
                            ${batchInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${batchInfo.departmentName}, ${batchInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : student account modification mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}
export const removeStudentMail = (deptInfo, studentInfo) => {
    const mailOptions = {
        from: {
            name: deptInfo.instituteName,
            address: SENDER_MAIL
        },
        to: studentInfo.studentEmail,
        subject: `Student Account Removed From ${deptInfo.departmentName}, ${deptInfo.instituteName}`,
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Student Account Removed From ${deptInfo.departmentName}</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Your Student Account bearing student Id ${studentInfo.studentId} has been removed from ${deptInfo.batchName} batch, ${deptInfo.departmentName}, ${deptInfo.instituteName}.</p>
                        <p>Best regards,</p>
                        <p>
                            ${deptInfo.headOfDepartment}<br>
                            Head Of Deparment<br>
                            ${deptInfo.departmentName}, ${deptInfo.instituteName}<br>
                            <a href="mailto:${SENDER_MAIL}">${SENDER_MAIL}</a><br>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : student account remove mail couldn't sent --> ${error}`);
        } else {
            return true
        }
    });
}



// Send Password changing request otp to mail
export const sendOTP = (otp, instituteName, mail) => {
    const mailOptions = {
        from: {
            name: instituteName,
            address: SENDER_MAIL
        },
        to: mail,
        subject: "6-digit OTP",
        html: ` <h4>Your 6-character OTP is : ${otp}</h4>`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : otp couldn't be sent --> ${error}`);
        }
        else {
            return true
        }
    });
}



//Institute password change 
export const institutePasswordChange = (instiInfo, userMail, userName, password) => {
    const mailOptions = {
        from: {
            name: instiInfo.instituteName,
            address: SENDER_MAIL
        },
        to: userMail,
        subject: `Institute Password Changed`,
        html: `
        <h4>Hello, ${userName}. Institute Password has recently been changed. The updated information is given below.</h4>
        <h4>Institute Id : ${instiInfo.instituteId}</h4>
        <h4>Institute Password : ${instiInfo.institutePass}</h4>
        `,
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : institute password change --> ${error}`);
        } else {
            return true
        }
    });
}


//Contact Us

export const sendUserMsg_contactUs = (mailId, username, message) => {
    const mailOptions = {
        from: {
            name: username,
            address: mailId
        },
        to: process.env.SENDER_EMAIL_ACCOUNT,
        subject: "Message From Insti360 User",
        html: `
        <h1>EmailId : ${mailId}</h1>
        <h1>Name : ${username}</h1>
        <h1>Message : </h1><p>${message}</p>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : mail couldn't be sent--> ${error}`);
        } else {
            sendReply_contactUs(mailId, username, message)
        }
    });
}


const sendReply_contactUs = (mailId, username, message) => {
    const mailOptions = {
        from: {
            name: "Insti360",
            address: process.env.SENDER_EMAIL_ACCOUNT
        },
        to: mailId,
        subject: "Thank You for Contacting Us!",
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Thank You for Contacting Us!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${username}</strong>,</p>
                        <p>Thank you for reaching out to us! We have received your message and appreciate you taking the time to get in touch.</p>
                        <p><strong>Your Message:</strong></p>
                        <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 10px 0; padding: 10px;">
                            ${message}
                        </blockquote>
                        <p>We value every piece of feedback we receive. One of our team members will review your message and get back to you as soon as possible, typically within 48 hours.</p>
                        <p>In the meantime, if you have any additional questions or need immediate assistance, please feel free to reply to this email or contact us directly at <a href="mailto:contact.insti360@gmail.com">contact@insti360.com</a>.</p>
                        <p>Thank you again for contacting us. We look forward to assisting you!</p>
                        <p>Best regards,</p>
                        <p>
                            Siva Sankar Sahoo<br>
                            Founder and CEO<br>
                            insti360<br>
                            <a href="mailto:contact.insti360@gmail.com">contact@insti360.com</a><br>
                            <a href="https://insti360.up.railway.app/">Insti360</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : reply mail couldn't be sent--> ${error}`);
        } else {
            return true
        }
    });
}