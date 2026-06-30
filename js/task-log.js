
//Version2


let taskLogData = [];

let activityData = [];

let milestoneData = [];

let filteredActivityData = [];

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await requireAuthentication();

        await initializeLayout();


        loadStatusDropdown(
            "activityStatusFilter",
            true,
            "All Activity Statuses"
        );


        initializeDateFilters();

        await loadMilestones();

        populatePriorityDropdown();

        await loadActivities();

        await loadTaskLogs();

        document
            .getElementById(
                "taskDescription"
            )
            ?.addEventListener(
                "input",
                updateCharacterCount
            );

        // 🚀 AUTO-FILL ACTION: Pre-populate when coming straight from the dashboard desk shortcuts
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'new') {
            newTaskLog(); 
            
            const quickDesc = sessionStorage.getItem("QUICK_LOG_DESC");
            const quickActivity = sessionStorage.getItem("QUICK_LOG_ACTIVITY");
            
            if (quickDesc && quickActivity) {
                document.getElementById("taskDescription").value = quickDesc;
                document.getElementById("activityId").value = quickActivity;
                activityChanged(); 
                
                sessionStorage.removeItem("QUICK_LOG_DESC");
                sessionStorage.removeItem("QUICK_LOG_ACTIVITY");
            }
        }

        // 🚀 DESKTOP SHORTCUT: Puts your input field cursor active right away
        document.getElementById("searchText")?.focus();
    }
);


function initializeDateFilters() {

    document.getElementById(
        "periodFilter"
    ).value =
        "This Week";

    applyPeriodFilter();
}



function applyPeriodFilter() {

    const period =
        document.getElementById(
            "periodFilter"
        ).value;

    const today =
        new Date();

    let fromDate = "";
    let toDate = "";

    if (
        period === "Today"
    ) {

        fromDate =
            getToday();

        toDate =
            getToday();
    }

    else if (
        period === "This Week"
    ) {


        const start =
            new Date(today);

        const day =
            today.getDay();

        const mondayOffset =
            day === 0
                ? -6
                : 1 - day;

        start.setDate(
            today.getDate() +
            mondayOffset
        );


        fromDate =
            start
                .toISOString()
                .substring(0, 10);

        toDate =
            getToday();
    }

    else if (
        period === "This Month"
    ) {

        const start =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

        fromDate =
            start
                .toISOString()
                .substring(0, 10);

        toDate =
            getToday();
    }

    else {

        fromDate = "";
        toDate = "";
    }

    document.getElementById(
        "fromDate"
    ).value = fromDate;

    document.getElementById(
        "toDate"
    ).value = toDate;

    //renderTaskLogGrid();

    renderTaskLogFeed();

}


function refreshTaskLogView() {

    renderTaskLogFeed();

}



async function loadActivities() {

    activityData =
        await getData(
            "vw_activity_details?enabled=eq.true&order=activity_name.asc"
        );

    if (!Array.isArray(activityData)) {

        console.error(
            activityData
        );

        activityData = [];

        showError(
            "Unable to load activities"
        );

        return;
    }

    filteredActivityData =
        [...activityData];

    populateActivityDropdown();

    populateMilestoneDropdown();
}

function populateActivityDropdown() {

    const dropdown =
        document.getElementById(
            "activityId"
        );


    dropdown.innerHTML = `
        <option value="">
            Select Activity
        </option>
    `;


    filteredActivityData.forEach(
        item => {

            dropdown.innerHTML += `
                <option value="${item.activity_id}">
                    ${item.activity_name}
                </option>
            `;
        }
    );

    dropdown.innerHTML += `
        <option value="NEW_ACTIVITY">
            + Create New Activity
        </option>
    `;
}

function populateMilestoneDropdown() {

    const dropdown =
        document.getElementById(
            "newActivityMilestone"
        );

    dropdown.innerHTML = `
        <option value="">
            Standalone Activity
        </option>
    `;

    milestoneData.forEach(item => {

        dropdown.innerHTML += `
            <option value="${item.milestone_id}">
                ${item.portfolio_name}
                |
                ${item.project_name}
                |
                ${item.milestone_name}
            </option>
        `;
    });
}

async function loadMilestones() {

    milestoneData =
        await getData(
            "vw_milestone_details?enabled=eq.true&order=milestone_name.asc"
        );

    populateMilestoneDropdown();
}


function populatePriorityDropdown() {

    const dropdown =
        document.getElementById(
            "newActivityPriority"
        );

    dropdown.innerHTML = "";

    MASTERS.ACTIVITY_PRIORITY.forEach(
        item => {

            dropdown.innerHTML += `
                <option value="${item}">
                    ${item}
                </option>
            `;
        }
    );
}



function filterActivities() {

    const search =
        document
            .getElementById(
                "activitySearch"
            )
            .value
            .toLowerCase();

    filteredActivityData =
        activityData.filter(item =>

            (item.activity_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.milestone_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.project_name || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.portfolio_name || "")
                .toLowerCase()
                .includes(search)
        );

    populateActivityDropdown();
}

function activityChanged() {

    const activityId =
        document.getElementById(
            "activityId"
        ).value;

    const newActivitySection =
        document.getElementById(
            "newActivitySection"
        );

    if (
        activityId ===
        "NEW_ACTIVITY"
    ) {

        newActivitySection.style.display =
            "block";

        document.getElementById(
            "activityContext"
        ).innerHTML =
            "New Activity";

        return;
    }

    newActivitySection.style.display =
        "none";

    const activity =
        activityData.find(
            x =>
                x.activity_id ===
                activityId
        );

    if (!activity) {

        document.getElementById(
            "activityContext"
        ).innerHTML =
            "Select Activity";

        return;
    }

    document.getElementById(
        "activityContext"
    ).innerHTML =

        activity.milestone_id

            ?

            `${activity.portfolio_name}
            |
            ${activity.project_name}
            |
            ${activity.milestone_name}`

            :

            "Standalone Activity";
}

async function loadTaskLogs() {

    taskLogData =
        await getData(
            "vw_task_log_details?order=task_date.desc"
        );

    if (!Array.isArray(taskLogData)) {

        console.error(
            taskLogData
        );

        taskLogData = [];

        showError(
            "Unable to load task logs"
        );

        return;
    }

    renderTaskLogFeed();

}


/* ==================================
   v1.3cUI FILTER LOGIC FOR TASK LOGS
================================== */

function getFilteredTaskLogs() {

    const search =
        document
            .getElementById(
                "searchText"
            )
            .value
            .toLowerCase();

    const fromDate =
        document.getElementById(
            "fromDate"
        ).value;

    const toDate =
        document.getElementById(
            "toDate"
        ).value;

    const activityStatus =
        document.getElementById(
            "activityStatusFilter"
        ).value;

    return taskLogData.filter(item => {

        const matchesSearch =

            (item.task_description || "")
                .toLowerCase()
                .includes(search)

            ||

            (item.activity_name || "")
                .toLowerCase()
                .includes(search);

        let matchesDate =
            true;

        if (fromDate) {

            matchesDate =
                item.task_date >=
                fromDate;
        }

        if (
            matchesDate &&
            toDate
        ) {

            matchesDate =
                item.task_date <=
                toDate;
        }

        let matchesStatus =
            true;

        if (
            activityStatus !==
            "All"
        ) {

            matchesStatus =
                item.activity_status ===
                activityStatus;
        }

        return (
            matchesSearch &&
            matchesDate &&
            matchesStatus
        );
    });
}


/* ==================================
   v1.3cUI TOTAL RECORDS SECTION
================================== */

function updateTaskLogSummary(rows) {

    document.getElementById(
        "totalRecords"
    ).textContent =
        `Total Records: ${rows.length}`;

    const totalMinutes =
        rows.reduce(
            (sum, row) =>
                sum +
                (row.minutes_spent || 0),
            0
        );

    document.getElementById(
        "totalMinutes"
    ).textContent =
        `Total Minutes: ${totalMinutes}`;

    document.getElementById(
        "totalHours"
    ).textContent =
        `Total Hours: ${
            (totalMinutes / 60)
                .toFixed(1)
        }`;
}




function renderTaskLogGrid() {

    const grid =
        document.getElementById(
            "taskLogGrid"
        );

    const search =
        document
            .getElementById(
                "searchText"
            )
            .value
            .toLowerCase();

    const fromDate =
        document.getElementById(
            "fromDate"
        ).value;

    const toDate =
        document.getElementById(
            "toDate"
        ).value;

    const activityStatus =
        document.getElementById(
            "activityStatusFilter"
        ).value;


    const rows =
        getFilteredTaskLogs();


    updateTaskLogSummary(
        rows
    );

    grid.innerHTML = "";

    if (rows.length === 0) {

        grid.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;">
                    No task logs found
                </td>
            </tr>
        `;

        return;
    }

    rows.forEach(item => {

        const context =

            item.milestone_id

            ?

            `${item.portfolio_name}
             </br>->
             ${item.project_name}
             </br>->
             ${item.milestone_name}`

            :

            "Standalone Activity";

        grid.innerHTML += `

        <tr>

            <td>
                ${formatDate(
                    item.task_date
                )}
            </td>

            <td>
                ${item.task_description || ""}
            </td>


            <td>
                ${item.activity_name || ""}

                </br>

                <font style=" color:#666;">

                    > (${item.activity_status || ""})

                </font>


            </td>


            <td>
                ${item.minutes_spent || 0}
            </td>

            <td>
                ${formatTime(item.start_time)}
            </td>

            <td>
                ${formatTime(item.end_time)}
            </td>

            <td>
                ${context}
            </td>

            <td>

                <button
                    class="btn btn-primary"
                    onclick="editTaskLog('${item.task_log_id}')">

                    &#9999;&#65039;

                </button>

                <button
                    class="btn btn-danger"
                    onclick="deleteTaskLog('${item.task_log_id}')">

                    &#128465;&#65039;

                </button>

            </td>

        </tr>

        `;
    });
}


/* ==================================
   v1.2UI LOG CARD LAYOUT
================================== */

function renderTaskLogFeed() {

    const feed =
        document.getElementById(
            "taskLogFeed"
        );

    if (!feed) {
        return;
    }

    feed.innerHTML = "";

    const rows =
        [...getFilteredTaskLogs()]
            .sort(
                (a, b) => {

                    const dateCompare =
                        b.task_date
                            .localeCompare(
                                a.task_date
                            );

                    if (dateCompare !== 0) {
                        return dateCompare;
                    }

                    return (
                        (b.start_time || "")
                            .localeCompare(
                                a.start_time || ""
                            )
                    );
                }
            );

    updateTaskLogSummary(
        rows
    );


    if (rows.length === 0) {

        feed.innerHTML =
            "<p>No task logs found</p>";

        return;
    }

    let currentDate = "";

    rows.forEach(item => {

        if (
            currentDate !==
            item.task_date
        ) {

            currentDate =
                item.task_date;

            feed.innerHTML += `
                <div
                    class="task-date-header">

                    ${formatDateWithDay(
                        item.task_date
                    )}

                </div>

                <div
                    class="task-date-group"
                    id="date-${item.task_date}">
                </div>
            `;
        }

        const duration =

            item.start_time &&
            item.end_time

                ?

                `${item.minutes_spent || 0} min
                </br>[
                ${formatTime(item.start_time)}
                -
                ${formatTime(item.end_time)} ]`

                :

                `${item.minutes_spent || 0} min`;

        const dateGroup =
            document.getElementById(
                `date-${item.task_date}`
            );

        dateGroup.innerHTML += `

            <div class="task-card">

                <div
                    class="task-duration">

                    ${duration}

                </div>

                <div
                    class="task-description">

                    ${item.task_description || ""}

                </div>

                <div
                    class="task-activity">

                    ${item.activity_name || ""}

                </div>

                <div
                    class="task-actions">

                    <button
                        class="btn btn-primary"
                        onclick="editTaskLog('${item.task_log_id}')">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteTaskLog('${item.task_log_id}')">

                        Delete

                    </button>

                </div>

            </div>
        `;
    });
}




function updateCharacterCount() {

    const text =
        document.getElementById(
            "taskDescription"
        ).value;

    document.getElementById(
        "charCount"
    ).textContent =
        `${text.length} / 1000`;
}


function newTaskLog() {

    document.getElementById(
        "taskLogId"
    ).value = "";

    document.getElementById(
        "taskDate"
    ).value =
        getToday();

    document.getElementById(
        "taskDescription"
    ).value = "";

    document.getElementById(
        "minutesSpent"
    ).value = 0;

    document.getElementById(
        "startTime"
    ).value = "";

    document.getElementById(
        "endTime"
    ).value = "";

    document.getElementById(
        "markActivityCompleted"
    ).checked = false;

    document.getElementById(
        "newActivitySection"
    ).style.display =
        "none";

    updateCharacterCount();

    resetActivitySearch();

    document.getElementById(
        "activityId"
    ).selectedIndex = 0;

    activityChanged();


    document.getElementById(
        "taskLogOptional"
    ).open = false;


    openModal(
        "taskLogModal"
    );

    document.getElementById(
        "taskDescription"
    ).focus();

}

function editTaskLog(id) {

    const item =
        taskLogData.find(
            x =>
                x.task_log_id === id
        );

    if (!item) {
        return;
    }


    document.getElementById(
        "taskLogId"
    ).value =
        item.task_log_id;

    document.getElementById(
        "taskDate"
    ).value =
        formatDateForInput(
            item.task_date
        );

    document.getElementById(
        "taskDescription"
    ).value =
        item.task_description || "";

    resetActivitySearch();

    document.getElementById(
        "activityId"
    ).value =
        item.activity_id;

    document.getElementById(
        "minutesSpent"
    ).value =
        item.minutes_spent || 0;

    document.getElementById(
        "startTime"
    ).value =
        item.start_time || "";

    document.getElementById(
        "endTime"
    ).value =
        item.end_time || "";

    updateCharacterCount();

    activityChanged();


    document.getElementById(
        "taskLogOptional"
    ).open = false;

    openModal(
        "taskLogModal"
    );

    document.getElementById(
        "taskDescription"
    ).focus();

}

async function saveTaskLog() {

    let activityId =
        document.getElementById(
            "activityId"
        ).value;

    const taskLogId =
        getInputValue(
            "taskLogId"
        );

    const taskDate =
        getInputValue(
            "taskDate"
        );

    const taskDescription =
        getInputValue(
            "taskDescription"
        ).trim();

    if (
        !taskDate ||
        !taskDescription
    ) {

        showError(
            "Task Date and Task Description are required"
        );

        return;
    }

    if (
        activityId ===
        "NEW_ACTIVITY"
    ) {

        activityId =
            await createInlineActivity();

        if (!activityId) {
            return;
        }
    }

    if (!activityId) {

        showError(
            "Activity is required"
        );

        return;
    }

    const payload = {

        activity_id:
            activityId,

        task_date:
            taskDate,

        task_description:
            taskDescription,

        minutes_spent:
            parseInt(
                getInputValue(
                    "minutesSpent"
                ) || 0
            ),

        start_time:
            getInputValue(
                "startTime"
            ) || null,

        end_time:
            getInputValue(
                "endTime"
            ) || null,

        updated_by:
            getCurrentUser()
    };

    try {

        if (!taskLogId) {

            payload.created_by =
                g