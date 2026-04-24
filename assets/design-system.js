/* ================================================================
   EUROFISCALIS — DESIGN SYSTEM v1 / JS companion
   ================================================================
   Comportement a11y + clavier pour les composants interactifs.
   Import :  <script src="assets/design-system.js" defer></script>

   Couvre : Tabs · Modal · Dropdown · Alert · Tooltip · Avatar · Table · Checkbox
   Pas de dépendance. Init automatique au DOMContentLoaded.
   Pour le contenu ajouté dynamiquement, appeler window.DS.init().
   ================================================================ */

(() => {
  'use strict';

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
  const markInit = (el, key) => {
    if (el.dataset[`dsInit${key}`]) return false;
    el.dataset[`dsInit${key}`] = '1';
    return true;
  };

  /* ----------------------------------------------------------------
     TABS — pattern ARIA Authoring Practices (automatic activation)
     Clavier : ←/→ · Home/End · roving tabindex
  ---------------------------------------------------------------- */
  const activateTab = (buttons, panels, i) => {
    buttons.forEach((b, j) => {
      const on = i === j;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('tabindex', on ? '0' : '-1');
    });
    panels.forEach((p, j) => p.classList.toggle('is-active', i === j));
  };

  const updateTabListScroll = (list) => {
    const maxScroll = list.scrollWidth - list.clientWidth;
    if (maxScroll <= 1) {
      list.removeAttribute('data-scroll-left');
      list.removeAttribute('data-scroll-right');
      return;
    }
    list.toggleAttribute('data-scroll-left', list.scrollLeft > 1);
    list.toggleAttribute('data-scroll-right', list.scrollLeft < maxScroll - 1);
  };

  const initTabs = (root = document) => {
    $$('.tabs', root).forEach(tabs => {
      if (!markInit(tabs, 'Tabs')) return;
      const buttons = $$('.tab', tabs);
      const panels = $$('.tab-panel', tabs);
      const list = tabs.querySelector('.tab-list');
      if (list && !list.hasAttribute('role')) list.setAttribute('role', 'tablist');

      buttons.forEach((btn, i) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('tabindex', btn.classList.contains('is-active') ? '0' : '-1');
        const panel = panels[i];
        if (panel) {
          panel.setAttribute('role', 'tabpanel');
          if (!btn.id) btn.id = uid('ds-tab');
          if (!panel.id) panel.id = uid('ds-panel');
          btn.setAttribute('aria-controls', panel.id);
          panel.setAttribute('aria-labelledby', btn.id);
          if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '0');
        }
        btn.addEventListener('click', () => activateTab(buttons, panels, i));
        btn.addEventListener('keydown', e => {
          let next = -1;
          if (e.key === 'ArrowRight') next = (i + 1) % buttons.length;
          else if (e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = buttons.length - 1;
          if (next === -1) return;
          e.preventDefault();
          activateTab(buttons, panels, next);
          buttons[next].focus();
        });
      });

      if (list) {
        updateTabListScroll(list);
        list.addEventListener('scroll', () => updateTabListScroll(list), { passive: true });
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(() => updateTabListScroll(list)).observe(list);
        }
      }
    });
  };

  /* ----------------------------------------------------------------
     MODAL — <dialog> natif + data-modal-open / data-modal-close
     Focus trap + ESC natifs. On ajoute backdrop-click et retour focus.
  ---------------------------------------------------------------- */
  const initModals = (root = document) => {
    $$('dialog.modal', root).forEach(d => {
      if (!markInit(d, 'Modal')) return;
      d.addEventListener('click', e => { if (e.target === d) d.close(); });
    });
  };

  // Event delegation — marche pour tout élément (même ajouté dynamiquement)
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) {
      const d = document.getElementById(opener.dataset.modalOpen);
      if (d && typeof d.showModal === 'function') d.showModal();
      return;
    }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) {
      closer.closest('dialog')?.close();
    }
  });

  /* ----------------------------------------------------------------
     DROPDOWN — Popover API + positionnement + clavier
     Clavier : ↑/↓ · Home/End · Escape (natif popover)
  ---------------------------------------------------------------- */
  const positionDropdown = (menu) => {
    const trigger = document.querySelector(`[popovertarget="${CSS.escape(menu.id)}"]`);
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const mr = menu.getBoundingClientRect();
    const forceUp = menu.classList.contains('dropdown-up');
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = forceUp || (spaceBelow < mr.height + 16 && r.top > mr.height + 16);
    menu.style.top = openUp ? `${r.top - mr.height - 6}px` : `${r.bottom + 6}px`;
    const overflowRight = r.left + mr.width > window.innerWidth - 16;
    menu.style.left = overflowRight ? `${r.right - mr.width}px` : `${r.left}px`;
  };

  const initDropdowns = (root = document) => {
    $$('.dropdown-menu[popover]', root).forEach(menu => {
      if (!markInit(menu, 'Dropdown')) return;
      if (!menu.hasAttribute('role')) menu.setAttribute('role', 'menu');
      $$('.dropdown-item', menu).forEach(it => {
        if (!it.hasAttribute('role')) it.setAttribute('role', 'menuitem');
      });

      menu.addEventListener('toggle', e => {
        if (e.newState !== 'open') return;
        positionDropdown(menu);
        // Focus sur le 1er item, après que le popover soit visible
        requestAnimationFrame(() => {
          const first = menu.querySelector('.dropdown-item');
          first?.focus();
        });
      });

      menu.addEventListener('keydown', e => {
        const items = $$('.dropdown-item', menu);
        if (!items.length) return;
        const idx = items.indexOf(document.activeElement);
        let next = -1;
        if (e.key === 'ArrowDown') next = idx < items.length - 1 ? idx + 1 : 0;
        else if (e.key === 'ArrowUp') next = idx > 0 ? idx - 1 : items.length - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = items.length - 1;
        if (next === -1) return;
        e.preventDefault();
        items[next].focus();
      });
    });
  };

  // Ferme tous les popovers ouverts au scroll (pattern Google/Linear)
  window.addEventListener('scroll', () => {
    $$('.dropdown-menu').forEach(m => {
      if (m.matches?.(':popover-open')) m.hidePopover?.();
    });
  }, { passive: true, capture: true });

  /* ----------------------------------------------------------------
     ALERT — bouton close
  ---------------------------------------------------------------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.alert-close');
    if (!btn) return;
    const alert = btn.closest('.alert');
    if (alert) alert.hidden = true;
  });

  /* ----------------------------------------------------------------
     TOOLTIP — CSS :hover + :focus-visible gèrent l'affichage.
     On ajoute juste aria-label (depuis data-tooltip) et tabindex si absents.
  ---------------------------------------------------------------- */
  const initTooltips = (root = document) => {
    $$('.tooltip[data-tooltip]', root).forEach(t => {
      if (!markInit(t, 'Tooltip')) return;
      if (!t.hasAttribute('aria-label')) t.setAttribute('aria-label', t.dataset.tooltip);
      if (!t.hasAttribute('tabindex') && !t.matches('a, button, input, select, textarea')) {
        t.setAttribute('tabindex', '0');
      }
    });
  };

  /* ----------------------------------------------------------------
     AVATAR — auto-color algorithmique depuis data-name ou texte
  ---------------------------------------------------------------- */
  const initAvatars = (root = document) => {
    $$('.avatar', root).forEach(av => {
      if (!markInit(av, 'Avatar')) return;
      if (av.querySelector('img')) return;
      if (Array.from(av.classList).some(c => /^avatar-c\d$/.test(c))) return;
      const src = av.dataset.name || av.textContent.trim();
      if (!src) return;
      const hash = Array.from(src).reduce((a, c) => a + c.charCodeAt(0), 0);
      av.classList.add('avatar-c' + ((hash % 6) + 1));
    });
  };

  /* ----------------------------------------------------------------
     TABLE — select-all (header ↔ rows) + sort toggle visuel
  ---------------------------------------------------------------- */
  const initTables = (root = document) => {
    $$('.table', root).forEach(table => {
      if (!markInit(table, 'Table')) return;
      const headerCb = table.querySelector('thead .table-select input[type="checkbox"]');
      const rowCbs = $$('tbody .table-select input[type="checkbox"]', table);
      if (headerCb && rowCbs.length) {
        headerCb.addEventListener('change', () => {
          rowCbs.forEach(cb => { cb.checked = headerCb.checked; });
          headerCb.indeterminate = false;
        });
        rowCbs.forEach(cb => cb.addEventListener('change', () => {
          const checkedCount = rowCbs.filter(c => c.checked).length;
          headerCb.checked = checkedCount === rowCbs.length;
          headerCb.indeterminate = checkedCount > 0 && checkedCount < rowCbs.length;
        }));
      }
      $$('th[data-sort]', table).forEach(th => {
        if (!th.hasAttribute('tabindex')) th.setAttribute('tabindex', '0');
        if (!th.hasAttribute('role')) th.setAttribute('role', 'button');
        const cycle = () => {
          const current = th.getAttribute('data-sort');
          $$('th[data-sort]', table).forEach(o => { if (o !== th) o.setAttribute('data-sort', ''); });
          const next = current === '' ? 'asc' : current === 'asc' ? 'desc' : '';
          th.setAttribute('data-sort', next);
          th.setAttribute('aria-sort', next === 'asc' ? 'ascending' : next === 'desc' ? 'descending' : 'none');
        };
        th.addEventListener('click', cycle);
        th.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); }
        });
      });
    });
  };

  /* ----------------------------------------------------------------
     CHECKBOX — état indeterminate via data-indeterminate
  ---------------------------------------------------------------- */
  const initIndeterminate = (root = document) => {
    $$('input[type="checkbox"][data-indeterminate]', root).forEach(i => {
      if (!markInit(i, 'Indet')) return;
      i.indeterminate = true;
    });
  };

  /* ----------------------------------------------------------------
     INIT — auto au DOMContentLoaded, exposition via window.DS
  ---------------------------------------------------------------- */
  const init = (root = document) => {
    initTabs(root);
    initModals(root);
    initDropdowns(root);
    initTooltips(root);
    initAvatars(root);
    initTables(root);
    initIndeterminate(root);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  window.DS = { init, initTabs, initModals, initDropdowns, initTooltips, initAvatars, initTables, initIndeterminate };
})();
