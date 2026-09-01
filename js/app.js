const VIDEO_IDS = [
    "aHYvmY3nV5U", "5rjCRPG3mkw", "oM9fUlGET-w", "UaMBtjxvuMA",
    "VZzSBv6tXMw", "5qap5aO4i9A", "0e3GPea1Tyg", "zxYjTTXc-J8",
    "4SNThp0YiU4", "vcdxMNgHTrc", "2iXfRr6-vks", "L1Ta38LNcUE",
    "_u3NH5yGZt0", "npTC6b5-yvM", "GW_fdXHOWp4", "htg_e_Q8D6s",
    "OTlVmfO_j0Q", "wAMZ6KpMGQI", "5qR82rFJG7I", "b89CnP0Iq30",
    "jNQXAC9IVRw", "_OBlgSz8sSM", "dhsy6epaJGs", "3bTER3G6YlI",
    "vM34iKSsW0Y", "t7gIutuQQLs", "lSm4QZqN8cA", "M4LWw7Jpij8",
    "F81wlI9iEpw", "EbaRo2hMEqM", "bf-B1QORoMM", "yI9Ynn6JjvM",
    "6Dh-RL__uN4", "oE2rfyhIsuk", "dQw4w9WgXcQ", "2yJgwwDcgV8",
    "zAG83xZhgsc", "kJQP7kiw5Fk", "uAOR6ib95kQ", "HyHNuVaZJ-k",
    "XqZsoesa55w", "YeJiADXCDis", "M3oT3-4sSOY", "leEGG-o0cJQ",
    "dBxOYE2j55U", "KK9bwTlAvgo", "sboXdNY4g9I", "TaQj43Lf3tw",
    "bix8qWbrZ-0", "iuQoT2hUVjk", "rYyfQiTHs7w", "QdBZY2fkU-0",
    "Ci_zad39Uhw", "9bZkp7q19f0", "JGwWNGJdvx8", "gdZLi9oWNZg",
    "RgKAFK5djSk", "CocEMWdc7Ck", "1-xGerv5FOk", "Pkh8UtuejGw",
    "DPMluEVUqS0", "By_Cn5ixYLg", "UOxkGD8qRB4", "fmI_Ndrxy14",
    "MmB9b5njVbA", "ekr2nIex040", "H5v3kku4y6Q", "K17df81RL9Y",
    "qrO4YZeyl0I", "hT_nvWreIhg", "oRdxUFDoQe0"
];

const videoCache = {};
let usedIndexes = [];
let score = 0;
let record = Number(localStorage.getItem("higherlower_record")) || 0;
let current;
let next;

async function fetchVideoData(id) {
    const proxyUrl = new URL("api/youtubeProxy.php", document.baseURI);
    proxyUrl.searchParams.set("id", id);

    const response = await fetch(proxyUrl);
    const responseText = await response.text();
    let data;

    try {
        data = JSON.parse(responseText);
    } catch (error) {
        console.error("Respuesta no válida del proxy:", responseText);
        throw new Error("El servidor no devolvió JSON válido.");
    }

    if (!response.ok || data.error) {
        throw new Error(data.error || `Error HTTP ${response.status}`);
    }

    return data;
}

async function getRandomVideo(excludeIndex = null) {
    let index;

    do {
        index = Math.floor(Math.random() * VIDEO_IDS.length);
    } while (index === excludeIndex || usedIndexes.includes(index));

    usedIndexes.push(index);

    if (usedIndexes.length >= VIDEO_IDS.length - 1) {
        usedIndexes = [];
    }

    const videoId = VIDEO_IDS[index];

    if (videoCache[videoId]) {
        return { ...videoCache[videoId], index };
    }

    const data = await fetchVideoData(videoId);
    videoCache[videoId] = data;

    return { ...data, index };
}

function render() {
    document.getElementById("thumb1").src = current.thumb;
    document.getElementById("icon1").src = current.icon;
    document.getElementById("title1").innerText = current.title;
    document.getElementById("views1").innerText = `${current.views.toLocaleString()} views`;

    document.getElementById("thumb2").src = next.thumb;
    document.getElementById("icon2").src = next.icon;
    document.getElementById("title2").innerText = next.title;

    document.getElementById("play1").style.display = "flex";
    document.getElementById("play2").style.display = "flex";
}

function updateScore() {
    document.getElementById("score").innerText = score;
}

function updateBest() {
    document.getElementById("best").innerText = record;
}

async function startGame() {
    score = 0;
    updateScore();
    updateBest();

    const question = document.querySelector(".question");
    const choiceArea = document.querySelector(".choice-area");
    question.innerText = "Does it have more or fewer views?";
    choiceArea.style.display = "flex";

    try {
        current = await getRandomVideo();
        next = await getRandomVideo(current.index);
        render();
        return true;
    } catch (error) {
        showLoadError(error);
        return false;
    }
}

function showLoadError(error) {
    console.error("No se pudo iniciar el juego:", error);

    document.getElementById("title1").innerText = "Unable to load YouTube videos";
    document.getElementById("title2").innerText = error.message;
    document.getElementById("views1").innerText = "API unavailable";
    document.querySelector(".question").innerText = "Check your API key or connection, then reload.";
    document.querySelector(".choice-area").style.display = "none";
}

function showModal() {
    document.getElementById("recordText").innerText = `Score: ${score}`;
    document.getElementById("loseModal").style.display = "flex";
}

function animateViews(start, end) {
    return new Promise((resolve) => {
        const reveal = document.getElementById("views2");
        const duration = 1000;
        const stepTime = 20;
        const steps = Math.ceil(duration / stepTime);
        const increment = (end - start) / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const value = Math.floor(start + increment * currentStep);
            reveal.innerText = `${value.toLocaleString()} views`;

            if (currentStep >= steps) {
                reveal.innerText = `${end.toLocaleString()} views`;
                clearInterval(interval);
                resolve();
            }
        }, stepTime);
    });
}

function spawnConfetti() {
    const container = document.getElementById("confetti-container");
    const total = 40;

    for (let index = 0; index < total; index++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        const size = 6 + Math.random() * 10;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * (0.6 + Math.random())}px`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 85%, 60%)`;

        const shape = Math.random();
        if (shape < 0.33) {
            confetti.style.borderRadius = "0";
        } else if (shape < 0.66) {
            confetti.style.borderRadius = "50%";
        } else {
            confetti.style.transform = "skew(15deg)";
        }

        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.bottom = "0";

        const translateY = 250 + Math.random() * 250;
        const translateX = (Math.random() - 0.5) * 200;
        const rotate = Math.random() * 720;

        confetti.animate(
            [
                { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
                {
                    transform: `translate(${translateX}px, -${translateY}px) rotate(${rotate}deg)`,
                    opacity: 0
                }
            ],
            {
                duration: 1200 + Math.random() * 300,
                easing: "cubic-bezier(0.33, 1, 0.68, 1)",
                fill: "forwards"
            }
        );

        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}

function resetPlayers() {
    [1, 2].forEach((number) => {
        const image = document.getElementById(`thumb${number}`);
        image.parentNode.querySelectorAll("iframe").forEach((iframe) => iframe.remove());
        image.style.display = "block";
    });

    document.getElementById("play1").style.display = "flex";
    document.getElementById("play2").style.display = "flex";
}

async function restartGame() {
    const modal = document.getElementById("loseModal");
    const modalContent = document.getElementById("modalContent");
    const loader = document.getElementById("loadingSpinner");
    const reveal = document.getElementById("views2");

    modal.style.display = "flex";
    modalContent.style.display = "none";
    loader.style.display = "block";
    reveal.style.display = "none";

    resetPlayers();
    await startGame();

    modal.style.display = "none";
    modalContent.style.display = "block";
    loader.style.display = "none";
}

async function choose(option) {
    const reveal = document.getElementById("views2");
    reveal.style.display = "block";

    const correct =
        (option === "higher" && next.views > current.views) ||
        (option === "lower" && next.views < current.views);

    await animateViews(0, next.views);

    if (!correct) {
        showModal();
        return;
    }

    spawnConfetti();
    score++;

    if (score > record) {
        record = score;
        localStorage.setItem("higherlower_record", record);
    }

    updateBest();
    updateScore();

    setTimeout(async () => {
        resetPlayers();
        current = next;
        next = await getRandomVideo(current.index);
        reveal.style.display = "none";
        render();
    }, 500);
}

function playWithSound(number) {
    const image = document.getElementById(`thumb${number}`);
    const overlay = document.getElementById(`play${number}`);
    const videoId = number === 1 ? current.videoId : next.videoId;
    const container = image.parentNode;
    const existingPlayer = container.querySelector("iframe");

    // Si el reproductor ya existe, el propio iframe de YouTube gestiona
    // reproducir, pausar y reanudar sin volver a cargar el video.
    if (existingPlayer) {
        return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&playsinline=1&enablejsapi=1`;
    iframe.setAttribute("title", "Reproductor de YouTube");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    iframe.setAttribute("allowfullscreen", "");

    image.style.display = "none";
    overlay.style.display = "none";
    container.appendChild(iframe);
}

updateBest();
void startGame();
