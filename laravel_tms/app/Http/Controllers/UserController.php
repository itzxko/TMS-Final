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


    public function verifyOTP(Request $request){ 
        $data = $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);      
        $user = DB::table('users')->where('email', $data['email'])->first();
        if ($user && $user->otp == $data['otp']) {
            // OTP matched, proceed with login
            // Manually log in the user
            Auth::loginUsingId($user->emp_no);
            return response()->json([
                'message' => 'Request success',
                'user' => Auth::user() 
            ], 200);
        }
    }
    public function sendOTP(Request $request){
        try {
            //code...
            $data = $request->validate([
                'email' => 'required|email',
            ]);       
            $otp = rand(100000, 999999); // Ensure 6-digit OTP
            Mail::to($data['email'])->send(new OtpEmail($otp, $data['email']));
            $user = DB::table('users')->where("email", $data['email'])->update(["otp" => $otp]);  
            if($user){
                
                return $this->success(["Message" => "Request success! OTP is sent to your email"]);
            }
            return $this->error(["Message" => "Request failed!"]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function userLogin(Request $request)
        {
        $data = $request->validate([
            'email' => 'required|email',
            // 'otp' => 'required|numeric'
            'password' => 'required'
        ]);
        if(Auth::attempt($data)){
            $request->session()->regenerate();
             return $this->success(["Message" => "Login Success. OTP is being sent right now, please wait a moment~."]);
        }
        return response()->json(['message' => 'Invalid Credentials.'], 401);
    }

    public function logout(Request $request){
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success(["Message" => "Success"]);
    }
}
