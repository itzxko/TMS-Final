<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HttpResponses;

class TicketController extends Controller
{
     use HttpResponses;

     public function getTicketType()
     {
          return response()->json(["Message" => DB::table('ticket_type')->get()]);
     }
     public function getSpecificTicketType($ticket_type)
     {
          $office_code = DB::table('ticket_type')->where("TYPE_DESC", $ticket_type)->first();
          $users = DB::table('users')->where("office_code", $office_code->OFFICE_CDE)->get();
          return response()->json($users);
     }

     public function getEmployeeJobs()
     {
          $names = DB::table('users')
               ->leftJoin('ticketing_main', 'users.username', '=', 'ticketing_main.ticket_assigned_to_name')
               ->select(
                    'users.username',
                    DB::raw('COUNT(ticketing_main.ticket_assigned_to_name) - SUM(CASE WHEN ticketing_main.ticket_status = 5 THEN 1 ELSE 0 END) as job_count')
               )
               ->where('users.role', '=', 'technical')
               ->groupBy('users.username')
               ->get();

          return $this->success($names);
     }
}
