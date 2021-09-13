crypto = require('crypto')
const fs = require('fs');

const WALMART_CONSUMER =  "9f43d6ed-2658-4faf-b0f7-13129dfdfd90";

function generateSignature (timestamp) {

  const pem = fs.readFileSync('walmart-api-utils/WM_IO_private_key.pem');

  const privateKey = pem.toString('ascii')

  const stringToSign = WALMART_CONSUMER + '\n' +
                     timestamp + '\n' +
                     '1' + '\n'

  const sign = crypto.createSign('RSA-SHA256')

  sign.update(stringToSign)
  return sign.sign(privateKey, 'base64')
}

module.exports = {
     getHeaders: function() {
        const timestamp = Date.now().toString()
        const signature = generateSignature(timestamp)

        const headers = {
          'WM_CONSUMER.INTIMESTAMP': timestamp,
          'WM_SEC.AUTH_SIGNATURE': signature,
          'WM_CONSUMER.ID': '9f43d6ed-2658-4faf-b0f7-13129dfdfd90',
          'WM_SEC.KEY_VERSION': '1',
        }
      
        return headers
      }
}
