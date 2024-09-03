const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // o el servicio utilizado
    auth: {
        user: 'your-email@gmail.com',//colocar algun mail registrado en la base de datos
        pass: 'your-email-password'
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@gmail.com',//enviar a direccion registrada
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendMail;