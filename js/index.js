import { BuildDetailTpl, BuildAssetListTpl } from "./tag_detail.js";
import { GitHubApi } from "./github.js";

const _ = (query, target = document) => {
  const results = target.querySelectorAll(query);
  if (results.length === 1) {
    return results[0];
  }

  return results;
};

export const DoTheThing = async () => {
  const {userName, repoName} = getParamsFromURL()
  if (!userName || !repoName){
    return
  }

  _("input#username").value = userName;
  _("input#reponame").value = repoName;

  ([ 
      [GitHubApi.FetchLatestRelease,  nicePrintLatestRelease],
      [GitHubApi.FetchAllReleases, nicePrintReleases],
  ]).forEach(([req, resp]) =>{
    try {
      req(userName, repoName).then(resp)
    } catch(e){
      printErr(e)
    }
  });

}

const printErr = (message) => _("#error").innerHTML = `Oops! something happened:<br/>${message}`

const getParamsFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return {
    userName: urlParams.get("username"),
    repoName: urlParams.get("reponame")
  }
}

const nicePrintLatestRelease = ( lastRelease ) => {
  _("#lastRelease").innerHTML += BuildDetailTpl(
    `Latest release: <span>${lastRelease.tag_name}</span> - Downloads: ${lastRelease.assets.reduce((acc, asset)=> acc + asset.download_count, 0)}`, 
    BuildAssetListTpl(lastRelease.assets)
  )
}

const nicePrintReleases = ( allReleases ) => {
  for (let i = 1; i < allReleases.length; i++) {
    const r = allReleases[i];
    _("#releases").innerHTML += BuildDetailTpl(
      `<span>${r.tag_name}</span> - Downloads: ${r.assets.reduce((acc, asset)=> acc + asset.download_count, 0)}`, 
      BuildAssetListTpl(r.assets)
    )
  }

  const mostDownloadedVersion = allReleases.map(r => ({
    tag: r.tag_name, 
    downloads: r.assets.reduce((acc, asset) => acc + asset.download_count, 0)
  })).sort((a, b) => b.downloads - a.downloads)[0]

  const mostDownloadedAsset = allReleases.reduce((mostDownloaded, release)=>{
    release.assets.forEach( asset => {
      if (mostDownloaded.downloads < asset.download_count) {
        mostDownloaded = {
          name: asset.name,
          downloads: asset.download_count,
          version: release.tag_name
        };
      }
    });

    return mostDownloaded;
  }, {downloads: 0, version: null, name: null})

  _("#allTime").innerHTML=`
      <span>Total downloads:</span> ${allReleases.reduce((acc, release) => {
        return acc + release.assets.reduce((acc2, asset) => acc2 + asset.download_count, 0);
      }, 0)}<br/>
      <span>Most downloaded version:</span> ${mostDownloadedVersion.tag} (${mostDownloadedVersion.downloads})<br/>
      <span>Most downloaded asset:</span> ${mostDownloadedAsset.name} - ${mostDownloadedAsset.downloads} (${mostDownloadedAsset.version})<br/>
  `;
}