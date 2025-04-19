const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const aws = require('@aws-sdk/client-ses');

const { accessKeyId, secretAccessKey, region } = config.s3Bucket;

const ses = new aws.SES({
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
	region,
});

const transport = nodemailer.createTransport({ SES: { ses, aws } });

if (config.env !== 'test') {
	transport
		.verify()
		.then(() => logger.info('Connected to email server'))
		.catch(() =>
			logger.warn(
				'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
			)
		);
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
	const msg = { from: config.email.from, to, subject, text };
	await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
	const subject = 'Reset password';
	// replace this url with the link to the reset password page of your front-end app
	const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
	const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email. Your token will be expired in 24 hours.`;
	await sendEmail(to, subject, text);
};

module.exports = {
	transport,
	sendEmail,
	sendResetPasswordEmail,
};
