// SISTEMA OPERATIVO PRINCIPALE (Kernel)
const System = {
    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        NotesApp.init();
    },

    updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

        document.getElementById('statusClock').innerText = timeStr;
        document.getElementById('homeClock').innerText = timeStr;
        document.getElementById('homeDate').innerText = dateStr;
    },

    openApp(appId) {
        const win = document.getElementById(appId);
        win.style.display = 'flex';
        setTimeout(() => win.classList.add('active'), 10);
    },

    closeApp(appId) {
        const win = document.getElementById(appId);
        win.classList.remove('active');
        setTimeout(() => win.style.display = 'none', 300);
    },

    setTheme(gradient) {
        document.getElementById('systemScreen').style.background = gradient;
    }
};

// APPLICAZIONE NOTE (Con Persistence Storage LocalStorage)
const NotesApp = {
    notes: [],
    init() {
        this.notes = JSON.parse(localStorage.getItem('nexus_notes') || '[]');
        this.render();
    },
    addNote() {
        const input = document.getElementById('noteInput');
        if (input.value.trim() !== '') {
            this.notes.push(input.value);
            localStorage.setItem('nexus_notes', JSON.stringify(this.notes));
            input.value = '';
            this.render();
        }
    },
    render() {
        const container = document.getElementById('notesContainer');
        container.innerHTML = this.notes.map(n => `<div class="note-card">${n}</div>`).join('');
    }
};

// APPLICAZIONE CALCOLATRICE
const CalcApp = {
    expr: '',
    press(val) { this.expr += val; this.update(); },
    clear() { this.expr = ''; this.update(); },
    eval() {
        try { this.expr = eval(this.expr).toString(); }
        catch { this.expr = 'Errore'; }
        this.update();
    },
    update() { document.getElementById('calcDisplay').innerText = this.expr || '0'; }
};

// APPLICAZIONE BROWSER
const BrowserApp = {
    load() {
        const url = document.getElementById('browserUrl').value;
        document.getElementById('browserFrame').src = url;
    }
};

// AVVIO DEL SISTEMA
document.addEventListener('DOMContentLoaded', () => System.init());