let dashboardMilestones = [];
let dashboardTodos = [];
let dashboardTaskLogs = [];

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        await requireAuthentication();
        await initializeLayout();
        await refreshFocusDashboard();
    }
);

async function refreshFocusDashboard() {
    try {
        await Promise.all([
            loadDashboardMilestones(),
            loadDashboardTodos(),
            loadDashboardTaskLogs(),
            loadDashboardPerformanceCounters()
        ]);
    } catch (error) {
        console.error("Dashboard engine synchronization error:", error);
        showError("Unable to refresh dashboard focus tracks.");
    }
}

// 1. Fetch & Map Strategic Runway (Active Milestones)
async function loadDashboardMilestones() {
    // Queries your native milestone detail matrix
    const data = await getData("vw_milestone_details?enabled=eq.true&order=target_date.asc");
    dashboardMilestones = Array.isArray(data) ? data.filter(m => m.status !== "Completed" && m.status !== "Cancelled") : [];
    
    const container = document.getElementById("milestoneRunway");
    document.getElementById("countMilestones").textContent = dashboardMilestones.length;
    document.getElementById("summaryMilestones").textContent = dashboardMilestones.length;
    container.innerHTML = "";

    if (dashboardMilestones.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#64748b;">No active milestone deliverables.</div>`;
        return;
    }

    dashboardMilestones.forEach(item => {
        const borderPriorityColor = item.status === "In Progress" ? "#ca8a04" : "#cbd5e1";
        container.innerHTML += `
            <div class="stream-item" style="border-left-color: ${borderPriorityColor};">
                <font style="font-weight:bold; color:var(--text-main);">${item.milestone_name}</font>
                <div class="item-meta">
                    <span>${item.portfolio_name} | ${item.project_name}</span>
                    <span style="font-weight:600;">📅 ${formatDate(item.target_date)}</span>
                </div>
            </div>
        `;
    });
}

// 2. Fetch & Map Action Desk (Open/Overdue ToDos)
async function loadDashboardTodos() {
    // Queries your specific vw_todo architecture layer
    const data = await getData("vw_todo?status=eq.Open&order=due_date.asc");
    dashboardTodos = Array.isArray(data) ? data : [];
    
    const container = document.getElementById("todoActionDesk");
    document.getElementById("countTodos").textContent = dashboardTodos.length;
    document.getElementById("summaryTodos").textContent = dashboardTodos.length;
    container.innerHTML = "";

    if (dashboardTodos.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#16a34a; font-weight:600;">Action Desk clear! No open items.</div>`;
        return;
    }

    dashboardTodos.forEach(item => {
        const todayStr = getToday();
        const isOverdue = item.due_date && item.due_date < todayStr;
        const borderStyleColor = isOverdue ? "var(--danger)" : "#2563eb";
        const dateDisplayLabel = item.due_date ? formatDate(item.due_date) : "No Due Date";

        container.innerHTML += `
            <div class="stream-item" style="border-left-color: ${borderStyleColor};" onclick="window.location.href='todo.html'">
                <font style="font-weight:600; color:var(--text-main);">${item.todo_text}</font>
                <div class="item-meta">
                    <span>⚡ ${item.activity_name}</span>
                    <span style="color: ${isOverdue ? "var(--danger)" : "inherit"}; font-weight:bold;">
                        ${isOverdue ? "⚠️ OVERDUE: " : ""} ${dateDisplayLabel}
                    </span>
                </div>
            </div>
        `;
    });
}

// 3. Fetch & Map Velocity Track Stream (Recent Task Log Entries)
async function loadDashboardTaskLogs() {
    // Accesses your vw_task_log_details structural stack view directly
    const data = await getData("vw_task_log_details?limit=5");
    dashboardTaskLogs = Array.isArray(data) ? data : [];
    
    const grid = document.getElementById("taskLogStream");
    grid.innerHTML = "";

    if (dashboardTaskLogs.length === 0) {
        grid.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:12px;">No tasks logged recently.</td></tr>`;
        return;
    }

    dashboardTaskLogs.forEach(item => {
        const timeBounds = item.start_time ? `[ ${formatTime(item.start_time)} - ${formatTime(item.end_time || "")} ]` : "";
        grid.innerHTML += `
            <tr>
                <td><strong>${formatDate(item.task_date)}</strong><br><small style="color:#64748b;">${timeBounds}</small></td>
                <td style="white-space:normal; font-weight:500;">${item.task_description}</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">${item.activity_name}<br><small>> ${item.project_name}</small></td>
                <td><span class="task-duration">${item.minutes_spent || 0} mins</span></td>
            </tr>
        `;
    });
}

// 4. Load Quick Summary performance metrics directly using the calculation structures from review.js
async function loadDashboardPerformanceCounters() {
    const data = await getData("vw_review_time_summary");
    if (Array.isArray(data) && data.length > 0) {
        const timeSummary = data[0];
        document.getElementById("summaryToday").textContent = `${((timeSummary.today_minutes || 0) / 60).toFixed(1)} hrs`;
    }
}