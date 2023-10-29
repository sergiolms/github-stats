const URL_PREFIX = 'https://api.github.com';

export const GitHubApi = {
    FetchLatestRelease: async(userName, repoName) => makeRequest(`${URL_PREFIX}/repos/${userName}/${repoName}/releases/latest`),
    FetchAllReleases: async(userName, repoName) => makeRequest(`${URL_PREFIX}/repos/${userName}/${repoName}/releases`)
}

const makeRequest = async (url) => {
    const response = await fetch(url);
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message);
    }

    return body;
}