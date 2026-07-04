/* ======================= UTILITY ======================= */

function clone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

function createTable() {

    let n = parseInt(document.getElementById("processCount").value);

    if (isNaN(n) || n <= 0) {
        alert("Enter valid number of processes");
        return;
    }

    let html = `
    <table>
        <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
        </tr>
    `;

    for (let i = 1; i <= n; i++) {

        html += `
        <tr>
            <td>P${i}</td>
            <td><input type="number" id="at${i}" value="0"></td>
            <td><input type="number" id="bt${i}" value="1"></td>
            <td><input type="number" id="pr${i}" value="1"></td>
        </tr>
        `;
    }

    html += "</table>";

    document.getElementById("tableContainer").innerHTML = html;
}


/* ======================= INPUT ======================= */

function getProcesses() {

    let n = parseInt(document.getElementById("processCount").value);

    if (isNaN(n) || n <= 0) {
        alert("Enter valid number of processes");
        return [];
    }

    let processes = [];

    for (let i = 1; i <= n; i++) {

        let at = document.getElementById("at" + i);
        let bt = document.getElementById("bt" + i);
        let pr = document.getElementById("pr" + i);

        if (!at || !bt || !pr) {
            alert("Please create the table first.");
            return [];
        }

        processes.push({
            id: "P" + i,
            arrival: parseInt(at.value),
            burst: parseInt(bt.value),
            priority: parseInt(pr.value)
        });
    }

    return processes;
}


/* ======================= RESULT CALCULATOR ======================= */

function calculateAverage(processes) {

    let totalWT = 0;
    let totalTAT = 0;

    for (let p of processes) {

        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;

        totalWT += p.waiting;
        totalTAT += p.turnaround;
    }

    return {
        avgWT: totalWT / processes.length,
        avgTAT: totalTAT / processes.length,
        processes: processes
    };
}


/* ======================= FCFS ======================= */

function fcfs(processes) {

    let p = clone(processes);

    p.sort((a, b) => {

        if (a.arrival !== b.arrival)
            return a.arrival - b.arrival;

        return parseInt(a.id.substring(1)) -
               parseInt(b.id.substring(1));
    });

    let time = 0;

    let gantt = [];

    for (let proc of p) {

        if (time < proc.arrival)
            time = proc.arrival;

        proc.start = time;

        proc.completion = time + proc.burst;

        gantt.push({
            process: proc.id,
            start: proc.start,
            end: proc.completion
        });

        time = proc.completion;
    }

    let result = calculateAverage(p);

    result.gantt = gantt;

    return result;
}


/* ======================= SJF NON PREEMPTIVE ======================= */

function sjf(processes) {

    let p = clone(processes);

    let n = p.length;

    let completed = Array(n).fill(false);

    let finished = 0;

    let time = Math.min(...p.map(x => x.arrival));

    let gantt = [];

    while (finished < n) {

        let idx = -1;

        for (let i = 0; i < n; i++) {

            if (
                !completed[i] &&
                p[i].arrival <= time &&
                (
                    idx === -1 ||

                    p[i].burst < p[idx].burst ||

                    (
                        p[i].burst === p[idx].burst &&
                        p[i].arrival < p[idx].arrival
                    ) ||

                    (
                        p[i].burst === p[idx].burst &&
                        p[i].arrival === p[idx].arrival &&
                        parseInt(p[i].id.substring(1)) <
                        parseInt(p[idx].id.substring(1))
                    )
                )
            ) {
                idx = i;
            }
        }

        if (idx === -1) {
            time++;
            continue;
        }

        p[idx].start = time;

        p[idx].completion = time + p[idx].burst;

        gantt.push({
            process: p[idx].id,
            start: p[idx].start,
            end: p[idx].completion
        });

        time = p[idx].completion;

        completed[idx] = true;

        finished++;
    }

    let result = calculateAverage(p);

    result.gantt = gantt;

    return result;
}
/* ======================= PRIORITY NON PREEMPTIVE ======================= */

function priorityScheduling(processes) {

    let p = clone(processes);

    let n = p.length;

    let completed = Array(n).fill(false);

    let finished = 0;

    let time = Math.min(...p.map(x => x.arrival));

    let gantt = [];

    while (finished < n) {

        let idx = -1;

        for (let i = 0; i < n; i++) {

            if (
                !completed[i] &&
                p[i].arrival <= time &&
                (
                    idx === -1 ||

                    p[i].priority < p[idx].priority ||

                    (
                        p[i].priority === p[idx].priority &&
                        p[i].arrival < p[idx].arrival
                    ) ||

                    (
                        p[i].priority === p[idx].priority &&
                        p[i].arrival === p[idx].arrival &&
                        parseInt(p[i].id.substring(1)) <
                        parseInt(p[idx].id.substring(1))
                    )
                )
            ) {
                idx = i;
            }
        }

        if (idx === -1) {
            time++;
            continue;
        }

        p[idx].start = time;

        p[idx].completion = time + p[idx].burst;

        gantt.push({
            process: p[idx].id,
            start: p[idx].start,
            end: p[idx].completion
        });

        time = p[idx].completion;

        completed[idx] = true;

        finished++;
    }

    let result = calculateAverage(p);

    result.gantt = gantt;

    return result;
}
/* ======================= SJF PREEMPTIVE (SRTF) ======================= */
/* ======================= SJF PREEMPTIVE (SRTF) ======================= */

function sjfPreemptive(processes) {

    let p = clone(processes);

    let n = p.length;

    let remaining = p.map(x => x.burst);

    let completed = 0;

    let time = Math.min(...p.map(x => x.arrival));

    let gantt = [];

    while (completed < n) {

        let idx = -1;
        let minRemaining = Infinity;

        // Find process with shortest remaining time
        for (let i = 0; i < n; i++) {

            if (
                p[i].arrival <= time &&
                remaining[i] > 0
            ) {

                if (
                    remaining[i] < minRemaining ||

                    (
                        remaining[i] === minRemaining &&
                        (
                            idx === -1 ||
                            p[i].arrival < p[idx].arrival ||
                            (
                                p[i].arrival === p[idx].arrival &&
                                parseInt(p[i].id.substring(1)) <
                                parseInt(p[idx].id.substring(1))
                            )
                        )
                    )
                ) {
                    minRemaining = remaining[i];
                    idx = i;
                }
            }
        }

        // CPU Idle
        if (idx === -1) {
            time++;
            continue;
        }

        // First execution
        if (p[idx].start === undefined)
            p[idx].start = time;

        // Gantt Chart
        if (
            gantt.length > 0 &&
            gantt[gantt.length - 1].process === p[idx].id
        ) {
            gantt[gantt.length - 1].end++;
        } else {
            gantt.push({
                process: p[idx].id,
                start: time,
                end: time + 1
            });
        }

        // Execute for one unit
        remaining[idx]--;
        time++;

        // Completed
        if (remaining[idx] === 0) {
            p[idx].completion = time;
            completed++;
        }
    }

    let result = calculateAverage(p);
    result.gantt = gantt;

    return result;
}
/* ======================= PRIORITY PREEMPTIVE ======================= */

function priorityPreemptive(processes) {

    let p = clone(processes);

    let n = p.length;

    let remaining = p.map(x => x.burst);

    let completed = 0;

    let time = Math.min(...p.map(x => x.arrival));

    let gantt = [];

    while (completed < n) {

        let idx = -1;

        for (let i = 0; i < n; i++) {

            if (
                p[i].arrival <= time &&
                remaining[i] > 0 &&
                (
                    idx === -1 ||

                    p[i].priority < p[idx].priority ||

                    (
                        p[i].priority === p[idx].priority &&
                        remaining[i] < remaining[idx]
                    ) ||

                    (
                        p[i].priority === p[idx].priority &&
                        remaining[i] === remaining[idx] &&
                        p[i].arrival < p[idx].arrival
                    ) ||

                    (
                        p[i].priority === p[idx].priority &&
                        remaining[i] === remaining[idx] &&
                        p[i].arrival === p[idx].arrival &&
                        parseInt(p[i].id.substring(1)) <
                        parseInt(p[idx].id.substring(1))
                    )
                )
            ) {
                idx = i;
            }
        }

        if (idx === -1) {
            time++;
            continue;
        }

        if (p[idx].start === undefined)
            p[idx].start = time;

        if (
            gantt.length > 0 &&
            gantt[gantt.length - 1].process === p[idx].id
        ) {

            gantt[gantt.length - 1].end++;

        } else {

            gantt.push({
                process: p[idx].id,
                start: time,
                end: time + 1
            });

        }

        remaining[idx]--;

        time++;

        if (remaining[idx] === 0) {

            p[idx].completion = time;

            completed++;

        }
    }

    let result = calculateAverage(p);

    result.gantt = gantt;

    return result;
}

/* ======================= ROUND ROBIN ======================= */

function rr(processes) {

    let p = clone(processes);

    let quantum = parseInt(document.getElementById("quantum").value);

    if (isNaN(quantum) || quantum <= 0) {
        alert("Enter valid Time Quantum");
        return null;
    }

    p.sort((a, b) => {

        if (a.arrival !== b.arrival)
            return a.arrival - b.arrival;

        return parseInt(a.id.substring(1)) -
               parseInt(b.id.substring(1));
    });

    let n = p.length;

    let remaining = p.map(x => x.burst);

    let queue = [];

    let visited = Array(n).fill(false);

    let completed = 0;

    let time = p[0].arrival;

    let gantt = [];

    queue.push(0);
    visited[0] = true;

    while (completed < n) {

        if (queue.length === 0) {

            let next = -1;

            for (let i = 0; i < n; i++) {

                if (!visited[i]) {
                    next = i;
                    break;
                }
            }

            if (next !== -1) {

                time = Math.max(time, p[next].arrival);

                queue.push(next);

                visited[next] = true;
            }

            continue;
        }

        let i = queue.shift();

        if (p[i].start === undefined)
            p[i].start = time;

        let exec = Math.min(quantum, remaining[i]);

        gantt.push({
            process: p[i].id,
            start: time,
            end: time + exec
        });

        remaining[i] -= exec;

        time += exec;

        for (let j = 0; j < n; j++) {

            if (
                !visited[j] &&
                p[j].arrival <= time
            ) {
                queue.push(j);
                visited[j] = true;
            }
        }

        if (remaining[i] > 0) {

            queue.push(i);

        } else {

            p[i].completion = time;

            completed++;
        }
    }

    let result = calculateAverage(p);

    result.gantt = gantt;

    return result;
}
/* ======================= GANTT CHART ======================= */

  /* ======================= GANTT CHART ======================= */

function drawGantt(ganttData) {

    let gantt = document.getElementById("gantt");

    gantt.innerHTML = "";

    if (ganttData.length === 0)
        return;

    let scale = 40;   // 40px per unit time

    for (let block of ganttData) {

        let div = document.createElement("div");

        div.className = "box";

        div.style.width = ((block.end - block.start) * scale) + "px";

        div.innerHTML = `
            <div style="font-weight:bold;">
                ${block.process}
            </div>

            <div style="
                display:flex;
                justify-content:space-between;
                margin-top:8px;
                font-size:13px;
            ">
                <span>${block.start}</span>
                <span>${block.end}</span>
            </div>
        `;

        gantt.appendChild(div);
    }
}


/* ======================= RESULT TABLE ======================= */

function showTable(processes) {

    let html = `
    <table>
        <tr>
            <th>Process</th>
            <th>AT</th>
            <th>BT</th>
            <th>CT</th>
            <th>TAT</th>
            <th>WT</th>
        </tr>
    `;

    processes.sort((a, b) =>
        parseInt(a.id.substring(1)) -
        parseInt(b.id.substring(1))
    );

    for (let p of processes) {

        html += `
        <tr>
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.completion}</td>
            <td>${p.turnaround}</td>
            <td>${p.waiting}</td>
        </tr>
        `;
    }

    html += "</table>";

    document.getElementById("resultTable").innerHTML = html;
}


/* ======================= MAIN CALCULATE ======================= */

function calculate() {

    let algo = document.getElementById("algorithm").value;

    let processes = getProcesses();

    if (processes.length === 0)
        return;

    let result = null;

    switch(algo){

case "fcfs":
    result=fcfs(processes);
    break;

case "sjf":
    result=sjf(processes);
    break;

case "sjfp":
    result=sjfPreemptive(processes);
    break;

case "priority":
    result=priorityScheduling(processes);
    break;

case "priorityp":
    result=priorityPreemptive(processes);
    break;

case "rr":
    result=rr(processes);
    break;

}
        


    if (!result)
        return;

    drawGantt(result.gantt);

    showTable(result.processes);

    document.getElementById("result").innerHTML = `
        <h3>
        Average Waiting Time : ${result.avgWT.toFixed(2)} <br>
        Average Turnaround Time : ${result.avgTAT.toFixed(2)}
        </h3>
    `;
}


/* ======================= COMPARE ALL ======================= */

/* ======================= COMPARE ALL ======================= */

function compareAll() {

    let processes = getProcesses();

    if (processes.length === 0)
        return;

    let fc = fcfs(processes);

    let sj = sjf(processes);

    let sjp = sjfPreemptive(processes);

    let pr = priorityScheduling(processes);

    let prp = priorityPreemptive(processes);

    let rrResult = rr(processes);

    if (!rrResult) return;

    document.getElementById("comparison").innerHTML = `

        <div class="card">
            <h4>FCFS</h4>
            <p>Average WT : ${fc.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${fc.avgTAT.toFixed(2)}</p>
        </div>

        <div class="card">
            <h4>SJF (Non-Preemptive)</h4>
            <p>Average WT : ${sj.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${sj.avgTAT.toFixed(2)}</p>
        </div>

        <div class="card">
            <h4>SJF (Preemptive)</h4>
            <p>Average WT : ${sjp.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${sjp.avgTAT.toFixed(2)}</p>
        </div>

        <div class="card">
            <h4>Priority (Non-Preemptive)</h4>
            <p>Average WT : ${pr.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${pr.avgTAT.toFixed(2)}</p>
        </div>

        <div class="card">
            <h4>Priority (Preemptive)</h4>
            <p>Average WT : ${prp.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${prp.avgTAT.toFixed(2)}</p>
        </div>

        <div class="card">
            <h4>Round Robin</h4>
            <p>Average WT : ${rrResult.avgWT.toFixed(2)}</p>
            <p>Average TAT : ${rrResult.avgTAT.toFixed(2)}</p>
        </div>

    `;
}