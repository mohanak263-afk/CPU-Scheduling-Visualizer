# CPU Scheduling Visualizer

A web-based CPU Scheduling Visualizer developed using **HTML, CSS, and JavaScript**. This application simulates popular CPU scheduling algorithms used in Operating Systems, generates a Gantt Chart, calculates scheduling metrics, and compares algorithm performance.

## Features

- First Come First Serve (FCFS)
- Shortest Job First (SJF - Non-Preemptive)
- Shortest Remaining Time First (SJF - Preemptive)
- Priority Scheduling (Non-Preemptive)
- Priority Scheduling (Preemptive)
- Round Robin Scheduling
- Dynamic Process Input
- Gantt Chart Visualization
- Completion Time (CT) Calculation
- Turnaround Time (TAT) Calculation
- Waiting Time (WT) Calculation
- Average Waiting Time
- Average Turnaround Time
- Algorithm Comparison

## Technologies Used

- HTML5
- CSS3
- JavaScript

## Project Structure

```
CPU-Scheduling-Visualizer/
│── index.html
│── style.css
│── script.js
│── README.md
```

## Supported Algorithms

| Algorithm | Type |
|-----------|------|
| FCFS | Non-Preemptive |
| SJF | Non-Preemptive |
| SJF (SRTF) | Preemptive |
| Priority Scheduling | Non-Preemptive |
| Priority Scheduling | Preemptive |
| Round Robin | Time Quantum Based |

## Input Parameters

Each process requires:

- Arrival Time
- Burst Time
- Priority

Round Robin additionally requires:

- Time Quantum

## Output

The simulator displays:

- Gantt Chart
- Completion Time (CT)
- Turnaround Time (TAT)
- Waiting Time (WT)
- Average Waiting Time
- Average Turnaround Time

## How to Run

1. Clone the repository

```bash
git clone https://github.com/mohanak263-afk/CPU-Scheduling-Visualizer.git
```

2. Open the project folder.

3. Open `index.html` in any modern web browser.

No additional software or server setup is required.


## Learning Outcomes

This project helped in understanding:

- CPU Scheduling Algorithms
- Operating System Concepts
- JavaScript DOM Manipulation
- Dynamic Table Generation
- Gantt Chart Visualization
- Algorithm Performance Analysis
- Frontend Development using HTML, CSS, and JavaScript


## License

This project is developed for educational and learning purposes.
