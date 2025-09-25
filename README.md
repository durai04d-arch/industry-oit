# Industrial-eco-system - Real-Time Monitoring & Safety Platform


A comprehensive Industrial Internet of Things (IIoT) ecosystem designed for real-time monitoring, predictive maintenance, and automated safety alerts. This platform leverages edge computing for instant decision-making and a modern serverless backend for scalable data storage and visualization.

---

## ✨ Key Features

* **Real-Time Sensor Monitoring:** Live dashboard to visualize data from Temperature, Gas, Ultrasonic, and RFID sensors.
* **Edge Processing & Instant Alerts:** The ESP32 processes data locally, comparing it against industry-specific safety thresholds to provide instant alerts on an OLED display and via the backend.
* **Multi-Industry Safety Profiles:** Easily configurable safety thresholds for various industries (Chemical, Food, Pharmacy, etc.) as defined in the project's core logic.
* **Serverless Backend:** Built on [Supabase](https://supabase.com/) for scalable, real-time data storage, and easy data access.
* **RFID Access Control:** Uses an RFID module to log and control access, with events sent to the backend.
* **Modern & Responsive UI:** A clean and intuitive dashboard built with React to visualize data and system status.

---



## 🛠️ Technology Stack

This project is divided into three main parts: Firmware, Backend, and Frontend.

| Category      | Technology                                                                          | Description                                         |
| :------------ | :---------------------------------------------------------------------------------- | :-------------------------------------------------- |
| **Hardware** | `ESP32`                                                                             | The core microcontroller for edge processing.       |
|               | `Gas Sensor`, `Temperature Sensor`, `RFID Reader`, `Ultrasonic Sensor`, `OLED Display` | The suite of sensors and local display.             |
| **Firmware** | `Arduino C++`                                                                       | The code running on the ESP32.                      |
| **Backend** | `Supabase`                                                                          | Handles database storage, and real-time data APIs.  |
| **Frontend** | `React`                                                                             | A JavaScript library for building the user interface. |
|               | `Tailwind CSS` / `CSS`                                                              | For styling the dashboard.                          |
|               | `Supabase-js`                                                                       | Official client library to connect to Supabase.     |

---

## ⚙️ System Architecture

The data flows through the system in a simple, robust pattern:

1.  **Capture & Process:** The **ESP32** reads data from all connected sensors. It immediately compares these readings to the safety thresholds stored in its memory (Edge Processing).
2.  **Act Locally:** Based on the data, the ESP32 displays status information or critical alerts on the **OLED Display**.
3.  **Store & Stream:** The ESP32 sends the sensor data and any event logs (like RFID scans or alerts) directly to the **Supabase** database using its REST API.
4.  **Visualize:** The **React Frontend** connects to Supabase, subscribes to real-time updates from the database, and visualizes the data on the dashboard.

---


📜 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
