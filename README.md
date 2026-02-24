# CPU Scheduling Visualizer

An interactive web-based tool designed to simulate and visualize various **CPU Scheduling Algorithms**. This project serves as a practical implementation of Operating System concepts, providing real-time calculations and Gantt chart visualizations for process execution.

---

## 🚀 Features

* **Interactive Gantt Chart:** Real-time visualization of how processes occupy the CPU over time.
* **Multiple Algorithm Support:**
    * **FCFS** (First-Come, First-Served)
    * **SJF** (Shortest Job First - Non-preemptive)
    * **SRTF** (Shortest Remaining Time First - Preemptive)
    * **Round Robin** (Time Quantum based)
    * **Priority** (Preemptive & Non-Preemptive)
* **Automated Analytics:** Instant calculation of Arrival Time, Burst Time, Completion Time, Turnaround Time (TAT), and Waiting Time (WT).
* **Clean UI:** Built with a focus on usability and clear data representation.

---

## 📊 Performance Metrics

The visualizer generates a detailed result table. Below is an example of the data format handled by the application:

<table>
  <thead>
    <tr>
      <th>Process ID</th>
      <th>Arrival Time</th>
      <th>Burst Time</th>
      <th>Exit Time</th>
      <th>Turnaround Time</th>
      <th>Waiting Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>P1</td>
      <td>0</td>
      <td>5</td>
      <td>5</td>
      <td>5</td>
      <td>0</td>
    </tr>
    <tr>
      <td>P2</td>
      <td>1</td>
      <td>3</td>
      <td>8</td>
      <td>7</td>
      <td>4</td>
    </tr>
    <tr>
      <td>P3</td>
      <td>2</td>
      <td>1</td>
      <td>9</td>
      <td>7</td>
      <td>6</td>
    </tr>
  </tbody>
</table>

---

## 🛠️ Tech Stack

* **HTML5 / CSS3:** Structure and responsive styling.
* **JavaScript (ES6+):** Core logic for scheduling algorithms and DOM manipulation.
* **Google Fonts:** For clean typography.

---

## 💻 How to Run

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/geo-cherian-mathew-2k28/CPU-Scheduling-Visualizer.git
    ```
2.  **Open the Project:**
    Navigate to the folder and open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3.  **Simulate:**
    Enter your process details, select an algorithm, and hit the visualize button.

---

## 📂 Project Structure

* `index.html` - The main entry point and UI layout.
* `style.css` - Custom styling for the dashboard and Gantt charts.
* `script.js` - Logic for process sorting and algorithm execution.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
**Developed by [Geo Cherian Mathew](https://github.com/geo-cherian-mathew-2k28)**
