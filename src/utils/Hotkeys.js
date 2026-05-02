function isEditableElement(el) {
  if (!el) return false;

  const tag = el.tagName?.toLowerCase();
  return (
    el.isContentEditable ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select'
  );
}

function isPlusKey(e) {
  return (
    e.key === '+' ||
    (e.shiftKey && e.code === 'Equal') ||
    e.code === 'NumpadAdd'
  );
}

function isDeleteKey(e) {
  return e.key === 'Delete' || e.key === 'Backspace' || e.key === '-';
}

function isEnterKey(e) {
  return e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter';
}

function isEscapeKey(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape';
}

export function registerHotkeys({
  openCreate,
  openDelete,
  confirmCurrent,
  closeCurrent,
  isAnyModalOpen,
}) {
  const onKeydown = (e) => {
    const typing = isEditableElement(e.target);

    if (isEscapeKey(e)) {
      if (isAnyModalOpen?.()) {
        e.preventDefault();
        e.stopPropagation();
        closeCurrent?.();
      }
      return;
    }

    if (isEnterKey(e)) {
      if (isAnyModalOpen?.()) {
        e.preventDefault();
        e.stopPropagation();
        confirmCurrent?.();
      }
      return;
    }

    if (typing) return;

    if (isPlusKey(e)) {
      e.preventDefault();
      openCreate?.();
      return;
    }

    if (isDeleteKey(e)) {
      e.preventDefault();
      openDelete?.();
      return;
    }
  };

  window.addEventListener('keydown', onKeydown, true);

  return () => {
    window.removeEventListener('keydown', onKeydown, true);
  };
}