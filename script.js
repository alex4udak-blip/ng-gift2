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
