let currentUsers = [];
const deletedUsersBuffer = [];
let toastTimer = null;

document.addEventListener('DOMContentLoaded', async () => {
    loadSystemReport('#report-area');
    await loadUsers();
    setupToast();
});

async function refreshUsers() {
    await loadUsers();
}

async function loadUsers() {
    const loading  = id('users-loading');
    const errorBox = id('users-error');
    const wrap     = id('users-table-wrap');
    const tbody    = qs('#users-table tbody');
    const feedback = id('users-feedback');

    // Reset UI
    loading.classList.remove('hidden');
    errorBox.classList.add('hidden');
    wrap.classList.add('hidden');
    feedback.textContent = '';

    try {
        const users = await fetchUsers();
        if (!Array.isArray(users)) {
            throw new Error('API /api/users did not return an array');
        }

        currentUsers = users.slice();
        loading.classList.add('hidden');

        if (users.length === 0) {
            errorBox.textContent = 'No users found.';
            errorBox.classList.remove('hidden');
            return;
        }

        tbody.innerHTML = users.map(renderUserRow).join('');
        wrap.classList.remove('hidden');
        feedback.textContent = `Loaded ${users.length} user(s).`;
    } catch (e) {
        console.error('[users] loadUsers error:', e);
        loading.classList.add('hidden');
        errorBox.textContent = 'Failed: ' + (e.message || e);
        errorBox.classList.remove('hidden');
    }
}

function renderUserRow(u) {
    return `
    <tr data-id="${u.id}" data-active="${u.active}" data-suspicious="${u.suspicious}">
      <td>${u.id}</td>
      <td>${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>
        <span class="badge ${u.active ? 'green' : 'red'}">
          ${u.active ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="badge badge-suspicious ${u.suspicious ? 'red' : 'green'}">
          ${u.suspicious ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <button class="btn warn btn-sm user-toggle" title="Toggle suspicious flag">
          Toggle
        </button>
      </td>
      <td>
        <button class="btn danger btn-sm user-delete" title="Delete user">
          Delete
        </button>
      </td>
    </tr>
  `;
}

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('user-toggle')) {
        await handleSuspiciousToggle(e.target);
    } else if (e.target.classList.contains('user-delete')) {
        await handleBackendDelete(e.target);
    }
});

async function handleSuspiciousToggle(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;
    const currentSuspicious = tr.dataset.suspicious === 'true';
    const currentActive = tr.dataset.active === 'true';

    btn.disabled = true;
    tr.classList.add('updating-row');

    try {

        await updateUserFlags(id, {
            suspicious: !currentSuspicious,
            active: currentActive
        });


        tr.dataset.suspicious = (!currentSuspicious).toString();
        const badge = tr.querySelector('.badge-suspicious');
        if (badge) {
            badge.textContent = (!currentSuspicious) ? 'Yes' : 'No';
            badge.className = 'badge badge-suspicious ' + ((!currentSuspicious) ? 'red' : 'green');
        }

        tr.classList.remove('updating-row');
        btn.disabled = false;
        await refreshSystemReport('#report-area');
    } catch (err) {
        console.error('[users] toggle error:', err);
        tr.classList.remove('updating-row');
        btn.disabled = false;
        alert('Toggle failed: ' + (err.message || err));
    }
}

async function handleBackendDelete(btn) {
    const tr = btn.closest('tr');
    if (!tr) return;
    const id = parseInt(tr.dataset.id, 10);
    const username = tr.children[1].textContent.trim();

    if (!confirm(`Are you sure you want to DELETE "${username}"? This cannot be undone!`)) return;

    btn.disabled = true;
    tr.classList.add('updating-row');

    try {
        await deleteUser(id);
        tr.remove();
        currentUsers = currentUsers.filter(u => u.id !== id);
        showToast(`Deleted "${username}".`, false);
        await refreshSystemReport('#report-area');
    } catch (err) {
        tr.classList.remove('updating-row');
        btn.disabled = false;
        alert('Delete failed: ' + (err.message || err));
    }
}

function undoDelete() {
    showToast('Cannot undo delete after backend removal.');
}

function setupToast() {
    const toast = id('toast');
    if (!toast) return;
    const undoBtn = id('toast-undo');
    const closeBtn = id('toast-close');
    if (undoBtn) undoBtn.addEventListener('click', undoDelete);
    if (closeBtn) closeBtn.addEventListener('click', hideToast);
}

function showToast(msg, showUndo = false) {
    const toast = id('toast');
    if (!toast) return;
    id('toast-msg').textContent = msg;
    const undoBtn = id('toast-undo');
    if (undoBtn) undoBtn.style.display = showUndo ? 'inline-block' : 'none';
    toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
}

function hideToast() {
    const toast = id('toast');
    if (toast) toast.classList.add('hidden');
}


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

window.refreshUsers = refreshUsers;
