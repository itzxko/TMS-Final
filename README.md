# TICKETING MANAGEMENT SYSTEM

Overview:


The Ticketing Management System is a web-based application designed to streamline the process of managing tickets, requests, and inquiries from customers or users. It provides a centralized platform for ticket creation, assignment, tracking, and resolution, thereby enhancing communication and collaboration within the organization.

## FEATURES
- Ticket Creation: Users can create new tickets by providing details such as issue description, priority, category, etc.
- Ticket Assignment: Tickets can be assigned by Admin to a specific individuals or technical employee responsible for resolving them.
- Ticket Tracking: Users can track the status and progress of their tickets from creation to resolution.

## TECHNOLOGIES USED
- FRONTEND: `HTML`, `TAILWINDCSS`, `REACT.JS`, `JAVASCRIPT`
- BACKEND: `PHP`, `LARAVEL`

## INSTALLATION
1. Clone the repository:
   ```git
   git clone https://github.com/itzxko/TMS-Final
   ```
2. Run or Start `XAMPP` or `Herd`
3. Open the link given in the FRONTEND usually `http://localhost:5173/`

### ***FRONTEND INSTALLATION*** 
   1. Navigate to project directory
      ```bash
      cd TMS-Final/react_tms
      ```
   2. Install necessary dependencies:
      ```bash
      npm install --legacy-peer-deps
      ```
   3. To start the frontend run
      ```bash
      npm run dev
      ```
### ***BACKEND INSTALLATION***
   1. Navigate to project directory:
      ```bash
      cd TMS-Final/laravel_tms
      ```
   2. Install the composer:
      ```bash
      composer install
      ```
   3. Set up environment variables: Create a `.env` file then copy the code from the `.env.example` and configure necessary variables needed.
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
   7. Setup the Database using
      ```bash
      php artisan migrate
      ```
   8. To start the backend  using
      ```bash
      php artisan serve
      ```
