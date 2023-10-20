_ = (query, target = document) => target.querySelector(query);
__ = (query, target = document) => target.querySelectorAll(query);


buildDetailTpl = (title, content, isOpen = false) => {
  return `
  <details
    class="group border-s-4 border-green-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
    ${isOpen ? 'open' : ''}
  >
    <summary class="flex cursor-pointer items-center justify-between gap-1.5">
      <h2 class="text-lg font-medium text-gray-900">${title}</h2>

      <span class="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-45"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </summary>

    <p class="mt-4 leading-relaxed text-gray-700">${content}</p>
  </details>
`;
}

(async ()=>{
  urlParams = new URLSearchParams(window.location.search)

  userName = urlParams.get("username")
  repoName = urlParams.get("reponame")
  
  if (!userName || !repoName){
    return
  }

  _("#username").value = userName;
  _("#reponame").value = repoName;

  console.log(userName, repoName)

  const lastReleaseResp = await fetch(`https://api.github.com/repos/${userName}/${repoName}/releases/latest`);
  // TODO: improve error handling
  if (lastReleaseResp.status !== 200) {
    _("#error").innerHTML = `Oops something happened <br/> ${await lastReleaseResp.text()}`;
    return;
  } 

  const lastRelease = await lastReleaseResp.json();
  _("#releases").innerHTML = buildDetailTpl(
    `Latest release: <span>${lastRelease.tag_name}</span> - Downloads: ${lastRelease.assets.reduce((acc, asset)=> acc + asset.download_count, 0)}`, 
    `<ul>${
      lastRelease.assets.map(element => {
        return `<li>${element.name} - ${element.download_count}</li>`;
      }).join('')
    }</ul>`
  )

  const allReleasesResp = await fetch(`https://api.github.com/repos/${userName}/${repoName}/releases`);
  // TODO: improve error handling
  if (allReleasesResp.status !== 200) {
    _("#error").innerHTML = `Oops something happened <br/> ${await allReleasesResp.text()}`;
    return;
  } 
  const allReleases = await allReleasesResp.json();
  for (let i = 1; i < allReleases.length; i++) {
    r = allReleases[i];
    _("#releases").innerHTML += buildDetailTpl(
      `<span>${r.tag_name}</span> - Downloads: ${r.assets.reduce((acc, asset)=> acc + asset.download_count, 0)}`, 
      `<ul>${
        r.assets.map(element => {
          return `<li>${element.name} - ${element.download_count}</li>`;
        }).join('')
      }</ul>`
    )
  }

  mostDownloadedVersion = allReleases.map(r => ({
    tag: r.tag_name, 
    downloads: r.assets.reduce((acc, asset) => acc + asset.download_count, 0)
  })).sort((a, b) => b.downloads - a.downloads)[0]

  _("#allTime").innerHTML=`
      Total downloads: ${allReleases.reduce((acc, release) => {
        return acc + release.assets.reduce((acc2, asset) => acc2 + asset.download_count, 0);
      }, 0)}<br/>
      Most downloaded version: ${mostDownloadedVersion.tag} (${mostDownloadedVersion.downloads})<br/>
      Most downloaded asset: // TODO<br/>
  `;

})();