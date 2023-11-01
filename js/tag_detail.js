export const BuildDetailTpl = (title, content, isOpen = false) => `
    <details class="relative grow-0 shrink-1 rounded-sm basis-80 m-1 group border-s-4 border-green-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden" ${isOpen ? 'open' : ''}>
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
        ${content}
    </details>
`;

export const BuildAssetListTpl = assets => {
    const totalDownloads = assets.reduce( (acc, element) => acc + element.download_count, 0);
    return `
        <ul style="top: calc(100% - 1.5rem); left: -4px; width: calc(100% + 4px)" class="absolute z-10 rounded-b-md group border-s-4 border-green-500 bg-gray-50 p-6 pt-0">${
        assets.map(element => {
            const progress = Math.round((element.download_count/totalDownloads) * 100)
            return `<li class="flex flex-row justify-between items-center mb-1">
                <div style="background: #c4e4c2; background: linear-gradient(90deg, #c4e4c2 ${progress}%, #ffffff ${progress}%);" class="bg-white w-full p-1">${element.name}</div>
                <div class="bg-blue-200 basis-10 flex-1 p-1 text-center">${element.download_count}</div>
            </li>`;
        }).join('')
    }</ul>`;
}