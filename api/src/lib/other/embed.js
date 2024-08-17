import { get } from "./check.js";

export const config = {
  base: "api.insertunit.ws",
  url: "https://api.insertunit.ws",
};

export async function getEmbedInfo(type, info) {
  try {
    const path = `embed/imdb/${info.imdbId}`;
    const response = await get(`${config.url}/${path}`, config.base, false);
    if (!response || response.status !== 200) return null;

    let contents = "";
    let dash = "";
    let audio = { names: [], order: [] };
    let audioIndex;
    let subtitles = [];

    if (type === "movie") {
      dash = /dash:\s"(.+?)"/.exec(response.data)[1];

      try {
        audio = JSON.parse(/audio:\s+({.*\})/.exec(response.data)[1]);
      } catch {}

      try {
        subtitles = JSON.parse(/cc:\s+(\[{.*\}\])/.exec(response.data)[1]);
      } catch {}
    } else {
      const seasons = JSON.parse(/seasons:(\[{.*\}\])/.exec(response.data)[1]);
      const episodes = seasons.find(
        (s) => !s.blocked && s.season.toString() === info.season.toString(),
      ).episodes;
      const episode = episodes.find(
        (e) => e.episode.toString() === info.episode.toString(),
      );

      dash = episode.dash;
      audio = episode.audio;
      subtitles = episode.cc;
    }

    if (!dash || typeof dash !== "string" || !dash.endsWith(".mpd")) {
      return null;
    }

    subtitles = subtitles.filter(function (subtitle) {
      return (
        subtitle.url &&
        typeof subtitle.url === "string" &&
        subtitle.url.endsWith(".vtt") &&
        subtitle.name &&
        typeof subtitle.name === "string"
      );
    });

    try {
      audioIndex = (audio.names || []).findIndex(function (_name) {
        const name = _name.toLowerCase();
        return (
          (name.startsWith("eng") || name.includes("original")) &&
          !name.includes("commentary")
        );
      });
    } catch {}

    if (audioIndex === -1) {
      return null;
    }

    const dashResponse = await get(dash, null, false);
    if (!dashResponse || dashResponse.status !== 200) return null;

    try {
      contents = dashResponse.data
        .replace(
          new RegExp(
            `<AdaptationSet[^>]*lang="([^"]*?)(?<!${audioIndex})"[^>]*>.*?<\\/AdaptationSet>`,
            "gs",
          ),
          "",
        )
        .replace(/\s+/g, " ")
        .replace(/>\s*</g, "><")
        .trim();
    } catch {
      return null;
    }

    return {
      source: {
        contents,
        type: "application/dash+xml",
      },
      subtitles,
    };
  } catch {
    return null;
  }
}
