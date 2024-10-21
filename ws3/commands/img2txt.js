const axios = require("axios");
const name = "ia" ;
const Tesseract = require('tesseract.js');

// Function to convert image to text
async function convertImageToText(imageURL) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageURL, 'eng', { logger: info => console.log(info) });
    return text;
  } catch (error) {
    console.error(error);
    throw new Error('Error converting image to text');
  }
}

module.exports = {
  name: 'ia',
  description: 'Convert image to text using OCR',
  async run({ api, event, send }) {
    const { messageReply } = event;
    
    if (messageReply?.attachments[0]?.type === 'photo') {
      const attachment = messageReply.attachments[0];
      const imageURL = attachment.url;
      
      send('Processing image... 🔄');
      
      try {
        const textResult = await convertImageToText(imageURL);
        
        if (textResult) {
          send(`Here is the extracted text: \n\n${textResult}`);
        } else {
          send('❗ Unable to extract text. Make sure the image is clear.');
        }
      } catch (error) {
        send('❗ Error converting the image to text.');
      }
    } else {
      send('❗ Please reply to a photo to convert it to text.');
    }
  }
};
