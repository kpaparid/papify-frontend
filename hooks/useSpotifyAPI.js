import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAlbums, addArtists, addPlaylists, addSearch, addToken } from '../redux/reducer'
import { getTopResults } from '../utils/helpers'
const useSpotifyAPI = () => {
  const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
  const dispatch = useDispatch()
  const token = useSelector(state => state.data.token)

  const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    })
    const token = (await response.json()).access_token
    dispatch(addToken(token))
    return token
  }

  const getArtist = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/artists/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data
  }
  const getArtistAlbums = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/artists/${id}/albums?market=gr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data.items
  }
  const getArtistRelatedArtists = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/artists/${id}/related-artists`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data.artists
  }
  const getArtistTracks = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/artists/${id}/top-tracks?market=gr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data.tracks
  }
  const getArtistDetails = async id => {
    const [[artist, playlists], tracks, related, albums] = await getAccessToken().then(
      async token =>
        await Promise.all([
          getArtist(id, token).then(async artist => {
            const playlist = await getPlaylists(artist.name, token)
            return [artist, playlist]
          }),
          getArtistTracks(id, token),
          getArtistRelatedArtists(id, token),
          getArtistAlbums(id, token).then(
            async albums =>
              await getAlbums(
                albums.map(({ id }) => id),
                token,
              ),
          ),
        ]),
    )
    const albumTracks = albums.albums.flatMap(album =>
      album.tracks.items.map(item => ({ ...item, popularity: album.popularity, album })),
    )
    const tracksByName = [...albumTracks, ...tracks]
      .sort((a, b) => a.popularity - b.popularity)
      .reduce((a, b) => ({ ...a, [b.name]: b }), {})

    dispatch(
      addArtists({
        artist,
        tracks: Object.values(tracksByName).sort((a, b) => b.popularity - a.popularity),
        related,
        albums,
        playlists,
      }),
    )
    return { artist, tracks, related, albums, playlists }
  }
  const getTracks = async ids => {
    const response = await fetch(`${SPOTIFY_API_URL}/tracks?ids=${ids}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    return data.tracks
  }
  const getAlbums = async (ids, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/albums?ids=${ids}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data
  }
  const getAlbum = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/albums/${id}?market=gr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data
  }
  const getAlbumDetails = async id => {
    const data = await getAccessToken().then(async token => await getAlbum(id, token))
    dispatch(addAlbums(data))
    return data
  }
  const getPlaylist = async (id, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/playlists/${id}?market=gr`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data
  }
  const getPlaylistDetails = async id => {
    const data = await getAccessToken().then(async token => await getPlaylist(id, token))
    dispatch(addPlaylists(data))
    return data
  }
  const getPlaylists = async (query, t = token) => {
    const response = await fetch(`${SPOTIFY_API_URL}/search?q=${query}&type=playlist&market=gr&limit=30`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${t}`,
      },
    })
    const data = await response.json()
    return data.playlists.items
  }
  const searchSpotify = async (query, t = token) => {
    const response = await fetch(
      `${SPOTIFY_API_URL}/search?q=${query}&type=artist%2Calbum%2Ctrack%2Cplaylist&market=gr&limit=30`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${t}`,
        },
      },
    )
    const data = await response.json()
    return data
  }
  const getSearchResults = async value => {
    const res = await getAccessToken().then(token => searchSpotify(value, token))

    const topResults = getTopResults(value, {
      artists: res.artists.items,
      albums: res.albums.items,
      playlists: res.playlists.items,
      tracks: res.tracks.items,
    })
    const mappedTopResults = topResults.map(({ item, score }) => ({
      ...item,
      score,
    }))

    const data = {
      topResult: mappedTopResults
        .filter(({ type }) => type === 'artist' || type === 'track')
        .reduce((a, b) => {
          if (!a) return b
          if (b.popularity > a.popularity && (b.type === 'track' ? b.score < 0.1 : b.score < 0.25)) return b
          return a
        }, null),
    }
    data.albums = mappedTopResults.filter(({ type }) => type === 'album')
    data.playlists = mappedTopResults.filter(({ type }) => type === 'playlist')
    data.tracks = mappedTopResults.filter(({ type }) => type === 'track')
    data.artists = mappedTopResults
      .filter(({ type, followers, images }) => type === 'artist' && followers.total > 70 && images?.length > 0)
      .sort((a, b) => {
        if (
          data.tracks
            .slice(0, 5)
            .reduce((a, { artists }) => [...a, ...artists.map(({ name }) => name)], [])
            .includes(b.name)
        )
          return 1
        else if (
          data.tracks
            .slice(0, 5)
            .reduce((a, { artists }) => [...a, ...artists.map(({ name }) => name)], [])
            .includes(a.name)
        )
          return -1
        else if (data.topResult.type === 'artist' && a.id === data.topResult.id) return -1
        if (data.topResult.type === 'artist' && b.id === data.topResult.id) return 1
        // else if(data.topResult.type === 'track' && )
        else return 0
      })

    dispatch(addSearch(data))
    return data
  }
  useEffect(() => {
    getAccessToken().then(token => addToken(token))
  }, [])
  return {
    token,
    getSearchResults,
    getArtistDetails,
    getAlbumDetails,
    getPlaylistDetails,
  }
}
export default useSpotifyAPI
