TECH STACK DOCUMENT
Laptop-Based Medicine Adherence Assistant
1.  Overview

The system is built using a software-centric IoT stack that leverages computer vision, speech processing, and network communication. The stack is optimized to run locally on a laptop, minimizing hardware dependency while maintaining intelligent functionality.

2. Tech Stack Breakdown
2.1 Programming Language
Python 3.x
Chosen for rapid development, extensive libraries, and strong support for AI/ML and IoT applications
2.2 Computer Vision Stack (Pill Detection)
6
OpenCV
Image capture from webcam
Preprocessing (grayscale, thresholding)
Contour detection for pill identification
2.3 Speech Processing Stack (Voice Acknowledgment)
6
SpeechRecognition
Converts user voice to text
OpenAI Whisper (optional, more accurate)
Handles noisy environments and accents
2.4 Text-to-Speech (Reminder System)
gTTS
Converts reminders into audio
pyttsx3
Works without internet
2.5 Backend / Application Layer
Flask (optional)
Lightweight backend
Dashboard / API endpoints
2.6 Networking & Communication
Wi-Fi (built-in laptop)
Used for sending caregiver alerts
Protocols:
HTTP (API calls)
SMTP (email alerts)
2.7 Notification Services
Email (SMTP)
SMS (via APIs like Twilio – optional)
2.8 Data Storage
Local Storage
JSON / CSV files for logs
Optional:
SQLite (lightweight database)
2.9 Development Environment
Visual Studio Code
Code editing and debugging
Git
Version tracking
GitHub
Repository management
3.  Hardware Stack
Laptop (Core system)
Webcam (Camera input)
Microphone (Voice input)
Speaker (Audio output)
Internet connection
4.  Supporting Libraries
opencv-python
speechrecognition
pyaudio
pyttsx3
gtts
flask
requests
numpy
5.  Security Stack
HTTPS for API communication
Basic authentication for caregiver access
Local data protection
6.  Deployment Stack
Local machine execution
Optional cloud integration:
Firebase / AWS (future scope)
7.  Stack Justification
Requirement	Technology Used	Reason
Image Processing	OpenCV	Fast, lightweight
Voice Input	SpeechRecognition / Whisper	Accuracy
Voice Output	gTTS / pyttsx3	Simple + multilingual
Backend	Flask	Lightweight
Storage	JSON / SQLite	Easy to manage
Alerts	SMTP / API	Reliable