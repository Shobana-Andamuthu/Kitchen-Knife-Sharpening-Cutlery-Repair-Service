/**
 * FERRUM & STONE — ARTISAN CUTLERY & KNIFE SHARPENING
 * Phase 1 Core JavaScript Application
 * - Theme switcher (Light/Dark with localStorage persistence)
 * - Direction switcher (LTR/RTL with localStorage persistence)
 * - Accessible Navigation & Dropdowns (Desktop & Mobile)
 * - Accessible Modal/Drawer keyboard traps
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Theme Management (Light / Dark)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'ferrum_stone_theme';
  const DIR_STORAGE_KEY = 'ferrum_stone_dir';

  // Apply saved or system theme immediately
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    updateThemeToggles();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    updateThemeToggles();
  }

  function updateThemeToggles() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = currentTheme === 'dark';
    const buttons = document.querySelectorAll('.theme-toggle-btn');

    buttons.forEach((btn) => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      const labelText = btn.querySelector('.toggle-label-text');

      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }

      if (labelText) {
        labelText.textContent = isDark ? 'Light' : 'Dark';
      }
    });
  }

  // --------------------------------------------------------------------------
  // Direction Management (LTR / RTL)
  // --------------------------------------------------------------------------
  function initDirection() {
    const savedDir = localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirToggles();
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_STORAGE_KEY, newDir);
    updateDirToggles();
  }

  function updateDirToggles() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const isRtl = currentDir === 'rtl';
    const buttons = document.querySelectorAll('.dir-toggle-btn');

    buttons.forEach((btn) => {
      btn.setAttribute('aria-label', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      
      const label = btn.querySelector('.dir-label');
      if (label) {
        label.textContent = isRtl ? 'LTR' : 'RTL';
      } else {
        btn.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  }

  // --------------------------------------------------------------------------
  // Header Scroll Effect
  // --------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // Desktop Dropdown Navigation
  // --------------------------------------------------------------------------
  function initDesktopDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');
      if (!trigger || !menu) return;

      const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !dropdown.classList.contains('is-open');
        dropdown.classList.toggle('is-open', isOpen);
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      };

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });

      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu(true);
          const firstItem = menu.querySelector('a');
          if (firstItem) firstItem.focus();
        } else if (e.key === 'Escape') {
          toggleMenu(false);
          trigger.focus();
        }
      });

      menu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          toggleMenu(false);
          trigger.focus();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          toggleMenu(false);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  function initMobileDrawer() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    if (!hamburgerBtn || !drawer || !backdrop) return;

    const openDrawer = () => {
      drawer.classList.add('is-active');
      backdrop.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-active');
      backdrop.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburgerBtn.focus();
    };

    hamburgerBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    backdrop.addEventListener('click', closeDrawer);

    // Escape key closes mobile drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    // Mobile nested dropdown accordion
    mobileDropdowns.forEach((dropdown) => {
      const header = dropdown.querySelector('.mobile-dropdown-header');
      if (!header) return;

      header.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('is-open');
        dropdown.classList.toggle('is-open', !isOpen);
        header.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Active Link Highlighting
  // --------------------------------------------------------------------------
  function highlightActiveLinks() {
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    // Normalize by stripping .html and leading slash
    const normalize = (p) => p.replace(/\.html$/, '').replace(/^\//, '') || 'index';
    const normCurrent = normalize(currentPath);

    const isHome = normCurrent === 'index' || normCurrent === 'home-2' || normCurrent === '';

    const allLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkFile = href.split('/').pop().split('#')[0];
      const normLink = normalize(linkFile);
      const isMatch = normCurrent === normLink;

      if (isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // If it's inside a desktop dropdown, highlight the parent trigger as well
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const trigger = parentDropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }

        // If it's inside a mobile dropdown, highlight the mobile header as well
        const parentMobileDropdown = link.closest('.mobile-dropdown');
        if (parentMobileDropdown) {
          const mobileHeader = parentMobileDropdown.querySelector('.mobile-dropdown-header');
          if (mobileHeader) mobileHeader.classList.add('active');
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Explicitly guarantee Home trigger is active when on Home 1 or Home 2
    const homeTrigger = document.querySelector('#homeDropdown .dropdown-trigger');
    if (homeTrigger) {
      if (isHome) {
        homeTrigger.classList.add('active');
      } else {
        homeTrigger.classList.remove('active');
      }
    }

    const mobileHomeDropdown = document.getElementById('mobileHomeDropdown') || document.querySelector('.mobile-dropdown');
    if (mobileHomeDropdown) {
      const mobileHomeHeader = mobileHomeDropdown.querySelector('.mobile-dropdown-header');
      if (mobileHomeHeader) {
        if (isHome) {
          mobileHomeHeader.classList.add('active');
        } else {
          mobileHomeHeader.classList.remove('active');
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // Back to Top Floating Button
  // --------------------------------------------------------------------------
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    function handleScroll() {
      if (window.scrollY > 280) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // Page Loader Dismissal
  // --------------------------------------------------------------------------
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    function hideLoader() {
      if (loader.classList.contains('is-hidden')) return;
      loader.classList.add('is-hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 550);
    }

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 250);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 250);
      });
      // Safety fallback in case external resources hang
      setTimeout(hideLoader, 1200);
    }
  }

  // --------------------------------------------------------------------------
  // Document Ready Initialization
  // --------------------------------------------------------------------------
  function init() {
    initPageLoader();
    initTheme();
    initDirection();
    initHeaderScroll();
    initDesktopDropdowns();
    initMobileDrawer();
    highlightActiveLinks();
    initBackToTop();

    // Bind theme toggles
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // Bind direction toggles
    document.querySelectorAll('.dir-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleDirection);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
