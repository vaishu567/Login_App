const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

//https://ethereal.email/create
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "nicole51@ethereal.email",
    pass: "tA9jP1Z89DHj9smtZc",
  },
});

// const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/** POST: http://localhost:8080/api/registerMail 
 * @param : {
  "username" : "example123",
  "userEmail" : "admin123@gmail.com",
  "text":"",
  "subject":"",
}
*/
const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  //body of the email:
  var email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro:
        "Need help, or have question? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  const message = {
    from: "ari31@ethereal.email",
    to: userEmail,
    subject: subject || "Signup Successful!",
    html: emailBody,
  };

  //send mail:
  const trans = await transporter.sendMail(message);
  if (trans) {
    return res
      .status(200)
      .send({ message: "You should receive an email from us." });
  } else {
    res.status(500).send({ error });
  }
};

module.exports = registerMail;
