<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\OtpEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;

class UserController extends Controller
{
    use HttpResponses;

    // Show the ticket
    public function show($emp_no)
    {
        $username = DB::table('ticketing_main')
            ->where('emp_no', $emp_no)
            ->get();
        return response()->json(['username' => $username], 200);
    }

    public function userLogin(Request $request)
    {
        // Validate request data
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        try {
            // Check if user exists
            $user = DB::table('users')->where('email', $data['email'])->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email does not exist in database!',
                    'login' => 'failed'
                ], 401);
            }

            // Check if the password is correct
            if (!Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Your password is incorrect!',
                    'login' => 'failed'
                ], 401);
            }

            // Send OTP to the user's email (You should implement the OTP sending logic here)
            return response()->json([
                'status' => 'success',
                'message' => 'OTP is sent to your email!',
                'login' => 'success'
            ]);
        } catch (\Throwable $th) {
            // Handle any exceptions
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred. Please try again later.',
                'login' => 'failed'
            ], 500);
        }
    }

    // Verify OTP
    public function verifyOTP(Request $request)
    {
        // Validate request data
        $data = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
        ]);

        $user = DB::table('users')->where('email', $data['email'])->first();

        if ($user && $user->otp == $data['otp']) {
            // Regenerate the session
            $request->session()->regenerate();

            // Manually log in the user
            Auth::loginUsingId($user->emp_no);

            // Debug: Check if user is authenticated
            if (Auth::check()) {
                Log::info('User authenticated after OTP verification: ', ['user' => Auth::user()]);
                return response()->json([
                    'message' => 'Request success',
                    'user' => Auth::user()
                ], 200);
            } else {
                return response()->json(['message' => 'OTP verified but user not authenticated.'], 401);
            }
        }

        return response()->json(['message' => 'Invalid OTP.'], 400);
    }

    // Send OTP
    public function sendOTP(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
            ]);

            $otp = rand(100000, 999999); // Ensure 6-digit OTP
            Mail::to($data['email'])->send(new OtpEmail($otp, $data['email']));
            $user = DB::table('users')->where("email", $data['email'])->update(["otp" => $otp]);

            if ($user) {
                return response()->json(['message' => 'OTP sent to your email.'], 200);
            }

            return response()->json(['message' => 'Request failed!'], 500);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function logout(Request $request)
    {
        // Log out the user
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success(["Message" => "Success"]);
    }
}
