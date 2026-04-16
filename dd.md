
#  SYSTEM DESIGN DOCUMENT

## Laptop-Based Medicine Adherence Assistant

---

## 1.  System Overview

The system is a **software-driven IoT healthcare assistant** that runs on a laptop and uses built-in peripherals (camera, microphone, speaker, Wi-Fi) to:

* Remind users to take medication
* Detect pill presence using computer vision
* Accept voice-based confirmation
* Notify caregivers on missed doses
* Compute **missed dose risk score**

This is a **cyber-physical system** combining sensing, processing, and communication.

---

### Layers:

### 2.1 Sensing Layer

* Camera → pill detection
* Microphone → voice input

### 2.2 Processing Layer

* Python-based AI engine
* Image processing + NLP

### 2.3 Application Layer

* Reminder system
* Risk scoring
* Notification system

### 2.4 Communication Layer

* Wi-Fi → caregiver alerts

---

## 3.  Module Design

---

### 3.1 Reminder Engine

**Function:**
Schedules and triggers medication alerts.

**Design:**

* Time-based scheduler (cron-like logic)
* Multilingual TTS output

**Input:** Medication schedule
**Output:** Voice alert via speaker

---

### 3.2 Computer Vision Module

**Function:**
Detects pill strip and verifies intake.

**Tech:**

* OpenCV
* Image thresholding / contour detection

**Logic:**

* Capture frame
* Detect pill region
* Compare before vs after

---

### 3.3 Voice Processing Module

**Function:**
Captures and interprets user confirmation.

**Pipeline:**

1. Audio capture
2. Speech-to-text
3. Intent matching

**Example commands:**

* “I took my medicine”
* “Done”

---

### 3.4 Notification Module

**Function:**
Sends alerts to caregivers.

**Triggers:**

* No response
* Missed dose

**Channels:**

* Email / SMS / App API

---

### 3.5 Risk Scoring Engine (Core Innovation)

**Function:**
Predicts adherence risk.

**Algorithm Design:**

```id="l6r4ay"
Risk Score = (Missed Doses × Weight1) + (Delay Time × Weight2) + (History Factor × Weight3)
```

**Levels:**

* Low → occasional miss
* Medium → repeated delay
* High → consistent non-adherence

---

### Flow:

1. Load medication schedule
2. Trigger reminder
3. Play voice alert
4. Activate camera
5. Wait for user action
6. Capture voice input
7. Verify:

   * If confirmed → success
   * Else → retry / mark missed
8. Update risk score
9. Notify caregiver if needed

---

## 5.  Data Design

### 5.1 Data Entities

| Entity     | Description                 |
| ---------- | --------------------------- |
| User       | Patient details             |
| Medication | Name, dosage, schedule      |
| Log        | Time, status (taken/missed) |
| Risk Score | Calculated adherence risk   |

---

### 5.2 Sample Data Schema

```id="w4vclq"
User(id, name, age)
Medication(id, name, schedule_time)
Log(id, user_id, med_id, status, timestamp)
Risk(user_id, score, level)
```

---

## 6.  Algorithm Design

---

### 6.1 Reminder Algorithm

```id="wbdvds"
if current_time == scheduled_time:
    trigger_reminder()
```

---

### 6.2 Voice Verification

```id="5cys2o"
if "took medicine" in speech_text:
    status = "taken"
else:
    status = "pending"
```

---

### 6.3 Risk Scoring Logic

```id="rl1p3o"
if missed_count >= threshold:
    risk = HIGH
elif delay > limit:
    risk = MEDIUM
else:
    risk = LOW
```

---

## 7.  Technology Stack

| Layer              | Technology                  |
| ------------------ | --------------------------- |
| Programming        | Python                      |
| CV                 | OpenCV                      |
| Speech             | SpeechRecognition / Whisper |
| TTS                | gTTS / pyttsx3              |
| Backend (optional) | Flask                       |
| Notifications      | SMTP / Twilio               |

---

## 8.  Security Design

* Local data storage encryption
* Secure API for alerts
* No unauthorized access to camera/mic
* User consent for monitoring

---

## 9.  Deployment Design

### Local Deployment:

* Runs on laptop
* No external hardware required

### Optional Cloud:

* Store logs
* Enable remote monitoring

---

## 10.  Failure Handling

| Scenario        | Handling                      |
| --------------- | ----------------------------- |
| No voice input  | Retry alert                   |
| Camera failure  | Switch to manual confirmation |
| No internet     | Store alerts locally          |
| Wrong detection | Ask for reconfirmation        |

---

## 11.  Performance Considerations

* Low latency for reminders
* Efficient image processing
* Lightweight model (runs on laptop)

---

## 12.  Scalability Design

* Multi-user support
* Mobile app integration
* Wearable sync

---

## 13.  Testing Strategy

### Unit Testing

* Individual modules

### Integration Testing

* Camera + voice + alerts

### User Testing

* Elderly usability

