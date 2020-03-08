const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;

//   W57UdCuZEjARnAyZKzOIAhuF
// https://oauth2.googleapis.com/tokeninfo?id_token=XYZ123

module.exports.authGoogleUser = async token => {
  const client = new OAuth2Client(CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
      id: payload["sub"],
      name: payload["name"],
      image_url: payload["picture"],
      exp: payload["exp"],
      email: payload["email"]
    };
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};
