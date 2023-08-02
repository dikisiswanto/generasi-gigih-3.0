const getRecommendedSongs = async (accessToken) => {
  try {
    let params = {
      "market": "ID",
      "limit": 20,
      "seed_artists": "7uEP7CL6JdUpyNTYdEzfb4,31aMmlq8isIAgojvmIwiS4,0ygQsC5td2maGmglpzd7tp,6oM1PyiV3LidEUIHKubg3W,41MozSoPIsD1dJM0CLPjZF",
    };
    
    let q = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    const response = await fetch('https://api.spotify.com/v1/recommendations?' + q, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    if (!response.ok) {
      throw new Error('Error: Gagal mengambil data', response.error);
    }

    const data = await response.json();
    return data?.tracks;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

const getSearchedSongs = async (query, accessToken) => {
  try {
    let params = {
      "market": "ID",
      "limit": 20,
      "type": "track",
      "q": query,
    };
    
    let q = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    const response = await fetch('https://api.spotify.com/v1/search?' + q, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    if (!response.ok) {
      throw new Error('Error: Gagal mengambil data', response.error);
    }

    const data = await response.json();
    return data?.tracks?.items;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export {
  getRecommendedSongs,
  getSearchedSongs,
}