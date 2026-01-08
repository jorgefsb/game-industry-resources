const studios = [
    {
        name: "Amber Studio",
        country: "MX",
        flag: "🇲🇽",
        type: "AAA/Co-dev",
        description: "Servicios de desarrollo completo y co-dev para AAA. Oficinas en Guadalajara.",
        tags: ["Unity", "Unreal", "AAA"],
        hiring: true,
        url: "https://amberstudio.com"
    },
    {
        name: "Halberd Studios",
        country: "MX",
        flag: "🇲🇽",
        type: "Indie",
        description: "Creadores de '9 Years of Shadows'. Especialistas en Pixel Art de alta calidad.",
        tags: ["Indie", "Pixel Art", "Unity"],
        hiring: false,
        url: "https://halberdstudios.com/"
    },
    {
        name: "Navegante",
        country: "MX",
        flag: "🇲🇽",
        type: "Indie",
        description: "El equipo detrás de 'Greak: Memories of Azur'. Arte dibujado a mano.",
        tags: ["Indie", "Hand-Drawn", "Unity"],
        hiring: false,
        url: "https://navegante.games/"
    },
    {
        name: "Lienzo",
        country: "MX",
        flag: "🇲🇽",
        type: "Indie III",
        description: "Famosos por 'Mulaka' y 'Aztech'. Cultura mexicana en juegos de acción.",
        tags: ["Unreal", "Culture", "Action"],
        hiring: true,
        url: "https://www.lienzo.mx/"
    },
    {
        name: "HyperBeard",
        country: "MX",
        flag: "🇲🇽",
        type: "Mobile",
        description: "El estudio de mobile más grande de México. 'KleptoCats', 'Adorable Home'.",
        tags: ["Mobile", "Casual", "Unity"],
        hiring: true,
        url: "https://hyperbeard.com/"
    },
    {
        name: "Teravision Games",
        country: "CO",
        flag: "🇨🇴",
        type: "AA/AAA",
        description: "Desarrolladores de 'Killer Klowns from Outer Space'. Co-dev expertos.",
        tags: ["Unreal", "Multiplayer", "AAA"],
        hiring: true,
        url: "https://www.teravisiongames.com/"
    },
    {
        name: "Dreams Uncorporated",
        country: "CO",
        flag: "🇨🇴",
        type: "Indie",
        description: "Creadores de 'Cris Tales'. Famosos por su arte 2D espectacular.",
        tags: ["Indie", "RPG", "Unity"],
        hiring: false,
        url: "https://www.dreamsuncorporated.com/"
    },
    {
        name: "Cocodrilo Dog",
        country: "CO",
        flag: "🇨🇴",
        type: "Indie",
        description: "Estudio detrás de 'Moana' (Music Game) y 'Boom Fighters'.",
        tags: ["Audio", "Indie", "Unity"],
        hiring: false,
        url: "https://cocodrilodog.com/"
    },
    {
        name: "Nimble Giant",
        country: "AR",
        flag: "🇦🇷",
        type: "AA/AAA",
        description: "Uno de los gigantes de LATAM. 'Quantum League', 'Star Trek Infinite'.",
        tags: ["Strategy", "Shooter", "AA"],
        hiring: true,
        url: "https://nimblegiant.com/"
    },
    {
        name: "Etermax",
        country: "AR",
        flag: "🇦🇷",
        type: "Mobile",
        description: "Creadores del hit mundial 'Preguntados'. Líderes en mobile social.",
        tags: ["Mobile", "Social", "Tech"],
        hiring: true,
        url: "https://www.etermax.com/"
    },
    {
        name: "Globant",
        country: "LATAM",
        flag: "🌎",
        type: "Tech/AAA",
        description: "Gigante tecnológico con división de gaming fuerte. Trabajan con EA, Ubisoft.",
        tags: ["Tech", "AAA", "Engineering"],
        hiring: true,
        url: "https://www.globant.com/studio/gaming-esports"
    },
    {
        name: "Ironhide Game Studio",
        country: "UY",
        flag: "🇺🇾",
        type: "Indie Legend",
        description: "Creadores de 'Kingdom Rush'. Leyendas del Tower Defense mundial.",
        tags: ["Mobile", "Strategy", "2D"],
        hiring: false,
        url: "https://www.ironhidegames.com/"
    },
    {
        name: "Aquiris (Epic Games Brazil)",
        country: "BR",
        flag: "🇧🇷",
        type: "AAA",
        description: "Creadores de 'Horizon Chase'. Ahora son parte de Epic Games.",
        tags: ["AAA", "Racing", "Unreal"],
        hiring: true,
        url: "https://www.aquiris.com.br/"
    },
    {
        name: "Wildlife Studios",
        country: "BR",
        flag: "🇧🇷",
        type: "Mobile Unicorn",
        description: "Uno de los unicornios móviles más grandes del mundo. 'Tennis Clash'.",
        tags: ["Mobile", "Multiplayer", "Tech"],
        hiring: true,
        url: "https://wildlifestudios.com/"
    }
];

function renderStudios(filter = "TODO", searchQuery = "") {
    const grid = document.getElementById("studiosGrid");
    grid.innerHTML = "";

    const filtered = studios.filter(s => {
        const matchesFilter = filter === "TODO" ||
            (filter === "HIRING" && s.hiring) ||
            s.country === filter ||
            (filter === "MÉXICO" && s.country === "MX") ||
            (filter === "COLOMBIA" && s.country === "CO") ||
            (filter === "ARGENTINA" && s.country === "AR") ||
            (filter === "CHILE" && s.country === "CL"); // Add Chile studios later

        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    filtered.forEach((studio, index) => {
        const card = document.createElement("a");
        card.href = studio.url;
        card.target = "_blank";
        card.className = `card studio-card ${studio.hiring ? 'hiring' : ''}`;
        card.style.animationDelay = `${index * 100}ms`; // Staggered animation
        card.innerHTML = `
      ${studio.hiring ? '<div class="hiring-badge">HIRING</div>' : ''}
      <div class="card-icon">${getIcon(studio.type)}</div>
      <h3 class="card-title">${studio.name} <span class="flag">${studio.flag}</span></h3>
      <p class="card-description">${studio.description}</p>
      <div class="card-tags">
        ${studio.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `;
        grid.appendChild(card);
    });

    // Update Stats
    document.getElementById('stat-active').innerText = studios.length;
    document.getElementById('stat-hiring').innerText = studios.filter(s => s.hiring).length;
}

function getIcon(type) {
    if (type.includes("AAA")) return "🏢";
    if (type.includes("Indie")) return "👾";
    if (type.includes("Mobile")) return "📱";
    return "🎮";
}

document.addEventListener("DOMContentLoaded", () => {
    renderStudios();

    // Filter Logic
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            let filter = e.target.innerText.replace('🔥 ', '').replace('🇲🇽 ', '').replace('🇨🇴 ', '').replace('🇦🇷 ', '').replace('🇨🇱 ', '');
            if (e.target.innerText.includes('HIRING')) filter = 'HIRING';

            renderStudios(filter);
            playSound('click'); // Using the global sound function
        });
    });

    // Search Logic
    document.querySelector('.terminal-input').addEventListener('input', (e) => {
        renderStudios("TODO", e.target.value);
    });
});
