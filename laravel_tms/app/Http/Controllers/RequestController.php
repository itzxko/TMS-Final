<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddAttachmentRequest;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\AddUserRequest;
use App\Models\Attachment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class RequestController extends Controller
{

    use HttpResponses;

    public $ticket_code = "";

    public function __construct()
    {
        $this->ticket_code = Str::uuid();
    }

    // Get the username of the authenticated user
    public function getUserName(Request $request)
    {
        try {
            $userName = Auth::user()->username;
            return response()->json(['username' => $userName], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }


    // Get the role of the authenticated user
    public function add_request(AddUserRequest $request)
    {
        $request->validated($request->all());

        DB::beginTransaction(); // Start a database transaction

        // Insert into ticketing_main table
        try {
            $existingTicket = DB::table('ticketing_main')
                ->where('property_no', $request->property_no)
                ->first();

            if ($existingTicket) {
                DB::rollBack(); // Rollback the transaction
                return response()->json(["Message" => "A ticket with the same property no already exists"], 400);
            }

            $ticketCode = $this->ticket_code; // Assuming $this->ticket_code is defined somewhere

            // Insert into ticketing_main table
            $ticketMainInsert = DB::table('ticketing_main')->insert([
                "ticket_client" => Auth::user()->emp_no,
                "ticket_cde" => $ticketCode,
                "ticket_client_name" => $request->ticket_client_name,
                "ticket_client_office_cde" => Auth::user()->office_code,
                "ticket_type" => $request->ticket_type,
                'property_no' => $request->property_no,
                "ticket_if_others" => $request->ticket_if_others ?? null,
                "ticket_desc_concern" => $request->ticket_desc_concern,
                "ticket_update_date" => now(),
                "ticket_status_if_date" => now(),
                "ticket_status" => "1"
            ]);

            // Check if the insert was successful
            if (!$ticketMainInsert) {
                DB::rollBack(); // Rollback the transaction
                return response()->json(["Message" => "Failed to insert ticket information"], 500);
            }

            // Handle file uploads
            $image_names = [];
            $video_names = [];
            $document_names = [];
            $filenames = [];

            // Check if the request has files
            if ($request->hasFile('video')) {
                foreach ($request->file('video') as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    if (!$file->storeAs('public/attachments/videos', $filename)) {
                        DB::rollBack(); // Rollback the transaction
                        return response()->json(["Message" => "Failed to store video file"], 500);
                    }
                    $video_names[] = "attachments/videos/" . $filename;
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    if (!$file->storeAs('public/attachments/documents', $filename)) {
                        DB::rollBack(); // Rollback the transaction
                        return response()->json(["Message" => "Failed to store document file"], 500);
                    }
                    $document_names[] = "attachments/documents/" . $filename;
                }
            }

            if ($request->hasFile('file')) {
                foreach ($request->file('file') as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    if (!$file->storeAs('public/attachments/images', $filename)) {
                        DB::rollBack(); // Rollback the transaction
                        return response()->json(["Message" => "Failed to store image file"], 500);
                    }
                    $image_names[] = "attachments/images/" . $filename;
                }
            }

            // Merge all filenames into one array
            if (!empty($video_names)) {
                $filenames = array_merge($filenames, $video_names);
            }
            if (!empty($document_names)) {
                $filenames = array_merge($filenames, $document_names);
            }
            if (!empty($image_names)) {
                $filenames = array_merge($filenames, $image_names);
            }

            // Insert attachment information into the database
            $attachment = DB::table('ticketing_attachment')->insert([
                "ticket_attachment_id" => substr(Str::uuid(), 1, 20),
                "ticket_cde" =>  $ticketCode,
                "ticket_path" =>  json_encode($filenames),
                "images_path" => json_encode($image_names),
                "videos_path" => json_encode($video_names),
                "documents_path" => json_encode($document_names),
                "ticket_attachment_date" => now()
            ]);

            // Check if the insert was successful
            if ($attachment) {
                DB::commit(); // Commit the transaction
                return response()->json(["Message" => "File uploaded successfully"], 200);
            } else {
                DB::rollBack(); // Rollback the transaction
                return response()->json(["Message" => "Failed to insert attachment information"], 500);
            }
        } catch (\Throwable $th) {
            DB::rollBack(); // Rollback the transaction
            return $this->error(["Message" => $th->getMessage()], "Request Failed", 500);
        }
    }


    public function assign_request(Request $request, $id)
    {
        try {
            // Update the ticket information
            $update = DB::table('ticketing_main')
                ->where('id', $id)
                ->update([
                    'ticket_accepted_by' => Auth::user()->username,
                    'ticket_assigned_to_id' => $request->ticket_assigned_to_id,
                    'ticket_assigned_to_name' => $request->ticket_assigned_to_name,
                    'ticket_office_cde' => $request->ticket_office_code,
                    'ticket_update_date' => now(),
                    'ticket_status' => 2
                ]);

            // Check if the update was successful
            if ($update) {
                return $this->success(["Message" => "Ticket updated successfully"], "Update Success!", 200);
            } else {
                return $this->error(["Message" => "Ticket not found or update failed"], "Update Failed", 404);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getPendingTicket()
    {
        $tickets = DB::table('ticketing_main')
            ->orderBy("ticket_update_date", "desc")
            ->paginate(10);


        $statuses = ["1" => "requested", "2" => "assigned", "3" => "ongoing", "4" => "forChecking", "5" => "done"];
        $counts = [];

        foreach ($statuses as $status => $name) {
            $counts[$name] = DB::table("ticketing_main")
                ->where('ticket_status', '=', $status)
                ->count();
        }

        $requested = $counts["requested"];
        $assigned = $counts["assigned"];
        $ongoing = $counts["ongoing"];
        $forChecking = $counts["forChecking"];
        $done = $counts["done"];

        return response()->json([
            "Message" => $tickets,
            "requested" => $requested,
            "assigned" => $assigned,
            "ongoing" => $ongoing,
            "forChecking" => $forChecking,
            "done" => $done
        ], 200);
    }

    // Get all tickets assigned to the authenticated user
    public function getTicketByTechnical()
    {
        if (Auth::user()->role !== "technical") {
            return $this->success(["Message" => "You are unauthorized!"], "Request Failed", 401);
        }
        $statuses = ["1" => "requested", "2" => "assigned", "3" => "ongoing", "4" => "forChecking", "5" => "done"];
        $counts = [];

        foreach ($statuses as $status => $name) {
            $counts[$name] = DB::table("ticketing_main")
                ->where('ticket_status', '=', $status)
                ->where('ticket_assigned_to_id', Auth::user()->emp_no)
                ->count();
        }

        $requested = $counts["requested"];
        $assigned = $counts["assigned"];
        $ongoing = $counts["ongoing"];
        $forChecking = $counts["forChecking"];
        $done = $counts["done"];

        $tickets = DB::table('ticketing_main')
            ->where("ticket_assigned_to_id", Auth::user()->emp_no)
            ->orderBy("ticket_update_date", "desc")->paginate(10);
        return response()->json([
            "Message" => $tickets,
            "requested" => $requested,
            "assigned" => $assigned,
            "ongoing" => $ongoing,
            "forChecking" => $forChecking,
            "done" => $done
        ], 200);
    }



    public function getTicketByUser()
    {
        if (Auth::user()->role !== "user") {
            return $this->success(["Message" => "You are unauthorized!"], "Request Failed", 401);
        }
        $statuses = ["1" => "requested", "2" => "assigned", "3" => "ongoing", "4" => "forChecking", "5" => "done"];
        $counts = [];

        foreach ($statuses as $status => $name) {
            $counts[$name] = DB::table("ticketing_main")
                ->where('ticket_status', '=', $status)
                ->where('ticket_client', Auth::user()->emp_no)
                ->count();
        }

        $requested = $counts["requested"];
        $assigned = $counts["assigned"];
        $ongoing = $counts["ongoing"];
        $forChecking = $counts["forChecking"];
        $done = $counts["done"];

        $tickets = DB::table('ticketing_main')
            ->where("ticket_client", Auth::user()->emp_no)
            ->orderBy("ticket_update_date", "desc")->paginate(10);
        return response()->json([
            "Message" => $tickets,
            "requested" => $requested,
            "assigned" => $assigned,
            "ongoing" => $ongoing,
            "forChecking" => $forChecking,
            "done" => $done
        ], 200);
    }


    public function filterPendingTicket($type)
    {
        // Filter pending tickets by type
        if (Auth::user()->role === "admin") {
            $query = DB::table('ticketing_main')
                ->orderBy("ticket_update_date", "desc");
        }
        if (Auth::user()->role === "user") {
            $query = DB::table('ticketing_main')
                ->where("ticket_client", Auth::user()->emp_no)
                ->orderBy("ticket_update_date", "desc");
        }
        if (Auth::user()->role === "technical") {
            $query = DB::table('ticketing_main')
                ->where("ticket_assigned_to_id", Auth::user()->emp_no)
                ->orderBy("ticket_update_date", "desc");
        }

        if ($type !== "All") {
            $filter = $query->where('ticket_type', $type)->paginate(10);
            return $this->success(["Message" => $filter], "Request success", 201);
        }
        $filter = $query->paginate(10);
        return $this->success(["Message" => $filter], "Request success", 201);
    }

    public function filteredBySearch($search)
    {
        // Filter pending tickets by search
        $query = DB::table('ticketing_main')
            ->orderBy("ticket_update_date", "desc");
        if ($search !== "" || $search != "") {
            $filter = $query->where('ticket_type', 'like', '%' . $search . '%')
                ->orWhere('ticket_desc_concern', 'like', '%' . $search . '%')
                ->paginate(10);
            return $this->success(["Message" => $filter], "Request success", 201);
        }
        $filter = $query->paginate(10);
        return $this->success(["Message" => $filter], "Request success", 201);
    }

    public function getAttachment()
    {
        // Get all attachments
        return response()->json(["Message" => DB::table('ticket_type')->get()]);
    }


    public function getImagesByTicketCode($ticket_cde)
    {
        // Get images by ticket code
        try {
            $images = DB::table('ticketing_attachment')->where("ticket_cde", $ticket_cde)->first();
            if ($images) {
                $imagePaths = json_decode($images->images_path, true);
                return response()->json(['images' => $imagePaths], 200);
            } else {
                return response()->json(['error' => 'Images not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getVideosByTicketCode($ticket_cde)
    {
        // Get videos by ticket code
        try {
            $videos = DB::table('ticketing_attachment')->where("ticket_cde", $ticket_cde)->first();
            if ($videos) {
                $videoPaths = json_decode($videos->videos_path, true);
                return response()->json(['videos' => $videoPaths], 200);
            } else {
                return response()->json(['error' => 'Videos not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getDocumentsByTicketCode($ticket_cde)
    {
        // Get documents by ticket code
        try {
            $documents = DB::table('ticketing_attachment')->where("ticket_cde", $ticket_cde)->first();
            if ($documents) {
                $documentPaths = json_decode($documents->documents_path, true);
                return response()->json(['documents' => $documentPaths], 200);
            } else {
                return response()->json(['error' => 'Documents not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }


    public function getItems()
    {
        try {
            $items = DB::table('tbl_summary')
                ->where('MR_TO', Auth::user()->emp_no)
                ->get();
            return $this->success(["Message" => $items], "Request Success", 200);
        } catch (\Exception $e) {
            return $this->error(["Message" => $e->getMessage()], "Request failed", 500);
        }
    }
    public function getItemByProperty($prop_no)
    {
        try {
            $items = DB::table('tbl_summary')
                ->where('NO_PROPERTY', $prop_no)
                ->first(['CDE_ARTICLE', 'DESC_ARTICLE']);
            return $this->success(["Message" => $items], "Request Success", 200);
        } catch (\Exception $e) {
            return $this->error(["Message" => $e->getMessage()], "Request failed", 500);
        }
    }
    public function clientFeedBack(Request $request)
    {
        try {
            $addFeedback = DB::table("ticketing_main")
                ->where('ticket_client', Auth::user()->emp_no)
                ->where('ticket_cde', $request->ticket_cde)
                ->update(['client_feedback' => $request->feedback, 'ticket_status' => 5, 'ticket_update_date' => now()]);
            if ($addFeedback) {
                return $this->success(["Message" => "Request Success"], "Insert Feedback Success", 201);
            }
            return $this->error(["Message" => "Hotdog Error sa ClientFeedBack() sa backend"], "Request failed", 500);
        } catch (\Exception $e) {
            return $this->error(["Message" => $e->getMessage()], "Request failed", 500);
        }
    }

    public function userReasonForDeny(Request $request)
    {
        try {
            $addFeedback = DB::table("ticketing_main")
                ->where('ticket_client', Auth::user()->emp_no)
                ->where('ticket_cde', $request->ticket_cde)
                ->update(['deny_reason' => $request->feedback, 'ticket_status' => 3, 'ticket_update_date' => now()]);
            if ($addFeedback) {
                return $this->success(["Message" => "Request Success"], "Deny Success", 201);
            }
            return $this->error(["Message" => "Hotdog Error sa userReasonForDeny() sa backend"], "Request failed", 500);
        } catch (\Exception $e) {
            return $this->error(["Message" => $e->getMessage()], "Request failed", 500);
        }
    }
}
