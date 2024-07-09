<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Middleware\TechAuthorization;
use App\Http\Middleware\UserAuthorization;
use App\Http\Controllers\RequestController;
use App\Http\Middleware\AdminAuthorization;
use App\Http\Middleware\TechAdminMiddleware;
use App\Http\Controllers\TechnicalController;

// Logs out the current user
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

// Group routes that require authentication for user role
Route::middleware([UserAuthorization::class])->group(function () {
    // Adds a file to a request
    Route::post('add_file', [RequestController::class, 'add_file']);
    // Adds a new request
    Route::post('add-request', [RequestController::class, 'add_request']);
    Route::get("/user/pending-ticket", [RequestController::class, "getTicketByUser"]);
    // Bumps the update date of a ticket
    Route::post('follow-up', function (Request $request) {
        DB::table('ticketing_main')
            ->where('ticket_client', Auth::user()->emp_no)
            ->where('ticket_cde', $request->ticket_cde)
            ->update(['ticket_update_date' => now()]);
        return response()->json(["Message" => "Bumped!"], 200);
    });
    Route::get('ticket', [TicketController::class, 'getTicketType']);
});

Route::middleware([AdminAuthorization::class])->group(function () {
    // Retrieves pending tickets and allows filtering by type or search
    Route::get('pending-ticket', [RequestController::class, 'getPendingTicket']);
    Route::get('spec_ticket_type/{type}', [TicketController::class, 'getSpecificTicketType']);
    Route::post('assign_request/{id}', [RequestController::class, 'assign_request']);
});

Route::middleware([TechAuthorization::class])->group(function () {
    Route::get("/tech/pending-ticket", [RequestController::class, "getTicketByTechnical"]);
});
Route::middleware([TechAdminMiddleware::class])->group(function () {
       // Retrieves images, videos, and documents associated with a ticket
       Route::get('getEmployeeJobs', [TicketController::class, 'getEmployeeJobs']);
       // Retrieves attachment details
       Route::get('getAttachment', [TicketController::class, 'getAttachment']);

     
   
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('get_user', [RequestController::class, 'getUserName']);

    Route::get('/pending-ticket/{type}', [RequestController::class, 'filterPendingTicket']);
    Route::get('/pending-ticket/search/{search}', [RequestController::class, 'filteredBySearch']);
   
    Route::get('get_images/{ticket_cde}', [RequestController::class, 'getImagesByTicketCode']);
    Route::get('get_videos/{ticket_cde}', [RequestController::class, 'getVideosByTicketCode']);
    Route::get('get_documents/{ticket_cde}', [RequestController::class, 'getDocumentsByTicketCode']);
});

// User registration and authentication routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/verify-otp', [UserController::class, 'verifyOTP']);
Route::post('/login', [UserController::class, 'userLogin']);
Route::post('/send-otp', [UserController::class, 'sendOTP']);

// Technical staff routes for updating and accepting requests
Route::post('/techUpdate', [TechnicalController::class, 'updateTechnical']);
Route::post('/acceptRequest', [TechnicalController::class, 'acceptRequest']);
Route::post('/denyRequest', [TechnicalController::class, 'denyRequest']);
Route::post('/acceptOngoingRequest', [TechnicalController::class, 'acceptOngoingRequest']);
Route::post('/denyOngoingRequest', [TechnicalController::class, 'denyOngoingRequest']);
Route::get('/techShow/{id}', [TechnicalController::class, 'show']);
