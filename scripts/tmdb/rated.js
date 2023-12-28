import { sendRequest, getImageUrl, sortByPopularity } from "./main.js";
import { shortenNumber } from "../functions.js";
import { setCache, getCache } from "../cache.js";

function format(obj, type) {
    return obj
        ? obj.filter((i) => i.poster_path).map(function (item) {
            return {
                id: item.id?.toString(),
                type,
                description: item.overview || item.description,
                image: getImageUrl(item.poster_path, "poster"),
                rating: Math.round(item.vote_average / 2).toString(),
                stars: shortenNumber(item.vote_count)
            };
        })
        : null;
}

export async function getRated(type = "movie") {
    const cacheName = `rated-${type}`;
    const cache = getCache(cacheName);

    if (cache) return cache;
    
    const date = new Date();
    const formattedDateNow = date.toISOString().split('T')[0];
    
    date.setFullYear(date.getFullYear() - 2);
    const formattedDate = date.toISOString().split('T')[0];
    
    const response = await sendRequest(`discover/${type}`, {
        sort_by: "vote_count.desc",
        "vote_average.gte": "7",
        "primary_release_date.gte": formattedDate,
        "primary_release_date.lte": formattedDateNow,
        "first_air_date.gte": formattedDate,
        "first_air_date.lte": formattedDateNow
    });
    
    const json = format(response?.results, type);

    setCache(cacheName, json);
    return json;
}