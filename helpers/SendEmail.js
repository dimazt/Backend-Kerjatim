import nodemailer from "nodemailer";

export var transporterMailTrap = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b8b9669e26d6ed",
      pass: "12d36ee3496882"
    }
  });
export var transporterGmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "kerjatimid@gmail.com",
        pass: "lemyqbytxfuenbcf"
        // user: "ahmdphrl1st14@gmail.com",
        // pass: "sandiapa123"
    },
    tls: {
        rejectUnauthorized: false
    }
});
