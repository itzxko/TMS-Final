<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TechnicalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('get_images/{ticket_cde}', [RequestController::class, 'getImagesByTicketCode']);
        Route::get('get_videos/{ticket_cde}', [RequestController::class, 'getVideosByTicketCode']);
        Route::get('get_documents/{ticket_cde}', [RequestController::class, 'getDocumentsByTicketCode']);

    Route::get('ticket', [TicketController::class, 'getTicketType']);
    Route::get('getEmployeeJobs', [TicketController::class, 'getEmployeeJobs']);


    Route::post('add_file', [RequestController::class, 'add_file']);

    Route::get('getAttachment', [TicketController::class, 'getAttachment']);


    Route::post('add-request', [RequestController::class, 'add_request']);

    Route::post('assign_request/{id}', [RequestController::class, 'assign_request']);

    Route::get('get_user', [RequestController::class, 'getUserName']);

    // Route::get('get_user', [RequestController::class, 'getUserName']);

    Route::get('pending-ticket', function (Request $request) {
        $ticket = DB::table('ticketing_main')->where('ticket_client', Auth::user()->emp_no)->orderBy("ticket_update_date", "desc")->get();
        return response()->json(["Message" => $ticket, "role" => Auth::user()->role], 200);
    });

    Route::get('pending-ticket', [RequestController::class, 'getPendingTicket']);
    Route::get('/pending-ticket/{type}', [RequestController::class, 'filterPendingTicket']);
    Route::get('/pending-ticket/search/{search}', [RequestController::class, 'filteredBySearch']);
    Route::post('follow-up', function (Request $request) {
        DB::table('ticketing_main')
            ->where('ticket_client', Auth::user()->emp_no)
            ->where('ticket_cde', $request->ticket_cde)
            ->update(['ticket_update_date' => now()]);
        return response()->json(["Message" => "Bumped!"], 200);
    });

    //Ito dinagdag ko
    Route::get("/user/pending-ticket", [RequestController::class, "getTicketByUser"]);
    Route::get("/admin/pending-ticket", [RequestController::class, "getTicketByAdmin"]);
    Route::get("/tech/pending-ticket", [RequestController::class, "getTicketByTechnical"]);
    Route::get('spec_ticket_type/{type}', [TicketController::class, 'getSpecificTicketType']);
   
});
Route::post('/register', [UserController::class, 'register']);
Route::post('/verify-otp', [UserController::class, 'userLogin']);
Route::post('/loginOTP', [UserController::class, 'userLoginWithOtp']);
Route::post('/techUpdate', [TechnicalController::class, 'updateTechnical']);
Route::get('/techShow/{id}', [TechnicalController::class, 'show']);

