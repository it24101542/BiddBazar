let currentItems = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadSystemReport('#report-area');
    await loadItems();
});

async function refreshItems() {
    await loadItems();
}

async function loadItems() {
    const loading  = id('items-loading');
    const errorBox = id('items-error');
    const wrap     = id('items-table-wrap');
    const tbody    = qs('#items-table tbody');

    loading.classList.remove('hidden');
    errorBox.classList.add('hidden');
    wrap.classList.add('hidden');

    try {
        const items = await fetchItems();
        if (!Array.isArray(items)) {
            throw new Error('API /api/items did not return an array');
        }

        currentItems = items.slice();
        loading.classList.add('hidden');

        if (items.length === 0) {
            errorBox.textContent = 'No items found.';
            errorBox.classList.remove('hidden');
            return;
        }

        tbody.innerHTML = items.map(renderItemRow).join('');
        wrap.classList.remove('hidden');
    } catch (e) {
        console.error('[items] loadItems error:', e);
        loading.classList.add('hidden');
        errorBox.textContent = 'Failed: ' + (e.message || e);
        errorBox.classList.remove('hidden');
    }
}

function renderItemRow(i) {
    return `
    <tr data-id="${i.id}" data-active="${i.active}" data-fraudulent="${i.fraudulent}">
      <td>${i.id}</td>
      <td>${escapeHtml(i.title)}</td>
      <td>
        <span class="badge ${i.active ? 'green' : 'red'}">
          ${i.active ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="badge badge-fraud ${i.fraudulent ? 'red' : 'green'}">
          ${i.fraudulent ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <button class="btn warn btn-sm item-toggle" title="Toggle fraudulent flag">
          Toggle
        </button>
      </td>
      <td>
        <button class="btn danger btn-sm item-delete" title="Delete item">
          Delete
        </button>
      </td>
    </tr>
  `;
}

/* Event Delegation */
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('item-toggle')) {
        await handleFraudToggle(e.target);
    } else if (e.target.classList.contains('item-delete')) {
        await handleItemDelete(e.target);
    }
});

async function handleFraudToggle(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;
    const currentFraud = tr.dataset.fraudulent === 'true';
    const currentActive = tr.dataset.active === 'true';

    btn.disabled = true;
    tr.classList.add('updating-row');

    try {
        await updateItemFlags(id, {
            fraudulent: !currentFraud,
            active: currentActive
        });

        // Update row dataset & badge
        tr.dataset.fraudulent = (!currentFraud).toString();
        const fraudBadge = tr.querySelector('.badge-fraud');
        if (fraudBadge) {
            fraudBadge.textContent = (!currentFraud) ? 'Yes' : 'No';
            fraudBadge.className = 'badge badge-fraud ' + ((!currentFraud) ? 'red' : 'green');
        }

        tr.classList.remove('updating-row');
        btn.disabled = false;
        await refreshSystemReport('#report-area');
    } catch (err) {
        console.error('[items] toggle error:', err);
        tr.classList.remove('updating-row');
        btn.disabled = false;
        alert('Toggle failed: ' + (err.message || err));
    }
}

async function handleItemDelete(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const id = parseInt(tr.dataset.id, 10);
    const title = tr.children[1].textContent.trim();

    if (!confirm(`Are you sure you want to DELETE item "${title}"? This cannot be undone!`)) return;

    btn.disabled = true;
    tr.classList.add('updating-row');

    try {
        await deleteItem(id);
        tr.remove();
        currentItems = currentItems.filter(i => i.id !== id);
        await refreshSystemReport('#report-area');
    } catch (err) {
        tr.classList.remove('updating-row');
        btn.disabled = false;
        alert('Delete failed: ' + (err.message || err));
    }
}

//Utilities
function id(x) { return document.getElementById(x); }
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

window.refreshItems = refreshItems;