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
        // Calculate remaining window
        const today = new Date();
        const target = new Date(item.target_date);
        const daysRemaining = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        const isAtRisk = daysRemaining <= 10 && daysRemaining >= 0;

        const borderPriorityColor = isAtRisk ? "var(--danger)" : (item.status === "In Progress" ? "#ca8a04" : "#cbd5e1");
        const customBackground = isAtRisk ? "#fef2f2" : "var(--background)";

        container.innerHTML += `
            <div class="stream-item" style="border-left-color: ${borderPriorityColor}; background: ${customBackground};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <font style="font-weight:bold; color: ${isAtRisk ? "var(--danger)" : "var(--text-main)"};">${item.milestone_name}</font>
                    ${isAtRisk ? `<span style="font-size:0.65rem; background:#fee2e2; padding:2px 4px; border-radius:4px; font-weight:800; color:var(--danger)">🚨 AT RISK</span>` : ""}
                </div>
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

    const todayStr = getToday();
    const urgentItems = dashboardTodos.filter(t => t.due_date && t.due_date <= todayStr);
    const upcomingItems = dashboardTodos.filter(t => !t.due_date || t.due_date > todayStr);

    let html = "";

    // Render Section A: Urgent Tasks
    html += `<div style="font-weight:700; font-size:0.75rem; color:var(--danger); margin: 4px 0 6px 0;">🔥 URGENT DESK (TODAY / OVERDUE)</div>`;
    if (urgentItems.length === 0) {
        html += `<div style="padding:6px; font-size:0.8rem; color:#16a34a; text-align:center;">✨ No urgent actions!</div>`;
    } else {
        urgentItems.forEach(item => {
            const isOverdue = item.due_date < todayStr;
            html += `
                <div class="stream-item" style="border-left-color: var(--danger); margin-bottom:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <font style="font-weight:600; color:var(--text-main); cursor:pointer;" onclick="window.location.href='todo.html'">${item.todo_text}</font>
                        <span style="color:#2563eb; font-size:0.75rem; font-weight:700; cursor:pointer; padding-left:10px;" onclick="quickLogToDo('${item.todo_id}', '${item.todo_text.replace(/'/g, "\\'")}', '${item.activity_id}')">⏱️ Log</span>
                    </div>
                    <div class="item-meta" onclick="window.location.href='todo.html'">
                        <span>⚡ ${item.activity_name}</span>
                        <span style="color:var(--danger); font-weight:bold;">${isOverdue ? "⚠️ OVERDUE" : "Due Today"}</span>
                    </div>
                </div>
            `;
        });
    }

    // Render Section B: Rest of the Pipeline
    if (upcomingItems.length > 0) {
        html += `<div style="font-weight:700; font-size:0.75rem; color:#64748b; margin: 12px 0 6px 0;">📅 UPCOMING & BACKLOG</div>`;
        upcomingItems.forEach(item => {
            const dateDisplayLabel = item.due_date ? formatDate(item.due_date) : "No Due Date";
            html += `
                <div class="stream-item" style="border-left-color: #2563eb; margin-bottom:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <font style="font-weight:600; color:var(--text-main); cursor:pointer;" onclick="window.location.href='todo.html'">${item.todo_text}</font>
                        <span style="color:#2563eb; font-size:0.75rem; font-weight:700; cursor:pointer; padding-left:10px;" onclick="quickLogToDo('${item.todo_id}', '${item.todo_text.replace(/'/g, "\\'")}', '${item.activity_id}')">⏱️ Log</span>
                    </div>
                    <div class="item-meta" onclick="window.location.href='todo.html'">
                        <span>⚡ ${item.activity_name}</span>
                        <span>${dateDisplayLabel}</span>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
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


// 🚀 NEW: Intercepts a ToDo item and forwards it straight to your Task Log popup template
function quickLogToDo(todoId, todoText, activityId) {
    if (window.event) {
        window.event.stopPropagation(); // Prevents clicking the row from opening todo.html
    }
    sessionStorage.setItem("QUICK_LOG_DESC", `Action Complete: ${todoText}`);
    sessionStorage.setItem("QUICK_LOG_ACTIVITY", activityId);
    window.location.href = "task-log.html?action=new";
}
