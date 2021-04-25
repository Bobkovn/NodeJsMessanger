import sendGridMail from '@sendgrid/mail'

sendGridMail.setApiKey(process.env.SENDGRID_EMAIL_API_KEY)

class SendEmailService {
    sendAuthCodeEmail(user, code) {
        sendGridMail.send({
            to: user.email,
            from: 'test@test.com',
            subject: 'Auth code',
            text: `Your authentication code: ${code}`
        })
    }
}

export default new SendEmailService()