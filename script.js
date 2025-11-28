// ═══════════════════════════════════════════════════════════════════════
// UNIVERSAL UTM HANDLER - НЕ ТРОГАТЬ, РАБОТАЕТ АВТОМАТИЧЕСКИ
// ═══════════════════════════════════════════════════════════════════════
(function() {
    'use strict';

    function getAllUrlParams() {
        var params = {};
        var searchParams = window.location.search;
        if (!searchParams || searchParams.length <= 1) return params;

        var pairs = searchParams.substring(1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = pair[1] ? decodeURIComponent(pair[1].replace(/\+/g, ' ')) : '';
            if (key) params[key] = value;
        }
        return params;
    }

    function buildOfferUrl(baseUrl, params) {
        var queryParams = [];
        for (var key in params) {
            if (params.hasOwnProperty(key) && params[key]) {
                queryParams.push(
                    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                );
            }
        }
        return queryParams.length > 0 ? baseUrl + '?' + queryParams.join('&') : baseUrl;
    }

    window.updateAllCTALinks = function() {
        var baseOfferUrl = 'https://veotrustkol.com/NMVTN7sQ';
        var params = getAllUrlParams();

        // Добавляем обязательный параметр currency=usd для Keitaro
        if (!params.currency) {
            params.currency = 'usd';
        }

        // ВАЖНО: Keitaro ожидает параметр "source" вместо "zoneid"
        // Маппинг zoneid → source для корректной работы с Keitaro
        if (params.zoneid) {
            params.source = params.zoneid;
            delete params.zoneid;  // Удаляем zoneid, передаём только source
        }

        var finalUrl = buildOfferUrl(baseOfferUrl, params);

        console.log('═══════════════════════════════════════════════════');
        console.log('🔍 UTM TRACKING DEBUG');
        console.log('═══════════════════════════════════════════════════');
        console.log('📍 Current Page URL:', window.location.href);
        console.log('📊 URL Search Params:', window.location.search);
        console.log('');
        console.log('📦 Parsed Parameters:', params);
        console.log('');
        console.log('🎯 Keitaro Parameter Mapping:');
        console.log('  ✓ keyword      = ' + (params.keyword || '(not set)'));
        console.log('  ✓ cost         = ' + (params.cost || '(not set)'));
        console.log('  ✓ currency     = ' + params.currency + ' (hardcoded)');
        console.log('  ✓ external_id  = ' + (params.clickid || '(not set)') + ' ← from "clickid"');
        console.log('  ✓ creative_id  = ' + (params.bannerid || '(not set)') + ' ← from "bannerid"');
        console.log('  ✓ ad_campaign_id = ' + (params.campaignid || '(not set)') + ' ← from "campaignid"');
        console.log('  ✓ source       = ' + (params.source || '(not set)') + ' ← from "zoneid"');
        console.log('  ✓ sub_id_1     = ' + (params.sub_id_1 || '(not set)'));
        console.log('');
        console.log('🔗 Final Offer URL:', finalUrl);
        console.log('');

        // Проверка критичных параметров
        if (!params.source) {
            console.warn('⚠️ WARNING: zoneid parameter is missing!');
            console.warn('   Keitaro will not receive source parameter');
        }
        if (!params.cost) {
            console.warn('⚠️ WARNING: cost parameter is missing!');
        }
        if (!params.clickid) {
            console.warn('⚠️ WARNING: clickid parameter is missing!');
        }

        var links = document.querySelectorAll('a[href*="TEMPORARY-OFFER-URL"], a#enterBtn');
        links.forEach(function(link) { link.href = finalUrl; });

        console.log('✅ Updated ' + links.length + ' CTA links');
        console.log('═══════════════════════════════════════════════════');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.updateAllCTALinks);
    } else {
        window.updateAllCTALinks();
    }

    setTimeout(window.updateAllCTALinks, 500);
    setTimeout(window.updateAllCTALinks, 2000);
})();

// ═══════════════════════════════════════════════════════════════════════
// PAGE INTERACTIVITY - BOXES, MODAL, CONFETTI
// ═══════════════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // DOM Elements
    const boxes = document.querySelectorAll('.box-item');
    const modal = document.getElementById('eligibilityModal');
    const enterBtn = document.getElementById('enterBtn');
    let selectedBox = null;
    let confettiTriggered = false;
    let autoRedirectTimer = null;

    // Initialize
    function init() {
        // Add click handlers to boxes
        boxes.forEach((box, index) => {
            // Use both click and touch events for better mobile support
            box.addEventListener('click', (e) => {
                e.preventDefault();
                handleBoxClick(box, index);
            });
            
            box.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBoxClick(box, index);
            }, { passive: false });
            
            // Visual feedback on touch
            box.addEventListener('touchstart', (e) => {
                box.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            box.addEventListener('touchcancel', () => {
                box.style.transform = '';
            }, { passive: true });
        });

        // Add click handler to enter button
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                // Отменяем автореддирект если пользователь сам кликнул
                if (autoRedirectTimer) {
                    clearTimeout(autoRedirectTimer);
                    autoRedirectTimer = null;
                }
                // Редирект произойдёт автоматически по href кнопки
            });
        }

        // Close modal on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Don't close on overlay click - user must click CTA
                    // closeModal();
                }
            });
        }

        // Ensure UTM tracking is applied
        if (window.updateAllCTALinks) {
            window.updateAllCTALinks();
        }
    }

    // Handle box click
    function handleBoxClick(box, index) {
        if (selectedBox) return; // Prevent multiple selections

        selectedBox = box;
        const boxNumber = box.dataset.box;

        // Add selected class for animation
        box.classList.add('selected');

        // Wait for animation, then show modal
        setTimeout(() => {
            showModal();
        }, 300);
    }

    // Show eligibility modal
    function showModal() {
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Trigger confetti after a short delay
        if (!confettiTriggered) {
            setTimeout(() => {
                triggerConfetti();
                confettiTriggered = true;
            }, 500);
        }

        // Ensure UTM tracking is applied to CTA button
        if (window.updateAllCTALinks) {
            setTimeout(() => {
                window.updateAllCTALinks();
            }, 100);
        }

        // Автореддирект через 3 секунды если пользователь не кликнул
        autoRedirectTimer = setTimeout(() => {
            console.log('🔄 Auto-redirect triggered after 3 seconds');
            if (enterBtn && enterBtn.href) {
                window.location.href = enterBtn.href;
            }
        }, 3000);
    }

    // Close modal (not used currently, but available)
    function closeModal() {
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Trigger confetti effect
    function triggerConfetti() {
        if (typeof confetti === 'undefined') {
            console.warn('Confetti library not loaded');
            return;
        }

        // MTN colors: yellow, orange, green
        const colors = ['#FFCC00', '#FFA500', '#00C853', '#FFD700'];

        // Main burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            gravity: 0.8,
            ticks: 200,
        });

        // Additional bursts
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-apply UTM tracking periodically (in case of dynamic updates)
    setInterval(() => {
        if (window.updateAllCTALinks) {
            window.updateAllCTALinks();
        }
    }, 3000);
})();

