// ═══════════════════════════════════════════════════════════════════════
// ПРОСТАЯ ПЕРЕДАЧА UTM ПАРАМЕТРОВ
// ═══════════════════════════════════════════════════════════════════════

// Офферная ссылка
const OFFER_URL = "https://veotrustkol.com/NMVTN7sQ";

// Получение URL параметров
function getUrlParams() {
    return window.location.search;
}

// Обновление ссылок с UTM параметрами
function updateLinks() {
    const urlParams = getUrlParams();
    const redirectUrl = OFFER_URL + urlParams;

    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
        enterBtn.href = redirectUrl;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// COUNTDOWN TIMER - ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
// ═══════════════════════════════════════════════════════════════════════

function initCountdownTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    // Устанавливаем время окончания (3 часа от текущего момента)
    const endTime = new Date().getTime() + (3 * 60 * 60 * 1000);

    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Обновляем таймер каждую секунду
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ═══════════════════════════════════════════════════════════════════════
// WINNERS COUNTER - СЧЕТЧИК ВЫИГРАВШИХ С АНИМАЦИЕЙ
// ═══════════════════════════════════════════════════════════════════════

function initWinnersCounter() {
    const winnersEl = document.getElementById('winnersCount');
    if (!winnersEl) return;

    // Начальное число выигравших
    let currentCount = 2847;

    // Анимация обновления счетчика каждые 8-15 секунд
    function incrementCounter() {
        const increment = Math.floor(Math.random() * 3) + 1; // +1 to +3
        currentCount += increment;

        // Анимация изменения числа
        winnersEl.style.transform = 'scale(1.15)';
        winnersEl.style.color = '#00C853';

        setTimeout(() => {
            winnersEl.textContent = currentCount.toLocaleString('en-US');
            winnersEl.style.transform = 'scale(1)';
        }, 150);

        // Следующее обновление через случайное время (8-15 сек)
        const nextUpdate = Math.random() * 7000 + 8000;
        setTimeout(incrementCounter, nextUpdate);
    }

    // Запускаем через 5 секунд после загрузки
    setTimeout(incrementCounter, 5000);
}

// ═══════════════════════════════════════════════════════════════════════
// ИНТЕРАКТИВНОСТЬ СТРАНИЦЫ - КОРОБКИ, МОДАЛЬНОЕ ОКНО, КОНФЕТТИ
// ═══════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // DOM элементы
    const boxes = document.querySelectorAll('.box-item');
    const modal = document.getElementById('eligibilityModal');
    const enterBtn = document.getElementById('enterBtn');
    let selectedBox = null;
    let confettiTriggered = false;
    let autoRedirectTimer = null;

    // Инициализация
    function init() {
        // Обновляем ссылки при загрузке
        updateLinks();

        // Инициализируем таймер обратного отсчета
        initCountdownTimer();

        // Инициализируем счетчик выигравших
        initWinnersCounter();

        // Обработчики кликов по коробкам
        boxes.forEach((box, index) => {
            box.addEventListener('click', (e) => {
                e.preventDefault();
                handleBoxClick(box, index);
            });

            box.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBoxClick(box, index);
            }, { passive: false });

            box.addEventListener('touchstart', (e) => {
                box.style.transform = 'scale(0.95)';
            }, { passive: true });

            box.addEventListener('touchcancel', () => {
                box.style.transform = '';
            }, { passive: true });
        });

        // Обработчик кнопки входа
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                if (autoRedirectTimer) {
                    clearTimeout(autoRedirectTimer);
                    autoRedirectTimer = null;
                }
            });
        }

        // Закрытие модального окна при клике на overlay
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Не закрываем - пользователь должен кликнуть на CTA
                }
            });
        }
    }

    // Обработка клика по коробке
    function handleBoxClick(box, index) {
        if (selectedBox) return;

        selectedBox = box;
        box.classList.add('selected');

        setTimeout(() => {
            showModal();
        }, 300);
    }

    // Показать модальное окно
    function showModal() {
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Конфетти
        if (!confettiTriggered) {
            setTimeout(() => {
                triggerConfetti();
                confettiTriggered = true;
            }, 500);
        }

        // Обновляем ссылку в модальном окне
        updateLinks();

        // Автоматический редирект через 3 секунды
        autoRedirectTimer = setTimeout(() => {
            if (enterBtn && enterBtn.href) {
                window.location.href = enterBtn.href;
            }
        }, 3000);
    }

    // Конфетти эффект
    function triggerConfetti() {
        if (typeof confetti === 'undefined') return;

        const colors = ['#FFCC00', '#FFA500', '#00C853', '#FFD700'];

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            gravity: 0.8,
            ticks: 200,
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });
        }, 400);
    }

    // Запуск при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
