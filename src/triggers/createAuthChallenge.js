import AWS from "aws-sdk";
import * as debug from "../util/debug";


export const main = (event, context, callback) => {
  //Create a random number for otp
  const challengeAnswer = Math.random().toString(10).substr(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number;
  //Init debugger
  debug.init(event);
  //sns sms
  const sns = new AWS.SNS({ region: 'us-east-1' });
  sns.publish(
    {
      Message: 'your otp: ' + challengeAnswer,
      PhoneNumber: phoneNumber,
      MessageStructure: 'string',
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'AMPLIFY',
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    },
    function (err, data) {
      if (err) {
        debug.flush(err);

        console.log(err.stack);
        console.log(data);
        return;
      }
      return data;
    }
  );
  //set return params
  event.response.privateChallengeParameters = {};
  event.response.privateChallengeParameters.answer = challengeAnswer;
  event.response.challengeMetadata = 'CUSTOM_CHALLENGE';
  callback(null, event);
};