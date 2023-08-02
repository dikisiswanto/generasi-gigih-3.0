import { generateCodeChallenge, generateRandomString } from "../utils/helper";

const getGrantAccessLink = async ({clientId, redirectUri}) => {
  const codeVerifier = generateRandomString(128);
  const state = generateRandomString(16);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const scope = 'user-read-email user-read-private';
  localStorage.setItem('code_verifier', codeVerifier);
  const args = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });
  const grantAccessLink = 'https://accounts.spotify.com/authorize?' + args;
  return grantAccessLink; 
}

const getAccessToken = async ({clientId, redirectUri, code}) => {
  const codeVerifier = localStorage.getItem('code_verifier');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString(),
    });
    
    if (!response.ok) {
      throw new Error('Ada kesalahan saat menyambungkan akun Anda');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

const getNewAccessToken = async ({ clientId, clientSecret }) => {
  const refreshToken = localStorage.getItem('refresh_token');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret).toString('base64'),
      },
      body: body,
    });
    
    if (!response.ok) {
      throw new Error('Ada kesalahan saat proses autentikasi');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }

}

export {
  getGrantAccessLink,
  getAccessToken,
  getNewAccessToken,
}