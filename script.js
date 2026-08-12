/* Reads which person to show from the URL hash: site.com/#JDP */
const cardId = window.location.hash.substring(1) || null;
const person = cardId ? window.CARDS[cardId] : null;

const pageEl = document.getElementById('page');
const img = document.getElementById('callingCardImage');
const saveBtn = document.getElementById('saveContactBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusEl = document.getElementById('status');

function setStatus(msg, ms = 4000) {
    statusEl.textContent = msg;
    if (ms) setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, ms);
}

if (!person) {
    pageEl.innerHTML = `<p style="color:#fff;text-align:center;padding:40px 20px;font-family:sans-serif;">
        Card not found. Check the link (it should end in #SOMEONE) and try again.
    </p>`;
} else {

    img.src = person.cardImage;
    img.alt = `${person.firstName} ${person.lastName} calling card`;

    /* ---------- Download the actual designed card image ---------- */
    downloadBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(person.cardImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `calling-card-${cardId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            setStatus("Couldn't download the image — try again.");
        }
    });

    /* ---------- Convert the headshot to a base64 JPEG for the vCard PHOTO field ---------- */
    function getPhotoDataUrl(path) {
        return new Promise((resolve) => {
            if (!path) { resolve(null); return; }
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                const c = document.createElement("canvas");
                c.width = 300; c.height = 300;
                const ctx = c.getContext("2d");
                ctx.drawImage(image, 0, 0, 300, 300);
                resolve(c.toDataURL("image/jpeg", 0.9));
            };
            image.onerror = () => resolve(null);
            image.src = path;
        });
    }

    /* ---------- Save to Contacts (vCard / .vcf) ---------- */
    saveBtn.addEventListener('click', async () => {
        setStatus("Preparing contact…");
        const photoDataUrl = await getPhotoDataUrl(person.profilePhoto);

        const lines = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `N:${person.lastName};${person.firstName};;;`,
            `FN:${person.firstName} ${person.lastName}`,
            `ORG:${person.company || ""}${person.department ? ";" + person.department : ""}`,
            `TITLE:${person.title || ""}`
        ];

        (person.phones || []).forEach((phone, i) => {
            lines.push(`TEL;TYPE=${i === 0 ? "CELL" : "WORK,VOICE"}:${phone}`);
        });
        if (person.email) lines.push(`EMAIL;TYPE=INTERNET:${person.email}`);
        if (person.website) lines.push(`URL:${person.website}`);
        if (person.address) lines.push(`ADR;TYPE=WORK:;;${person.address};;;;`);
        if (photoDataUrl) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoDataUrl.split(",")[1]}`);
        lines.push("END:VCARD");

        const vcard = lines.join("\r\n");
        const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const isAndroid = /android/i.test(navigator.userAgent);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${person.firstName}-${person.lastName}.vcf`.replace(/\s+/g, "-");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatus(
            isAndroid
                ? "Saved ✓ — open the download notification below to add the contact"
                : "Contact file ready — tap it to add ✓"
        );
    });
}