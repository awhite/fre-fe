import axios, { AxiosRequestConfig } from 'axios'

type CancelableRequest = [Promise<any>, () => void]

const http = axios.create({ baseURL: 'http://localhost:8080' })

function executeCancelableRequest(
  config: AxiosRequestConfig
): CancelableRequest {
  const cancelToken = axios.CancelToken
  const source = cancelToken.source()
  const resultsPromise = new Promise(async (resolve, reject) => {
    try {
      const res = await http({
        ...config,
        cancelToken: source.token,
      })
      resolve(res.data)
    } catch (err) {
      reject(err)
    }
  })

  const cancelRequest = () => {
    source.cancel()
  }
  return [resultsPromise, cancelRequest]
}

export function search(query: string): CancelableRequest {
  return executeCancelableRequest({
    url: '/search',
    params: {
      query,
    },
  })
}

export function getRandomEpisodeForShow(showId: number) {
  return executeCancelableRequest({
    url: `/show/${showId}/episode/random`,
  })
}
