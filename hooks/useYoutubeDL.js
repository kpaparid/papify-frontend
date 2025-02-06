import { YOUTUBE_API } from '@env'
const useYoutubeDL = () => {
  const searchYT = (searchTerm, maxResults = 1) => {
    const params = new URLSearchParams({
      part: 'snippet',
      q: searchTerm,
      order: 'relevance',
      maxResults,
      key: YOUTUBE_API, // Pass your API key here
    })

    return fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    )
      .then(response => {
        const data = response.json()
        if (!response.ok || data.error) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return data
      })
      .catch(error => console.log(error, YOUTUBE_API))
  }
  return { searchYT }
}

export default useYoutubeDL
