const { GOOGLE_API_CREDENTIAL } = process.env;
const json = Buffer.from(GOOGLE_API_CREDENTIAL, 'base64').toString();
console.log(json);
