/* Shape Architect board/grid primitives. Rendering is kept separate from puzzle state so
   pointer movement can update only the preview instead of rebuilding the board. */
const ShapeArchitectGrid = (() => {
  const SIZE = 8;

  function cell(board, r, c) {
    return board?.querySelector('.architect-cell[data-r="' + r + '"][data-c="' + c + '"]') || null;
  }

  function render(board, mask, placements, getCells) {
    board.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const el = document.createElement('div');
        el.className = 'architect-cell ' + (mask[r][c] === '#' ? 'target' : 'empty');
        el.dataset.r = r;
        el.dataset.c = c;
        if (mask[r][c] === '#') {
          el.tabIndex = 0;
          el.setAttribute('role', 'gridcell');
          el.setAttribute('aria-label', 'Picture square ' + (r + 1) + ', ' + (c + 1));
        }
        fragment.appendChild(el);
      }
    }
    board.appendChild(fragment);
    for (const [id, placement] of placements) paintPlacement(board, id, placement, getCells, false);
  }

  function paintPlacement(board, id, placement, getCells, preview) {
    for (const [rr, cc] of getCells(id, placement.rot)) {
      const el = cell(board, placement.r + rr, placement.c + cc);
      if (el) {
        el.classList.add(preview ? 'preview' : 'filled');
        if (!preview) el.dataset.piece = String(id + 1);
      }
    }
  }

  function clearPreview(board) {
    board?.querySelectorAll('.architect-cell.preview').forEach(el => {
      el.classList.remove('preview', 'preview-invalid');
    });
  }

  function paintPreview(board, cells, valid) {
    clearPreview(board);
    for (const [r, c] of cells) {
      const el = cell(board, r, c);
      if (el && r >= 0 && c >= 0 && r < SIZE && c < SIZE) {
        el.classList.add('preview');
        el.classList.toggle('preview-invalid', !valid);
      }
    }
  }

  function pointerCell(board, event) {
    const rect = board.getBoundingClientRect();
    const size = rect.width / SIZE;
    return [
      Math.max(0, Math.min(SIZE - 1, Math.floor((event.clientY - rect.top) / size))),
      Math.max(0, Math.min(SIZE - 1, Math.floor((event.clientX - rect.left) / size)))
    ];
  }

  function createDragGhost(cells, rot, id) {
    const ghost = document.createElement('div');
    ghost.className = 'architect-drag-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    const oriented = cells(rot);
    const bounds = ShapeArchitectLibrary.bounds(oriented);
    ghost.style.setProperty('--rows', bounds.rows);
    ghost.style.setProperty('--cols', bounds.cols);
    ghost.innerHTML = oriented.map(([r, c]) =>
      '<i style="grid-row:' + (r + 1) + ';grid-column:' + (c + 1) + '"></i>'
    ).join('');
    ghost.dataset.piece = String(id + 1);
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveDragGhost(ghost, x, y) {
    if (ghost) ghost.style.transform = 'translate3d(' + (x + 14) + 'px,' + (y + 14) + 'px,0)';
  }

  function removeDragGhost(ghost) {
    ghost?.remove();
  }

  return {SIZE, cell, render, paintPlacement, clearPreview, paintPreview, pointerCell, createDragGhost, moveDragGhost, removeDragGhost};
})();
