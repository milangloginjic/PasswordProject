
let pozicija = 0;
let zakljucano = false;

const brojKvadratica = 4;

document.addEventListener("keydown", function(event) {

    // Prihvataj samo jednu cifru
    if (!/^[0-9]$/.test(event.key)) {
        return;
    }

    if (zakljucano || pozicija >= brojKvadratica) {
        return;
    }

    posaljiCifru(event.key);

});


async function posaljiCifru(cifra) {

    zakljucano = true;

    try {

        const response = await fetch("/api/check-digit", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                pozicija: pozicija,
                cifra: cifra
            })

        });

        const data = await response.json();

        const box = document.getElementById("box-" + pozicija);

        if (data.tacno) {
            zvukTacno();
            box.innerText = cifra;
            box.classList.add("correct");


            pozicija++;

            if (data.kompletnaSifra) {
                document.getElementById("message").innerText =
                    "ŠIFRA JE USPEŠNA!";
                zvukUspeh();

                document.getElementById("message").classList.add("success");


            } else {
                document.getElementById("message").innerText =
                    "Tačna cifra!";
            }

        } else {
            zvukPogresno();
            document.getElementById("message").innerText =
                "Pogrešna cifra!";

            document.querySelectorAll(".digit-box").forEach(box => {
                box.classList.add("incorrect");
            });

            await new Promise(resolve => setTimeout(resolve, 600));

            resetujSifru();

        }

    } catch (error) {

        console.error("Greška:", error);

        document.getElementById("message").innerText =
            "Greška u komunikaciji sa serverom!";

    } finally {

        zakljucano = false;

    }

}


function resetujSifru() {

    pozicija = 0;

    document.querySelectorAll(".digit-box").forEach(box => {

        box.innerText = "";
        box.classList.remove("correct", "incorrect");

    });

    document.getElementById("message").innerText =
        "Pokušajte ponovo";

}



function pustiZvuk(frekvencija, trajanje = 150) {

    const audioContext = new AudioContext();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frekvencija;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.15, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + trajanje / 1000
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + trajanje / 1000);
}


function zvukTacno() {
    pustiZvuk(750, 120);
}


function zvukPogresno() {
    pustiZvuk(180, 300);
}


function zvukUspeh() {
    pustiZvuk(600, 150);

    setTimeout(() => pustiZvuk(800, 150), 150);
    setTimeout(() => pustiZvuk(1000, 250), 300);
}

