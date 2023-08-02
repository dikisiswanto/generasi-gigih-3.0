const generateRandomString = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const generateCodeChallenge = async (codeVerifier) => {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}

const isTokenExpired = () => {
  const expiresIn = parseInt(localStorage.getItem('expires_in'), 10);
  const issueTime = parseInt(localStorage.getItem('issue_time'), 10);
  const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  return currentTime >= issueTime + expiresIn;
};

const setAccessDataToLocal = (data) => {
  for (const key in data) {
    if (['access_token', 'refresh_token', 'expires_in'].includes(key)) {
      localStorage.setItem(key, data[key]);
    }
  }
  localStorage.setItem('issue_time', Math.floor(Date.now() / 1000));
}

const removeAccessDataFromLocal = () => {
  const accessDataKeys = ['access_token', 'refresh_token', 'expires_in'];
  accessDataKeys.map(key => localStorage.removeItem(key));
}

export {
  generateRandomString,
  generateCodeChallenge,
  isTokenExpired,
  setAccessDataToLocal,
  removeAccessDataFromLocal,
}