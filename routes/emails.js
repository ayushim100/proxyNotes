var helper = require('sendgrid').mail;
var express = require('express');
var router = express.Router();
var val = Math.floor(1000+Math.random()*90000);
const async = require('async');
function sendEmail(
    parentCallback,
    fromEmail,
    toEmails,
    subject,
    textContent,
    htmlContent
  ) {
    const errorEmails = [];
    const successfulEmails = [];     const sg = require('sendgrid')('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');     async.parallel([
      function(callback) {
        // Add to emails
        for (let i = 0; i < toEmails.length; i += 1) {
          // Add from emails
          const senderEmail = new helper.Email(fromEmail);          // Add to email
          const toEmail = new helper.Email(toEmails[i]);          // HTML Content
          const content = new helper.Content('text/html', htmlContent);          const mail = new helper.Mail(senderEmail, subject, toEmail, content);          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
          });          sg.API(request, function (error, response) {
            console.log('SendGrid');
            if (error) {
              console.log('Error response received');
            }
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
          });
        }        // return
        callback(null, true);
      }
    ], function(err, results) {
      console.log('Done');
    });    parentCallback(null,
      {
        successfulEmails: successfulEmails,
        errorEmails: errorEmails,
      }
    );
}
router.post('/', function (req, res, next) {
    async.parallel([
        function (callback) {
          sendEmail(
            callback,
            'forexample1@abc.com',
            ['forexample2@abc.com'],
            'Subject Line',
            'Text Content',
            '<p style="font-size: 32px;">HTML </p>'
          );
        }
      ], function(err, results) {
        res.send({
          success: true,
          message: 'Emails sent',
          successfulEmails: results[0].successfulEmails,
          errorEmails: results[0].errorEmails,
        });
      });
  });
module.exports = router;