import { getTheme, setTheme } from "./store/theme.js";
import { getAdult, setAdult } from "./store/adult.js";
import { getPages, getPage, setPage } from "./store/pages.js";
import { getSections, getSection, setSection } from "./store/sections.js";
import { getWatchSections, getWatchSection, setWatchSection } from "./store/watch-sections.js";
import { resetCache } from "./cache.js";
import { resetContinueWatching } from "./store/continue.js";
import { resetLastPlayed } from "./store/last-played.js";
import { getLanguages } from "./api/languages.js";
import { getLanguage, setLanguage } from "./store/language.js";

export const config = {
    author: "Snipcola",
    name: "FilmHaven",
    defaultLanguage: "en",
    header: {
        name: {
            normal: {
                text: "Film",
                accent: "Haven"
            },
            mobile: {
                text: "F",
                accent: "H"
            }
        },
        links: [
            {
                icon: "home",
                text: "Home"
            },
            {
                icon: "film",
                text: "Movies"
            },
            {
                icon: "tv",
                text: "Shows"
            },
            {
                icon: "cog",
                text: "Settings"
            }
        ]
    },
    footer: {
        links: [
            {
                icon: "file",
                url: window.location.pathname,
                label: "Download",
                download: "FilmHaven.html"
            },
            {
                icon: "youtube",
                url: "https://youtube.com/snipcola",
                label: "YouTube"
            },
            {
                icon: "github",
                url: "https://git.snipcola.com/snipcola",
                label: "Git"
            }
        ]
    },
    modal: {
        validTypes: ["g", "m", "s"]
    },
    search: {
        debounce: 500
    },
    carousel: {
        amount: 4,
        switchSlideInterval: 10000
    },
    area: {
        maxTitleLength: 25,
        amount: 16,
        split: {
            max: 700,
            desktop: 4,
            mobile: 2
        }
    },
    genre: {
        split: {
            max: 900,
            desktop: 5,
            mobile: 2
        }
    },
    cast: {
        split: {
            max: 700,
            desktop: 4,
            mobile: 2
        }
    },
    reviews: {
        split: {
            max: 700,
            desktop: 2,
            mobile: 1
        }
    },
    recommendations: {
        amount: 8,
        split: {
            max: 700,
            desktop: 2,
            mobile: 2
        }
    },
    query: {
        page: "p",
        modal: "m"
    },
    maxDescriptionLength: 230,
    maxReviewContentLength: 230,
    maxCacheDays: 5,
    maxMobileWidth: 700
};

export const api = {
    url: "https://api.themoviedb.org",
    version: "3",
    key: "5622cafbfe8f8cfe358a29c53e19bba0",
    image: {
        url: "https://image.tmdb.org/t/p",
        poster: "w342",
        backdrop: "w1280",
        cast: "w150_and_h150_face",
        avatar: "w150_and_h150_face",
        episode: "w185"
    },
    trending: {
        timeWindow: "week"
    }
};

export const proxy = {
    checkTimeout: 2500,
    validCheckTimeout: 5000
};

export const proxies = [
    {
        base: "/proxy",
        url: function (path) {
            return `/proxy?url=${path}`;
        }
    },
    {
        base: "https://fh-site.vercel.app/proxy",
        url: function (path) {
            return `https://fh-site.vercel.app/proxy?url=${path}`;
        }
    }
];

export const providers = {
    "vidsrc.to": {
        movieUrl: function ({ id }) {
            return `https://vidsrc.to/embed/movie/${id}`;
        },
        showUrl: function ({ id, season, episode }) {
            return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
        }
    },
    "vidsrc.me": {
        movieUrl: function ({ id }) {
            return `https://vidsrc.me/embed/movie?tmdb=${id}`;
        },
        showUrl: function ({ id, season, episode }) {
            return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
        }
    },
    "flixon.lol": {
        movieUrl: function ({ imdbId }) {
            return `https://flixon.lol/${imdbId}`;
        },
        showUrl: function ({ id, season, episode }) {
            return `https://flixon.lol/${id}-${season}-${episode}`;
        } 
    },
    "2embed.me": {
        movieUrl: function ({ imdbId }) {
            return `https://2embed.me/player/movie/${imdbId}`;
        },
        showUrl: function ({ id, season, episode }) {
            return `https://2embed.me/player/tv/${id}/S${season}/E${episode}`;
        } 
    },
    "databasegdriveplayer.xyz": {
        movieUrl: function ({ id }) {
            return `https://databasegdriveplayer.xyz/player.php?tmdb=${id}`;
        },
        showUrl: function ({ id, season, episode }) {
            return `https://databasegdriveplayer.xyz/player.php?type=series&tmdb=${id}&season=${season}&episode=${episode}`;
        } 
    }
};

export const store = {
    names: {
        cache: function (key) {
            return `fhc-${key}`;
        },
        theme: "fh-theme",
        adult: "fh-adult",
        language: "fh-language",
        provider: "fh-provider",
        lastPlayed: "fh-last-played",
        pages: "fh-pages",
        sections: "fh-sections",
        watchSections: "fh-watch-sections",
        continue: "fh-continue"
    }
};

export const themes = {
    auto: "Auto",
    dark: "Dark",
    light: "Light"
};

export const adult = {
    show: "Show",
    hide: "Hide"
};

export const sections = {
    Search: true,
    Continue: true,
    Carousel: true,
    Genres: true,
    Trending: true,
    "Top-Rated": true,
    New: true
};

export const watchSections = {
    Video: true,
    Providers: true,
    Seasons: true,
    Description: true,
    Cast: true,
    Reviews: true,
    Misc: true,
    Recommendations: true
};

export const settings = [
    {
        label: {
            icon: "paint-brush",
            text: "Theme"
        },
        items: function () {
            const currentTheme = getTheme();
            const themeItems = Object.values(themes);
            
            return themeItems.map((t) => ({
                label: t,
                value: t.toLowerCase(),
                active: t.toLowerCase() === currentTheme
            }));
        },
        onSelect: setTheme,
        type: "select"
    },
    {
        label: {
            icon: "censor",
            text: "Adult Content"
        },
        items: function () {
            const currentAdult = getAdult();
            const adultItems = Object.values(adult);

            return adultItems.map((a) => ({
                label: a,
                value: a.toLowerCase(),
                active: a.toLowerCase() === currentAdult
            }));
        },
        onSelect: setAdult,
        type: "select"
    },
    {
        label: {
            icon: "language",
            text: "Language (reset required)"
        },
        items: async function () {
            const languages = await getLanguages();

            return languages.map((l) => ({
                label: l.name,
                value: l.value,
                active: l.value === getLanguage()
            }));
        },
        onSelect: function (l) {
            setLanguage(l);
            resetCache("languages");
            resetContinueWatching();
            resetLastPlayed();

            document.body.classList.remove("active");
            window.location.reload();
        },
        type: "select"
    },
    {
        label: {
            icon: "list",
            text: "Presets"
        },
        items: function () {
            return [
                {
                    label: "...",
                    value: "",
                    placeholder: true
                },
                {
                    label: "Full",
                    value: "full"
                },
                {
                    label: "Minimal",
                    value: "minimal"
                },
                {
                    label: "Minimal+",
                    value: "extra-minimal"
                }
            ];
        },
        onSelect: function (i) {
            if (i === "full") {
                const pages = getPages();
                const sections = getSections();
                const watchSections = getWatchSections();

                for (const page of Object.keys(pages)) {
                    setPage(page, true);
                }

                for (const section of Object.keys(sections)) {
                    setSection(section, true);
                }

                for (const watchSection of Object.keys(watchSections)) {
                    setWatchSection(watchSection, true);
                }

                document.body.classList.remove("active");
                window.location.href = `${(window.location.href || "").split("?")[0]}?${config.query.page}=4`;
            } else if (i === "minimal") {
                const pages = getPages();
                const sections = getSections();
                const watchSections = getWatchSections();

                for (const page of Object.keys(pages)) {
                    setPage(page, ["Home"].includes(page));
                }

                for (const section of Object.keys(sections)) {
                    setSection(section, ["Search", "Continue", "Carousel", "Genres"].includes(section));
                }

                for (const watchSection of Object.keys(watchSections)) {
                    setWatchSection(watchSection, ["Video", "Providers", "Seasons"].includes(watchSection));
                }

                document.body.classList.remove("active");
                window.location.href = `${(window.location.href || "").split("?")[0]}?${config.query.page}=2`;
            } else {
                const pages = getPages();
                const sections = getSections();
                const watchSections = getWatchSections();

                for (const page of Object.keys(pages)) {
                    setPage(page, ["Home"].includes(page));
                }

                for (const section of Object.keys(sections)) {
                    setSection(section, ["Search", "Continue"].includes(section));
                }

                for (const watchSection of Object.keys(watchSections)) {
                    setWatchSection(watchSection, ["Video"].includes(watchSection));
                }

                document.body.classList.remove("active");
                window.location.href = `${(window.location.href || "").split("?")[0]}?${config.query.page}=2`;
            }
        },
        preventChange: true,
        type: "select"
    },
    {
        label: {
            icon: "file",
            text: "Pages (refresh required)"
        },
        items: function () {
            const pages = getPages();

            return Object.entries(pages).map(([p, a]) => ({
                label: p,
                value: p,
                active: a
            }));
        },
        onClick: function (p) {
            setPage(p, !getPage(p));
        },
        type: "selection",
        multi: true
    },
    {
        label: {
            icon: "tags",
            text: "Sections (refresh required)"
        },
        items: function () {
            const sections = getSections();

            return Object.entries(sections).map(([s, a]) => ({
                label: s,
                value: s,
                active: a
            }));
        },
        onClick: function (s) {
            setSection(s, !getSection(s));
        },
        type: "selection",
        multi: true
    },
    {
        label: {
            icon: "play",
            text: "Watch Sections"
        },
        items: function () {
            const watchSections = getWatchSections();

            return Object.entries(watchSections).map(([w, a]) => ({
                label: w,
                value: w,
                active: a
            }));
        },
        onClick: function (w) {
            setWatchSection(w, !getWatchSection(w));
        },
        type: "selection",
        multi: true
    },
    {
        label: {
            icon: "box",
            text: "Data"
        },
        items: function () {
            return [
                {
                    label: {
                        icon: "sync",
                        text: "Reset"
                    },
                    onClick: function (self) {
                        localStorage.clear();

                        document.body.classList.remove("active");
                        window.location.href = `${(window.location.href || "").split("?")[0]}?${config.query.page}=4`;

                        self.classList.add("inactive");
                        self.querySelector(".icon").className = "icon icon-check";
                    }
                },
                {
                    label: {
                        icon: "sync",
                        text: "Empty Cache"
                    },
                    onClick: function (self) {
                        resetCache();
                        document.body.classList.remove("active");
                        window.location.reload();

                        self.classList.add("inactive");
                        self.querySelector(".icon").className = "icon icon-check";
                    }
                },
                {
                    label: {
                        icon: "eye-slash",
                        text: "Clear Continue Watching"
                    },
                    class: "secondary",
                    onClick: function (self) {
                        resetContinueWatching();

                        self.classList.add("inactive");
                        self.querySelector(".icon").className = "icon icon-check";

                        setTimeout(function () {
                            self.querySelector(".icon").className = "icon icon-eye-slash";
                            self.classList.remove("inactive");
                        }, 2500);
                    }
                },
                {
                    label: {
                        icon: "eye-slash",
                        text: "Clear Last Watched"
                    },
                    class: "secondary",
                    onClick: function (self) {
                        resetLastPlayed();

                        self.classList.add("inactive");
                        self.querySelector(".icon").className = "icon icon-check";

                        setTimeout(function () {
                            self.querySelector(".icon").className = "icon icon-eye-slash";
                            self.classList.remove("inactive");
                        }, 2500);
                    }
                }
            ];
        },
        type: "buttons"
    }
];