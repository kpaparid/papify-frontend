import * as FileSystem from 'expo-file-system'
import { useDispatch } from 'react-redux'
import { setCollection } from '../redux/reducer'

import * as MediaLibrary from 'expo-media-library'
const backend = 'http://localhost:5000' // For saving to media library (optional)

const useApi = () => {
  const dispatch = useDispatch()
  const addTrackCategory = (trackId: string, categoryId: string) =>
    fetch(backend + '/tracks/' + trackId + '/categories/' + categoryId, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(() => getSongs())
  const downloadSong = async (
    spotifyId: string,
    name: string,
    artist: string,
    collectionIds: string[],
  ) => {
    let fileUri = `${backend}/tracks/${spotifyId}/download` // Replace with your download URL
    if (collectionIds) fileUri += `?ids=${collectionIds.join(',')}`

    // Download the file
    const filename = name + '-' + artist + '-' + spotifyId + '.mp3'
    const fileUriLocal = FileSystem.documentDirectory + filename

    const callback = downloadProgress => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
      // setDownloadProgress(progress)
      console.log(progress)
    }
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUri,
      fileUriLocal,
      {},
      callback,
    )
    try {
      console.log('Started Download')
      const dl = await downloadResumable.downloadAsync()
      // const { uri } = await FileSystem.downloadAsync(fileUri, fileUriLocal)
      console.log('Successfully downloaded file to:', dl)
      await moveMp3(filename)
      await getSongs()
    } catch (error) {
      console.error('Error downloading file:', error)
      // Handle specific errors here
    }
  }

  async function moveMp3(filename: string) {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') {
      console.error('Permission to access media library is not granted')
      return
    }

    // Get files in the app's document directory
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + '')

    const mp3File = files.find(file => file === filename)
    if (mp3File) {
      console.log('File found ' + mp3File)
      const sourceUri = FileSystem.documentDirectory + mp3File
      // Define the destination URI
      const asset = await MediaLibrary.createAssetAsync(sourceUri)
      await MediaLibrary.createAlbumAsync('Papify', asset, false)

      // Delete the original file after moving it
      return await FileSystem.deleteAsync(sourceUri)
    }
  }

  const removeTrackCategory = (trackId: string, categoryId: string) =>
    fetch(backend + '/tracks/' + trackId + '/categories/' + categoryId, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => getSongs())
      .catch(err => {
        console.log(err)
      })

  const removeSongs = (ids: string[]) =>
    fetch(backend + '/tracks?' + ids.map(id => `id=${id}`).join('&'), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(() => getSongs())
      .catch(err => {
        console.log(err)
      })

  const addSongs = (data: Track[]) => {
    // console.log(data)
    return fetch(backend + '/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(() => getSongs())
      .catch(err => {
        console.log(err)
      })
  }

  const getSongs = () => {
    // console.log('get songs')
    return fetch(backend + '/tracks')
      .then(response => {
        // console.log({ response })
        return response.json()
      })
      .then(data => {
        // console.log({ data })
        dispatch(setCollection(data))
      })
      .catch(error => console.log(error))
  }

  return {
    addSongs,
    getSongs,
    removeSongs,
    removeTrackCategory,
    addTrackCategory,
    downloadSong,
  }
}
export default useApi
