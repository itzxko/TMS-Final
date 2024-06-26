<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\OtpEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;

class UserController extends Controller
{
    use HttpResponses;
    public function show($emp_no)
    {
        $username = DB::table('ticketing_main')
            ->where('emp_no', $emp_no)
            ->get();
        return response()->json(['username' => $username], 200);
    }

    public function userLoginWithOtp(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email'
        ]);

        try {
            $otp = rand(100000, 999999); // Ensure 6-digit OTP
            Mail::to($credentials['email'])->send(new OtpEmail($otp, $credentials['email']));
            DB::table('users')->where("email", $credentials['email'])->update(["otp" => $otp]);

            return response()->json(['message' => 'OTP sent to your email.'], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }


    

    public function userLogin(Request $request)
{
    $data = $request->validate([
        'email' => 'required|email',
        'otp' => 'required|numeric'
    ]);

    $user = DB::table('users')->where('email', $data['email'])->first();

        if ($user && $user->otp == $data['otp']) {
            // OTP matched, proceed with login
            // Manually log in the user
            Auth::loginUsingId($user->emp_no);

            $request->session()->regenerate();

            return response()->json([
                'message' => 'Request success',
                'user' => Auth::user() 
            ], 200);
        }

        return response()->json(['message' => 'Invalid OTP.'], 400);
    }

    public function logout(Request $request){
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success(["Message" => "Success"]);
    }
}
