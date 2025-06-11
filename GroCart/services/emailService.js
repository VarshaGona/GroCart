const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderStatusEmail = async (user, order, status) => {
  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  };

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `Order Status Update - ${status}`,
    html: `
      <h1>Order Status Update</h1>
      <p>Dear ${user.name},</p>
      <p>${statusMessages[status]}</p>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: $${order.totalAmount}</p>
      <p>Thank you for shopping with us!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendOrderStatusEmail }; 