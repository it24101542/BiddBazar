document.addEventListener('DOMContentLoaded', async () => {
    loadSystemReport('#report-area');
    await loadBids();
});

async function loadBids() {
    const loading = document.getElementById('bids-loading');
    const errorBox = document.getElementById('bids-error');
    const wrap = document.getElementById('bids-table-wrap');
    const tbody = document.querySelector('#bids-table tbody');
    loading.classList.remove('hidden');
    errorBox.classList.add('hidden');
    wrap.classList.add('hidden');

    try {
        const bids = await fetchBids();
        console.log('[bids] raw:', bids.slice(0,3));
        loading.classList.add('hidden');

        if (!Array.isArray(bids)) {
            throw new Error('Bids API did not return an array');
        }
        if (!bids.length) {
            errorBox.textContent = 'No bids available.';
            errorBox.classList.remove('hidden');
            return;
        }

        tbody.innerHTML = bids.map(b => renderBidRow(b)).join('');
        wrap.classList.remove('hidden');
    } catch (e) {
        loading.classList.add('hidden');
        errorBox.textContent = 'Failed: ' + e.message;
        errorBox.classList.remove('hidden');
    }
}


function renderBidRow(b) {
    const itemId =
        b.item?.id ??
        b.itemId ??
        b.item_id ??
        b.itemID ??
        '?';

    const bidderId =
        b.bidder?.id ??
        b.bidderId ??
        b.bidder_id ??
        b.user?.id ??
        b.userId ??
        b.user_id ??
        b.bidderUserId ??
        b.bidder_user_id ??
        '?';

    const amount = b.amount ?? b.value ?? b.bidAmount ?? '';

    const rawTime =
        b.placedAt ??
        b.placed_at ??
        b.bidTime ??
        b.bid_time ??
        b.createdAt ??
        b.created_at ??
        null;

    return `
    <tr>
      <td>${b.id}</td>
      <td>${itemId}</td>
      <td>${bidderId}</td>
      <td>${formatAmount(amount)}</td>
      <td>${formatBidTime(rawTime)}</td>
    </tr>
  `;
}

function formatAmount(a) {
    if (a == null || a === '') return '';

    const n = Number(a);
    return isNaN(n) ? a : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatBidTime(val) {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d)) return val;

    return d.toLocaleString();

}