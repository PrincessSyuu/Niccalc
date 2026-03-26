(() => {
    const currentDisplay = document.getElementById('current');
    const previousDisplay = document.getElementById('previous');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const addNoteBtn = document.getElementById('addNote');
    const noteInput = document.getElementById('noteInput');
    const notesList = document.getElementById('notesList');
    const codeSetupOverlay = document.getElementById('codeSetupOverlay');
    const codeSetupInput = document.getElementById('codeSetupInput');
    const saveCodeBtn = document.getElementById('saveCode');
    const splash = document.getElementById('splash');
    const splashBar = document.getElementById('splashBar');
    const calculatorEl = document.getElementById('calculator');
    const canvas = document.getElementById('particles');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldReset = false;
    let typedSequence = '';

    const STORAGE_NOTES_KEY = 'secret_notes';
    const STORAGE_CODE_KEY = 'secret_code';

    // ── Particles ──
    function initParticles() {
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.dx;
                p.y += p.dy;
                p.pulse += 0.02;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(126, 200, 160, ' + alpha + ')';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = 'rgba(126, 200, 160, ' + (0.06 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ── Splash ──
    function runSplash() {
        return new Promise(function(resolve) {
            let progress = 0;
            const interval = setInterval(function() {
                progress += Math.random() * 15 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    splashBar.style.width = '100%';
                    setTimeout(function() {
                        splash.classList.add('fade-out');
                        setTimeout(function() {
                            splash.style.display = 'none';
                            resolve();
                        }, 600);
                    }, 300);
                } else {
                    splashBar.style.width = progress + '%';
                }
            }, 120);
        });
    }

    // ── Button Entrance ──
    function animateButtons() {
        const btns = document.querySelectorAll('.btn');
        btns.forEach(function(btn, i) {
            setTimeout(function() {
                btn.classList.add('animate-in');
            }, i * 40);
        });
    }

    // ── Show Calculator ──
    async function showCalculator() {
        await runSplash();
        calculatorEl.classList.remove('hidden');
        requestAnimationFrame(function() {
            calculatorEl.classList.add('visible');
            setTimeout(animateButtons, 200);
        });
    }

    // ── Display Pop ──
    function popDisplay() {
        currentDisplay.classList.remove('pop');
        void currentDisplay.offsetWidth;
        currentDisplay.classList.add('pop');
    }

    // ── Storage ──
    function getSecretCode() {
        return localStorage.getItem(STORAGE_CODE_KEY);
    }

    function getNotes() {
        const data = localStorage.getItem(STORAGE_NOTES_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveNotes(notes) {
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
    }

    // ── Code Setup ──
    function showCodeSetup() {
        codeSetupOverlay.classList.add('active');
        codeSetupInput.value = '';
        codeSetupInput.focus();
    }

    saveCodeBtn.addEventListener('click', function() {
        const code = codeSetupInput.value.trim();
        if (code.length === 4 && /^\d{4}$/.test(code)) {
            localStorage.setItem(STORAGE_CODE_KEY, code);
            codeSetupOverlay.classList.remove('active');
        } else {
            codeSetupInput.style.borderColor = 'rgba(126, 200, 160, 0.8)';
            codeSetupInput.style.boxShadow = '0 0 20px rgba(126, 200, 160, 0.3)';
            codeSetupInput.value = '';
            codeSetupInput.placeholder = 'Must be 4 digits!';
            setTimeout(function() {
                codeSetupInput.placeholder = 'Enter 4-digit code';
                codeSetupInput.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                codeSetupInput.style.boxShadow = 'none';
            }, 2000);
        }
    });

    codeSetupInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') saveCodeBtn.click();
    });

    // ── Secret Code ──
    function checkSecretCode(value) {
        const secretCode = getSecretCode();
        if (secretCode && value === secretCode) {
            openNotesModal();
            typedSequence = '';
            return true;
        }
        return false;
    }

    function openNotesModal() {
        modalOverlay.classList.add('active');
        renderNotes();
        noteInput.focus();
    }

    closeModal.addEventListener('click', function() {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // ── Notes ──
    function renderNotes() {
        const notes = getNotes();
        if (notes.length === 0) {
            notesList.innerHTML = '<div class="empty-notes">No secret notes yet. Add one above.</div>';
            return;
        }
        notesList.innerHTML = notes.map(function(note, index) {
            return '<div class="note-item"><div><div class="note-text">' +
                escapeHtml(note.text) + '</div><div class="note-date">' +
                note.date + '</div></div><button class="delete-note-btn" data-index="' +
                index + '">&times;</button></div>';
        }).join('');

        notesList.querySelectorAll('.delete-note-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.dataset.index);
                const notes = getNotes();
                notes.splice(idx, 1);
                saveNotes(notes);
                renderNotes();
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addNoteBtn.addEventListener('click', function() {
        const text = noteInput.value.trim();
        if (!text) return;
        const notes = getNotes();
        notes.unshift({ text: text, date: new Date().toLocaleString() });
        saveNotes(notes);
        noteInput.value = '';
        renderNotes();
    });

    noteInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNoteBtn.click();
        }
    });

    // ── Calculator ──
    function updateDisplay() {
        currentDisplay.textContent = currentInput;
        if (operator) {
            previousDisplay.textContent = previousInput + ' ' + operator;
        } else {
            previousDisplay.textContent = previousInput;
        }
    }

    function appendNumber(value) {
        if (shouldReset) {
            currentInput = value === '.' ? '0.' : value;
            shouldReset = false;
        } else {
            if (value === '.' && currentInput.includes('.')) return;
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }
        popDisplay();
        updateDisplay();
    }

    function setOperator(op) {
        if (operator && !shouldReset) calculate();
        previousInput = currentInput;
        operator = op;
        shouldReset = true;
        updateDisplay();
    }

    function calculate() {
        if (!operator || !previousInput) return;
        const prev = parseFloat(previousInput);
        const curr = parseFloat(currentInput);
        var result;
        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/':
                if (curr === 0) {
                    currentInput = 'Error';
                    previousInput = '';
                    operator = null;
                    shouldReset = true;
                    updateDisplay();
                    return;
                }
                result = prev / curr;
                break;
            default: return;
        }
        currentInput = parseFloat(result.toPrecision(12)).toString();
        previousInput = '';
        operator = null;
        shouldReset = true;
        popDisplay();
        updateDisplay();
    }

    function clear() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        shouldReset = false;
        typedSequence = '';
        updateDisplay();
    }

    function deleteLast() {
        if (currentInput === 'Error') { clear(); return; }
        if (shouldReset) return;
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplay();
    }

    function percent() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    // ── Click Handler ──
    document.querySelector('.buttons').addEventListener('click', function(e) {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        if (btn.classList.contains('number')) {
            const val = btn.dataset.value;
            typedSequence += val;
            if (typedSequence.length > 4) typedSequence = typedSequence.slice(-4);
            if (checkSecretCode(typedSequence)) { clear(); return; }
            appendNumber(val);
        } else if (btn.dataset.action === 'operator') {
            typedSequence = '';
            setOperator(btn.dataset.value);
        } else if (btn.dataset.action === 'equals') {
            typedSequence = '';
            calculate();
        } else if (btn.dataset.action === 'clear') {
            clear();
        } else if (btn.dataset.action === 'delete') {
            typedSequence = typedSequence.slice(0, -1);
            deleteLast();
        } else if (btn.dataset.action === 'percent') {
            typedSequence = '';
            percent();
        }
    });

    // ── Keyboard Handler ──
    document.addEventListener('keydown', function(e) {
        if (modalOverlay.classList.contains('active') || codeSetupOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                modalOverlay.classList.remove('active');
                codeSetupOverlay.classList.remove('active');
            }
            return;
        }
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            typedSequence += e.key;
            if (typedSequence.length > 4) typedSequence = typedSequence.slice(-4);
            if (checkSecretCode(typedSequence)) { clear(); return; }
            appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            typedSequence = '';
            setOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            typedSequence = '';
            calculate();
        } else if (e.key === 'Backspace') {
            typedSequence = typedSequence.slice(0, -1);
            deleteLast();
        } else if (e.key === 'Escape') {
            clear();
        } else if (e.key === '%') {
            typedSequence = '';
            percent();
        }
    });

    // ── Init ──
    initParticles();
    showCalculator();
    if (!getSecretCode()) {
        setTimeout(showCodeSetup, 2500);
    }
    updateDisplay();
})();
