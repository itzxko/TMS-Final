<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;
    
    protected $table = 'ticketing_attachment';

    public $timestamps = false;
    protected $fillable = [
        'ticket_attachment_id',
        'ticket_cde',
        'ticket_path',
        'ticket_attachment_date',
    ];
}