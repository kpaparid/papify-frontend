import * as FileSystem from 'expo-file-system'
import { useState } from 'react'
const useDownloadFile = (fileUri, filename) => {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const callback = downloadProgress => {
    const progress =
      downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
    setDownloadProgress(progress)
  }

  const downloadResumable = FileSystem.createDownloadResumable(
    fileUri,
    FileSystem.documentDirectory + filename,
    {},
    callback,
  )
  const downloadFile = async () => {
    try {
      const { uri } = await downloadResumable.downloadAsync()
      console.log('Finished downloading to ', uri)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const pauseDownload = async () => {
    try {
      await downloadResumable.pauseAsync()
      console.log('Paused download operation, saving for future retrieval')
      // AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumable.savable()))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const resumeDownload = async () => {
    try {
      const { uri } = await downloadResumable.resumeAsync()
      console.log('Finished downloading to ', uri)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
  //To resume a download across app restarts, assuming the DownloadResumable.savable() object was stored:
  // const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
  // const downloadSnapshot = JSON.parse(downloadSnapshotJson);
  // const downloadResumable = new FileSystem.DownloadResumable(
  //   downloadSnapshot.url,
  //   downloadSnapshot.fileUri,
  //   downloadSnapshot.options,
  //   callback,
  //   downloadSnapshot.resumeData
  // );

  // try {
  //   const { uri } = await downloadResumable.resumeAsync();
  //   console.log('Finished downloading to ', uri);
  // } catch (e) {
  //   console.error(e);
  // }
  return {
    downloadFile,
    pauseDownload,
    resumeDownload,
    downloadProgress,
  }
}
export default useDownloadFile
