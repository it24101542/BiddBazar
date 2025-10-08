async function loadSystemReport(intoSelector, showRefresh=true) {
  const container = document.querySelector(intoSelector);
  if (!container) return;
  container.innerHTML = `
    <div class="system-report-block">
      <h3 style="position:relative;">System Report
        ${showRefresh ? '<button class="refresh-btn" type="button" onclick="refreshSystemReport(\''+intoSelector+'\')">Refresh</button>' : ''}
      </h3>
      <div class="loading" id="sysreport-loading">Loading...</div>
      <div class="error-box hidden" id="sysreport-error"></div>
      <div class="sys-metrics hidden" id="sysreport-metrics"></div>
    </div>
  `;
  await refreshSystemReport(intoSelector);
}

async function refreshSystemReport(intoSelector) {
  const cont = document.querySelector(intoSelector);
  if (!cont) return;
  const loading = cont.querySelector('#sysreport-loading');
  const errorBox = cont.querySelector('#sysreport-error');
  const metricsWrap = cont.querySelector('#sysreport-metrics');
  errorBox.classList.add('hidden');
  metricsWrap.classList.add('hidden');
  loading.classList.remove('hidden');
  try {
    const summary = await fetchSummary();
    const metrics = [
      ['Admins', summary.totalAdmins],
      ['Users', summary.totalUsers],
      ['Suspicious', summary.suspiciousUsers],
      ['Items', summary.totalItems],
      ['Active Items', summary.activeItems],
      ['Fraudulent', summary.fraudulentItems],
      ['Bids', summary.totalBids]
    ];
    metricsWrap.innerHTML = metrics.map(m => `
      <div class="sys-metric">
        ${m[0]}<span>${m[1]}</span>
      </div>`).join('');
    loading.classList.add('hidden');
    metricsWrap.classList.remove('hidden');
  } catch (e) {
    loading.classList.add('hidden');
    errorBox.textContent = 'Failed: ' + e.message;
    errorBox.classList.remove('hidden');
  }
}