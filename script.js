document.addEventListener('DOMContentLoaded', () => {
    const processForm = document.getElementById('process-form');
    const algoSelect = document.getElementById('algo-select');
    const priorityField = document.getElementById('priority-field');
    const inputTbody = document.getElementById('input-tbody');
    const resultTbody = document.getElementById('result-tbody');
    const ganttChart = document.getElementById('gantt-chart');
    const simulateBtn = document.getElementById('simulate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const theoryNote = document.getElementById('theory-note');
    const visualizationSection = document.getElementById('visualization-section');
    const avgWaitingEl = document.getElementById('avg-waiting-time');
    const avgTurnaroundEl = document.getElementById('avg-turnaround-time');

    const sampleBtn = document.getElementById('sample-btn');

    let processes = [];
    let processCount = 0;

    // Sample Data
    sampleBtn.addEventListener('click', () => {
        processes = [
            { pid: 'P1', arrival: 0, burst: 5, priority: 3, id: 101 },
            { pid: 'P2', arrival: 2, burst: 3, priority: 1, id: 102 },
            { pid: 'P3', arrival: 4, burst: 1, priority: 2, id: 103 }
        ];
        processCount = 3;
        renderInputTable();
    });

    // Toggle priority field visibility
    algoSelect.addEventListener('change', () => {
        const isPriority = algoSelect.value === 'Priority';
        priorityField.style.display = isPriority ? 'flex' : 'none';

        // Show/hide priority column in tables
        document.querySelectorAll('.priority-col').forEach(el => {
            el.style.display = isPriority ? 'table-cell' : 'none';
        });

        updateTheoryNote();
    });

    const updateTheoryNote = () => {
        const algo = algoSelect.value;
        let note = "";
        if (algo === 'FCFS') {
            note = "<strong>FCFS:</strong> Processes are executed in the exact order they arrive. Simple, but can lead to the 'Convoy Effect'.";
        } else if (algo === 'SJF') {
            note = "<strong>SJF:</strong> Shortest Job First selects the process with the smallest burst time. It minimizes average waiting time.";
        } else if (algo === 'Priority') {
            note = "<strong>Priority Scheduling:</strong> Processes with higher priority (lower number) are executed earlier. <em>Note: This may increase waiting time for lower-priority processes, leading to starvation.</em>";
        }
        theoryNote.innerHTML = note;
    };

    updateTheoryNote();

    // Add process
    processForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const arrival = parseInt(document.getElementById('arrival-time').value);
        const burst = parseInt(document.getElementById('burst-time').value);
        const priority = parseInt(document.getElementById('priority').value) || 1;

        if (isNaN(arrival) || isNaN(burst)) return;

        processCount++;
        const pid = `P${processCount}`;

        const process = {
            pid,
            arrival,
            burst,
            priority,
            id: Date.now()
        };

        processes.push(process);
        renderInputTable();
        processForm.reset();
        document.getElementById('arrival-time').focus();
    });

    const renderInputTable = () => {
        inputTbody.innerHTML = '';
        processes.forEach((p, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.pid}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td class="priority-col" style="display: ${algoSelect.value === 'Priority' ? 'table-cell' : 'none'}">${p.priority}</td>
                <td>
                    <button class="btn danger-btn" style="padding: 5px 12px; font-size: 0.8rem;" onclick="removeProcess(${p.id})">Delete</button>
                </td>
            `;
            inputTbody.appendChild(tr);
        });
    };

    window.removeProcess = (id) => {
        processes = processes.filter(p => p.id !== id);
        renderInputTable();
    };

    resetBtn.addEventListener('click', () => {
        processes = [];
        processCount = 0;
        renderInputTable();
        visualizationSection.style.display = 'none';
        ganttChart.innerHTML = '';
        resultTbody.innerHTML = '';
    });

    simulateBtn.addEventListener('click', () => {
        if (processes.length === 0) {
            alert("Please add at least one process.");
            return;
        }

        const algo = algoSelect.value;
        let results = [];

        if (algo === 'FCFS') {
            results = solveFCFS([...processes]);
        } else if (algo === 'SJF') {
            results = solveSJF([...processes]);
        } else if (algo === 'Priority') {
            results = solvePriority([...processes]);
        }

        displayResults(results);
    });

    // Scheduling Logic
    function solveFCFS(proc) {
        // Sort by arrival
        proc.sort((a, b) => a.arrival - b.arrival);

        let currentTime = 0;
        const timeline = [];
        const finished = [];

        proc.forEach(p => {
            if (currentTime < p.arrival) {
                timeline.push({ pid: 'IDLE', start: currentTime, end: p.arrival });
                currentTime = p.arrival;
            }

            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;

            const turnaround = end - p.arrival;
            const waiting = turnaround - p.burst;

            finished.push({
                ...p,
                completion: end,
                turnaround,
                waiting
            });

            timeline.push({ pid: p.pid, start, end });
        });

        return { finished, timeline };
    }

    function solveSJF(proc) {
        let currentTime = 0;
        const timeline = [];
        const finished = [];
        let readyQueue = [];
        let remaining = [...proc];

        while (remaining.length > 0 || readyQueue.length > 0) {
            // Add arrived processes to ready queue
            const arrived = remaining.filter(p => p.arrival <= currentTime);
            readyQueue.push(...arrived);
            remaining = remaining.filter(p => p.arrival > currentTime);

            if (readyQueue.length === 0) {
                // If nothing arrived, move time to next arrival
                const nextArrival = Math.min(...remaining.map(p => p.arrival));
                timeline.push({ pid: 'IDLE', start: currentTime, end: nextArrival });
                currentTime = nextArrival;
                continue;
            }

            // Pick shortest burst
            readyQueue.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
            const p = readyQueue.shift();

            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;

            const turnaround = end - p.arrival;
            const waiting = turnaround - p.burst;

            finished.push({
                ...p,
                completion: end,
                turnaround,
                waiting
            });

            timeline.push({ pid: p.pid, start, end });
        }

        return { finished, timeline };
    }

    function solvePriority(proc) {
        let currentTime = 0;
        const timeline = [];
        const finished = [];
        let readyQueue = [];
        let remaining = [...proc];

        while (remaining.length > 0 || readyQueue.length > 0) {
            const arrived = remaining.filter(p => p.arrival <= currentTime);
            readyQueue.push(...arrived);
            remaining = remaining.filter(p => p.arrival > currentTime);

            if (readyQueue.length === 0) {
                const nextArrival = Math.min(...remaining.map(p => p.arrival));
                timeline.push({ pid: 'IDLE', start: currentTime, end: nextArrival });
                currentTime = nextArrival;
                continue;
            }

            // Pick highest priority (lowest number), then arrival as tie-breaker
            readyQueue.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
            const p = readyQueue.shift();

            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;

            const turnaround = end - p.arrival;
            const waiting = turnaround - p.burst;

            finished.push({
                ...p,
                completion: end,
                turnaround,
                waiting
            });

            timeline.push({ pid: p.pid, start, end });
        }

        return { finished, timeline };
    }

    function displayResults({ finished, timeline }) {
        visualizationSection.style.display = 'block';

        // Render Table
        resultTbody.innerHTML = '';
        let totalWaiting = 0;
        let totalTurnaround = 0;

        // Sort by PID for consistent table display
        const sortedResults = [...finished].sort((a, b) => {
            const numA = parseInt(a.pid.slice(1));
            const numB = parseInt(b.pid.slice(1));
            return numA - numB;
        });

        sortedResults.forEach(p => {
            totalWaiting += p.waiting;
            totalTurnaround += p.turnaround;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.pid}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td class="priority-col" style="display: ${algoSelect.value === 'Priority' ? 'table-cell' : 'none'}">${p.priority}</td>
                <td>${p.completion}</td>
                <td>${p.turnaround}</td>
                <td>${p.waiting}</td>
            `;
            resultTbody.appendChild(tr);
        });

        avgWaitingEl.innerText = (totalWaiting / finished.length).toFixed(2);
        avgTurnaroundEl.innerText = (totalTurnaround / finished.length).toFixed(2);

        // Render Gantt Chart
        ganttChart.innerHTML = '';
        const totalTime = timeline[timeline.length - 1].end;

        timeline.forEach((block, index) => {
            const div = document.createElement('div');
            const duration = block.end - block.start;
            const widthPercentage = (duration / totalTime) * 100;

            div.className = `gantt-block ${block.pid === 'IDLE' ? 'idle' : ''}`;
            div.style.width = `calc(${widthPercentage}% - 2px)`;
            div.style.flexBasis = `calc(${widthPercentage}% - 2px)`;
            div.style.minWidth = `${duration * 20}px`; // Scale factor for readability
            div.style.animationDelay = `${index * 0.1}s`;

            div.innerHTML = `
                <span class="pid">${block.pid}</span>
                <span class="time-start">${block.start}</span>
                <span class="time-end">${block.end}</span>
            `;

            ganttChart.appendChild(div);
        });

        // Analysis Note
        const analysisEl = document.getElementById('simulation-analysis');
        analysisEl.style.display = 'block';
        if (algoSelect.value === 'Priority') {
            analysisEl.innerHTML = "<strong>Priority Analysis:</strong> Processes with higher priority are executed earlier, which may increase the waiting time of lower-priority processes, leading to possible starvation.";
        } else if (algoSelect.value === 'SJF') {
            analysisEl.innerHTML = "<strong>SJF Analysis:</strong> Shortest Job First selects processes with the minimal burst time first, which generally results in the lowest average waiting time among non-preemptive algorithms.";
        } else {
            analysisEl.innerHTML = "<strong>FCFS Analysis:</strong> First Come First Serve is predictable and fair in terms of arrival, but vulnerable to the convoy effect where long processes block shorter ones.";
        }

        // Scroll into view
        visualizationSection.scrollIntoView({ behavior: 'smooth' });
    }
});
