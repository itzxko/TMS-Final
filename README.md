# TICKETING MANAGEMENT SYSTEM

Overview
The Ticketing Management System is a web-based application designed to streamline the process of managing tickets, requests, and inquiries from customers or users. It provides a centralized platform for ticket creation, assignment, tracking, and resolution, thereby enhancing communication and collaboration within the organization.

## FEATURES
- Ticket Creation: Users can create new tickets by providing details such as issue description, priority, category, etc.
- Ticket Assignment: Tickets can be assigned by Admin to a specific individuals or technical employee responsible for resolving them.
- Ticket Tracking: Users can track the status and progress of their tickets from creation to resolution.

## TECHNOLOGIES USED
- FRONTEND: `HTML`, `TAILWINDCSS`, `REACT.JS`, `JAVASCRIPT`
- BACKEND: `PHP`, `LARAVEL`
- AUTHENTICATION: `JWT (JSON WEB TOKENS)`

## INSTALLATION
1. Clone the repository:
   ```git
   git clone https://github.com/danedwardm/TMS
   ```
2. Run or Start `XAMPP` or `Herd`
3. Open the link given in the FRONTEND usually `http://localhost:5173/`

### ***FRONTEND INSTALLATION*** 
   1. Navigate to project directory
      ```bash
      cd TMS/react_tms
      ```
   2. Install necessary dependencies:
      ```bash
      npm install
      ```
   3. To start the frontend run
      ```bash
      npm run dev
      ```
### ***BACKEND INSTALLATION***
   1. Navigate to project directory:
      ```bash
      cd TMS/laravel_tms
      ```
   2. Install the composer:
      ```bash
      composer install
      ```
   3. Set up environment variables: Create a `.env` file and configure necessary variables.
   4. Generate app_key:
      ```bash
      php artisan key:generate
      ```
   5. Make local or public file storage using
      ```bash
      php artisan storage:link
      ```
   6. Setup the Laravel Sanctum using
      ```bash
      composer require laravel/sanctum
      ```
   7. To start the backend  using
      ```bash
      php artisan serve
      ```
