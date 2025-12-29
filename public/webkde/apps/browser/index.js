import OSApi from "{{file:/usr/lib/api/api.js}}";

const api = new OSApi();
const defaultFile = "/home/demo/Documents/linkedin.html";
const linkedInUrl = "https://www.linkedin.com/in/ansperson/";

const address = document.getElementById("address");
const page = document.getElementById("page");
const errorBox = document.getElementById("error");
const banner = document.getElementById("banner");
const bannerText = document.getElementById("banner-text");
const closeBannerButton = document.getElementById("close-banner");
const refreshButton = document.getElementById("refresh");
const openButton = document.getElementById("open");
const openBannerButton = document.getElementById("open-banner");

let currentFile = null;
let currentUrl = null;
let currentExternalUrl = linkedInUrl;

function setAddress(filePath) {
    if (filePath && filePath.endsWith("linkedin.html")) {
        address.value = linkedInUrl;
        return;
    }
    address.value = `file://${filePath}`;
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

async function loadFile(filePath) {
    currentFile = filePath || defaultFile;
    clearError();
    try {
        const response = await api.filesystem("read", currentFile);
        const html = response.data.content;
        const linkScript = `
            <script>
            document.addEventListener("click", function(event) {
                const link = event.target.closest("a");
                if (!link || !link.href) {
                    return;
                }
                event.preventDefault();
                window.parent.postMessage({ type: "linkedin-link-click", href: link.href }, "*");
            }, true);
            </script>
        `;
        let injectedHtml = html;
        if (html.includes("</head>")) {
            injectedHtml = html.replace("</head>", linkScript + "</head>");
        } else if (html.includes("</body>")) {
            injectedHtml = html.replace("</body>", linkScript + "</body>");
        } else {
            injectedHtml = html + linkScript;
        }
        const blob = new Blob([injectedHtml], { type: "text/html" });
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
        }
        currentUrl = URL.createObjectURL(blob);
        page.src = currentUrl;
        setAddress(currentFile);
    } catch (error) {
        showError(`Unable to load ${currentFile}.`);
    }
}

async function openFile() {
    const location = await api.fileDialog(["*.html", "*.htm"], "/home/demo/Documents");
    if (location) {
        loadFile(location);
    }
}

api.channel.onevent = data => {
    if (data.event === "sigterm") {
        api.quit();
    }
};

api.gotData.then(async () => {
    api.done({
        title: "Browser",
        icon: "/usr/share/icons/breeze-dark/apps/internet-web-browser.svg"
    });

    await api.loadIcons();
    document.getElementById("back").disabled = true;
    document.getElementById("forward").disabled = true;

    refreshButton.addEventListener("click", () => loadFile(currentFile));
    openButton.addEventListener("click", openFile);
    const openExternal = () => {
        window.open(currentExternalUrl || linkedInUrl, "_blank", "noopener");
    };
    openBannerButton.addEventListener("click", openExternal);
    closeBannerButton.addEventListener("click", () => {
        banner.classList.add("hidden");
    });

    const fileArg = api.data.args.location;
    loadFile(fileArg || defaultFile);
});

window.addEventListener("message", event => {
    if (event.data?.type !== "linkedin-link-click") {
        return;
    }
    currentExternalUrl = event.data?.href || linkedInUrl;
    bannerText.textContent = "If you want to see the full profile on LinkedIn click here.";
    banner.classList.remove("hidden");
    banner.classList.remove("flash");
    void banner.offsetHeight;
    banner.classList.add("flash");
});
