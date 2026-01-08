document.addEventListener('DOMContentLoaded', function () {
    // ================================
    // STICKY NAV + LOGO SWAP
    // ================================
    const header = document.querySelector('.navbar');
    const logoEl = document.getElementById('brandLogo');

    let menuOpen = false; // <-- přidáno

    function setLogo(isSolid) {
        if (!logoEl) return;

        const nextSrc = isSolid ? logoEl.dataset.logoDark : logoEl.dataset.logoLight;
        if (logoEl.src.endsWith(nextSrc)) return;

        logoEl.classList.add('is-swapping');
        const onLoad = () => {
            logoEl.classList.remove('is-swapping');
            logoEl.removeEventListener('load', onLoad);
        };
        logoEl.addEventListener('load', onLoad);
        logoEl.src = nextSrc;
    }

    function applyHeaderState(solid) { // <-- přidáno (společná logika)
        if (!header) return;

        if (solid) {
            header.classList.add('is-solid');
            header.removeAttribute('data-transparent');
        } else {
            header.classList.remove('is-solid');
            header.setAttribute('data-transparent', '');
        }
        setLogo(solid);
    }

    function onScroll() { // <-- uděláno jako funkce dostupná i pro menu
        if (menuOpen) return; // <-- když je menu otevřené, header držíme "solid"
        const solid = window.scrollY > 16;
        applyHeaderState(solid);
    }

    if (header) {
        document.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ================================
    // MOBILNÍ MENU
    // ================================
    const btn = document.getElementById("menu-toggle");
    const nav = document.getElementById("primary-nav");
    const icon = btn?.querySelector(".menu-btn__icon");
    const backdrop = document.querySelector("[data-nav-backdrop]");

    if (btn && nav && icon) {
        const setOpen = (open) => {
            menuOpen = open; 

            btn.setAttribute("aria-expanded", String(open));
            btn.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
            icon.textContent = open ? "close" : "menu";

            if (open) {
                nav.setAttribute("data-open", "");
                applyHeaderState(true); 
            } else {
                nav.removeAttribute("data-open");
                onScroll(); 
            }
        };

        btn.addEventListener("click", () => {
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            setOpen(!isOpen);
        });

        nav.addEventListener("click", (e) => {
            if (e.target.closest("a")) setOpen(false);
        });
    }

    // ================================
    // MODÁLNÍ OKNA
    // ================================
    let lastFocusedElement = null;

    function openModal(modal) {
        if (!modal) return;

        lastFocusedElement = document.activeElement;

        modal.removeAttribute('hidden');
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        const dialog = modal.querySelector('.modal__dialog');
        if (dialog) {
            dialog.setAttribute('tabindex', '-1');
            dialog.focus();
        }
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.setAttribute('hidden', '');
        modal.classList.remove('is-open');
        document.body.style.overflow = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    document.addEventListener('click', function (event) {
        const trigger = event.target.closest('[data-modal-target]');
        if (!trigger) return;

        const selector = trigger.getAttribute('data-modal-target');
        if (!selector) return;

        const modal = document.querySelector(selector);
        openModal(modal);
    });

    document.addEventListener('click', function (event) {
        const closeBtn = event.target.closest('[data-modal-close]');
        if (!closeBtn) return;

        const modal = closeBtn.closest('.modal');
        closeModal(modal);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;

        const openModalEl = document.querySelector('.modal:not([hidden])');
        if (openModalEl) {
            closeModal(openModalEl);
        }
    });

    document.querySelectorAll('[data-scroll-contact]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);

            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ================================
    // TABS (pro modály s taby)
    // ================================
    function initTabs(container) {
        const tabs = container.querySelectorAll('[role="tab"]');
        const panels = container.querySelectorAll('[role="tabpanel"]');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('aria-controls');

                tabs.forEach((t) => {
                    t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
                });

                panels.forEach((panel) => {
                    panel.hidden = panel.id !== targetId;
                });
            });
        });
    }

    document.querySelectorAll('[data-tabs]').forEach(initTabs);
});
