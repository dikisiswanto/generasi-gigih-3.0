const getProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    if (!response.ok) {
      throw new Error('Gagal saat mengambil informasi akun');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export {
  getProfile,
}