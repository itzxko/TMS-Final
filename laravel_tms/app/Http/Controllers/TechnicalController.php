<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TechnicalController extends Controller
{
    use HttpResponses;

    // Show the ticket
    public function show()
    {
        // Fetch the ticket
        $ticket = DB::table('ticketing_main')->where('ticket_office_cde', Auth::user()->office_code)->where('ticket_assigned_to_name', Auth::user()->username)->get();  // Use first() instead of get() if you're expecting a single record
        if ($ticket) {
            return $this->success($ticket);  // Ensure proper JSON structure
        } else {
            return $this->error('Ticket not found', 404);
        }
    }

    // Update the ticket
    public function updateTechnical(Request $request)
    {
        // Validate the request
        $request->validate([
            'ticket_desc_findings' => 'nullable|string|max:255',
            'ticket_desc_remarks' => 'nullable|string|max:255',
            'ticket_desc_replacement' => 'nullable|string|max:255',
        ]);

        // Perform an update directly
        DB::table('ticketing_main')->where('id', $request->id)->update([
            'ticket_desc_findings' => $request->ticket_desc_findings,
            'ticket_desc_remarks' => $request->ticket_desc_remarks,
            'ticket_desc_replacement' => $request->ticket_desc_replacement,
            'ticket_status' => 4,
            'ticket_update_date' => now()
        ]);

        return $this->success(['message' => 'Updated successfully']);
    }

    // Accept the request
    public function acceptRequest(Request $request)
    {
        // Perform an update directly
        DB::table('ticketing_main')->where('ticket_cde', $request->ticket_cde)->update([
            'ticket_status' => 5,
            'ticket_update_date' => now()
        ]);

        return $this->success(['message' => 'Request accepted']);
    }
    // Deny the request
    public function denyRequest(Request $request)
    {
        // Perform an update directly
        DB::table('ticketing_main')->where('ticket_cde', $request->ticket_cde)->update([
            'ticket_status' => 3,
            'ticket_update_date' => now()
        ]);

        return $this->success(['message' => 'Request accepted']);
    }

    // Accept the ongoing request
    public function acceptOngoingRequest(Request $request)
    {
        // Perform an update directly
        DB::table('ticketing_main')->where('ticket_cde', $request->ticket_cde)->update([
            'ticket_status' => 3,
            'ticket_update_date' => now()
        ]);

        return $this->success(['message' => 'Request accepted']);
    }

    // Deny the ongoing request
    public function denyOngoingRequest(Request $request)
    {
        // Perform an update directly
        DB::table('ticketing_main')->where('ticket_cde', $request->ticket_cde)->update([
            'ticket_status' => 1,
            'ticket_office_cde' => '',
            'ticket_assigned_to_name' => '',
            'ticket_accepted_by' => '',
            'ticket_assigned_to_id' => '',
            'ticket_update_date' => now()
        ]);

        return $this->success(['message' => 'Request accepted']);
    }
}
