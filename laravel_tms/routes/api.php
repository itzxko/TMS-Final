<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TechnicalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

// Logs out the current user
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

// Group routes that require authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // Retrieves images, videos, and documents associated with a ticket
    Route::get('get_images/{ticket_cde}', [RequestController::class, 'getImagesByTicketCode']);
    Route::get('get_videos/{ticket_cde}', [RequestController::class, 'getVideosByTicketCode']);
    Route::get('get_documents/{ticket_cde}', [RequestController::class, 'getDocumentsByTicketCode']);

    // Ticket related routes
    Route::get('ticket', [TicketController::class, 'getTicketType']);
    Route::get('getEmployeeJobs', [TicketController::class, 'getEmployeeJobs']);

    // Adds a file to a request
    Route::post('add_file', [RequestController::class, 'add_file']);

    // Retrieves attachment details
    Route::get('getAttachment', [TicketController::class, 'getAttachment']);

    // Adds a new request
    Route::post('add-request', [RequestController::class, 'add_request']);

    // Assigns a request to a user
    Route::post('assign_request/{id}', [RequestController::class, 'assign_request']);

    // Retrieves the name of the current user
    Route::get('get_user', [RequestController::class, 'getUserName']);

    // Retrieves pending tickets for the logged-in user
    Route::get('pending-ticket', function (Request $request) {
        $ticket = DB::table('ticketing_main')->where('ticket_client', Auth::user()->emp_no)->orderBy("ticket_update_date", "desc")->get();
        return response()->json(["Message" => $ticket, "role" => Auth::user()->role], 200);
    });

    // Retrieves pending tickets and allows filtering by type or search
    Route::get('pending-ticket', [RequestController::class, 'getPendingTicket']);
    Route::get('/pending-ticket/{type}', [RequestController::class, 'filterPendingTicket']);
    Route::get('/pending-ticket/search/{search}', [RequestController::class, 'filteredBySearch']);

    // Bumps the update date of a ticket
    Route::post('follow-up', function (Request $request) {
        DB::table('ticketing_main')
            ->where('ticket_client', Auth::user()->emp_no)
            ->where('ticket_cde', $request->ticket_cde)
            ->update(['ticket_update_date' => now()]);
        return response()->json(["Message" => "Bumped!"], 200);
    });

    // Routes for different roles to view pending tickets
    Route::get("/user/pending-ticket", [RequestController::class, "getTicketByUser"]);
    Route::get("/admin/pending-ticket", [RequestController::class, "getTicketByAdmin"]);
    Route::get("/tech/pending-ticket", [RequestController::class, "getTicketByTechnical"]);

    // Retrieves tickets of a specific type
    Route::get('spec_ticket_type/{type}', [TicketController::class, 'getSpecificTicketType']);
});

// User registration and authentication routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/verify-otp', [UserController::class, 'verifyOTP']);
Route::post('/login', [UserController::class, 'userLogin']);
Route::post('/send-otp', [UserController::class, 'sendOTP']);

// Technical staff routes for updating and accepting requests
Route::post('/techUpdate', [TechnicalController::class, 'updateTechnical']);
Route::post('/acceptRequest', [TechnicalController::class, 'acceptRequest']);
Route::get('/techShow/{id}', [TechnicalController::class, 'show']);
