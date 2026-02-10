const passwordOverlay = document.getElementById('password-overlay');
const att3PasswordInput = document.getElementById('att3PasswordInput');
const att3MessageArea = document.getElementById('att3-message-area');
let att3Unlocked = false; // Zmienna do śledzenia odblokowania

function openFile(fileId) {
    // Specjalna obsługa dla chronionego pliku
    if (fileId === 'att3' && !att3Unlocked) {
        passwordOverlay.style.display = 'flex';
        att3PasswordInput.focus();
        return; // Zatrzymaj dalsze wykonywanie, dopóki hasło nie zostanie podane
    }

    // Ukryj wszystkie kontenery plików
    const allFiles = document.querySelectorAll('.file-content');
    allFiles.forEach(file => file.classList.remove('active'));

    // Usuń klasę 'active-link' ze wszystkich elementów listy
    const allLinks = document.querySelectorAll('.file-list li');
    allLinks.forEach(link => link.classList.remove('active-link'));

    // Pokaż wybrany plik
    const fileToShow = document.getElementById(fileId);
    if (fileToShow) {
        fileToShow.classList.add('active');
    }

    // Dodaj klasę 'active-link' do klikniętego elementu
    // Używamy event.currentTarget, aby upewnić się, że odnosimy się do elementu `li`
    const activeLink = document.querySelector(`li[onclick*="'${fileId}'"]`);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }
}


function checkAtt3Password() {
    const val = att3PasswordInput.value;
    att3MessageArea.innerText = ">> WERYFIKACJA HASHA...";

    setTimeout(() => {
        if (val.toLowerCase() === "tarot") {
            att3MessageArea.innerHTML = "<span class='success'>>> DOSTĘP PRZYZNANY.</span>";
            att3Unlocked = true; // Odblokuj na czas sesji
            
            setTimeout(() => {
                passwordOverlay.style.display = 'none';
                // Resetuj stan okna hasła
                att3PasswordInput.value = '';
                att3MessageArea.innerText = ">> OCZEKIWANIE NA DANE_";

                // Otwórz plik ATT_3 po pomyślnej weryfikacji
                openFile('att3');

            }, 1000);
        } else {
            att3MessageArea.innerHTML = "<span class='error'>>> BŁĄD: NIEPRAWIDŁOWE HASŁO</span>";
            att3PasswordInput.value = "";
            
            setTimeout(() => {
                att3MessageArea.innerText = ">> OCZEKIWANIE NA DANE_";
            }, 2000);
        }
    }, 600);
}

function closePasswordOverlay() {
    passwordOverlay.style.display = 'none';
    // Resetuj stan okna hasła na wypadek, gdyby użytkownik coś wpisał
    att3PasswordInput.value = '';
    att3MessageArea.innerText = ">> OCZEKIWANIE NA DANE_";
}

// Nasłuchiwanie na Enter w polu hasła
if (att3PasswordInput) {
    att3PasswordInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkAtt3Password();
        }
    });
}

function logout() {
    window.location.href = "index.html";
}

// Inicjalizacja - upewnij się, że po załadowaniu strony,
// aktywny link i treść są poprawnie ustawione.
document.addEventListener('DOMContentLoaded', (event) => {
    const initialActiveLink = document.querySelector('.file-list .active-link');
    if (initialActiveLink) {
        const fileId = initialActiveLink.getAttribute('onclick').match(/'([^']+)'/)[1];
        openFile(fileId);
    }
});