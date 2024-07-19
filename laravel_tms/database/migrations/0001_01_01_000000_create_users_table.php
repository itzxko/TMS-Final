<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */


    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('emp_no', 36)->primary();
            $table->string('username', 100)->nullable();
            $table->string('password', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('agency_id', 2)->nullable();
            $table->string('agency_desc', 120)->nullable();
            $table->string('region_id', 2)->nullable();
            $table->string('region_desc', 120)->nullable();
            $table->string('service_id', 2)->nullable();
            $table->string('service_desc', 120)->nullable();
            $table->string('division_id', 2)->nullable();
            $table->string('division_desc', 120)->nullable();
            $table->string('section_id', 2)->nullable();
            $table->string('section_desc', 120)->nullable();
            $table->string('position_id', 2)->nullable();
            $table->string('position_desc', 120)->nullable();
            $table->dateTime('date_created')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('status', ['0', '1', '2', ''])->nullable();
            $table->string('office_code', 45)->nullable();
            $table->string('role', 255)->nullable();
            $table->integer('otp', 11)->nullable();
        });
        Schema::create('ticket_type', function (Blueprint $table) {
            $table->bigIncrements('ID'); // Change 'int' to 'bigIncrements' for the auto-incrementing primary key
            $table->integer('TYPE_CODE')->nullable();
            $table->string('OFFICE_CDE', 10)->nullable();
            $table->text('TYPE_DESC', 255)->nullable();
            $table->dateTime('DATE_ADDED')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
        });
        // Insert data into the table
        DB::table('ticket_type')->insert([
            ['ID' => 1, 'TYPE_CODE' => 1, 'OFFICE_CDE' => '1111111111', 'TYPE_DESC' => 'Installation', 'DATE_ADDED' => '2023-04-27 10:03:13'],
            ['ID' => 2, 'TYPE_CODE' => 2, 'OFFICE_CDE' => '2222222222', 'TYPE_DESC' => 'Network Cabling', 'DATE_ADDED' => '2023-04-27 10:03:13'],
            ['ID' => 3, 'TYPE_CODE' => 3, 'OFFICE_CDE' => '3333333333', 'TYPE_DESC' => 'Hardware Repair', 'DATE_ADDED' => '2023-04-27 10:04:00'],
            ['ID' => 4, 'TYPE_CODE' => 4, 'OFFICE_CDE' => '4444444444', 'TYPE_DESC' => 'IT Support', 'DATE_ADDED' => '2023-04-27 10:04:00'],
            ['ID' => 5, 'TYPE_CODE' => 5, 'OFFICE_CDE' => '5555555555', 'TYPE_DESC' => 'Network Troubleshooting', 'DATE_ADDED' => '2023-04-27 10:04:33'],
            ['ID' => 6, 'TYPE_CODE' => 6, 'OFFICE_CDE' => '6666666666', 'TYPE_DESC' => 'Hardware/Software Troubleshooting', 'DATE_ADDED' => '2023-04-27 10:04:33'],
            ['ID' => 7, 'TYPE_CODE' => 7, 'OFFICE_CDE' => '7777777777', 'TYPE_DESC' => 'Others', 'DATE_ADDED' => '2023-04-27 10:04:53']
        ]);

        Schema::create('ticketing_property_ref', function (Blueprint $table) {
            $table->string('ticket_prop_id', 21)->primary();
            $table->string('ticket_cde', 21)->nullable();
            $table->string('property_no', 120)->nullable();
            $table->longText('property_specification')->nullable();
            $table->string('property_article', 240)->nullable();
            $table->string('property_mr_to', 36)->nullable();
            $table->string('property_mr_to_others', 36)->nullable();
            $table->string('property_status', 12)->nullable();
        });

        Schema::create('ticketing_main', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('ticket_cde', 255)->nullable();
            $table->string('ticket_office_cde', 36)->nullable()->comment('ASSIGNED OFFICE - ticket_type OFFICE_CDE');
            $table->string('ticket_accepted_by', 36)->nullable()->comment('EMPLOYEE WHO ACCEPTED THE TICKET (ADMIN)');
            $table->string('ticket_assigned_to_id', 36)->nullable()->comment('EMPLOYEE WHO WILL WORK ON THE TICKET (ID)');
            $table->string('ticket_assigned_to_name', 36)->nullable()->comment('EMPLOYEE WHO WILL WORK ON THE TICKET (NAME)');
            $table->string('ticket_client', 36)->nullable()->comment('WHO REQUESTED THE TICKET (ID) - SESSION EMP_NO');
            $table->string('ticket_client_name', 120)->nullable()->comment('WHO REQUESTED THE TICKET (NAME)');
            $table->string('ticket_client_office_cde', 36)->nullable()->comment('OFFICE CODE OF CLIENT - SESSION OFFICE CODE');
            $table->string('ticket_client_contact_mobile', 12)->nullable()->comment('CLIENT MOBILE NUMBER');
            $table->string('ticket_client_contact_local', 12)->nullable()->comment('CLIENT LOCAL NUMBER');
            $table->text('ticket_type')->nullable()->comment('REFERENCE ON ticket_type table');
            $table->string('ticket_if_others', 450)->nullable();
            $table->longText('ticket_desc_concern')->nullable()->comment('description of concern');
            $table->longText('ticket_desc_findings')->nullable()->comment('findings - TO BE FILLED BY TECHNICAL STAFF');
            $table->longText('ticket_desc_remarks')->nullable()->comment('remarks - TO BE FILLED BY TECHNICAL STAFF');
            $table->longText('ticket_desc_replacement')->nullable()->comment('replacement remarks - TO BE FILLED BY TECHNICAL STAFF');
            $table->string('ticket_status', 12)->nullable()->comment('status of ticket: 1 - requested, 2 - assigned, 3 - ongoing, 4 - for checking, 5 - done');
            $table->string('ticket_status_if_date', 255)->nullable()->comment('date requested');
            $table->dateTime('ticket_update_date')->nullable()->comment('date last updated');
            $table->text('property_no')->nullable()->comment('property number');
            $table->text('client_feedback')->nullable()->comment('client feedback');
            $table->text('deny_reason')->nullable()->comment('deny reason');
            $table->text('tech_deny_reason')->nullable()->comment('tech deny reason');
        });
        Schema::create('ticketing_history', function (Blueprint $table) {
            $table->id(); // This will create an auto-incrementing primary key "id"
            $table->string('ticket_history_id')->nullable()->unique(); // Make "ticket_history_id" unique instead of primary key
            $table->string('ticket_cde')->nullable();
            $table->longText('ticket_desc_findings')->nullable();
            $table->longText('ticket_desc_remarks')->nullable();
            $table->longText('ticket_desc_replacement')->nullable();
            $table->string('ticket_status', 12)->nullable();
            $table->string('ticket_status_if_date', 25)->nullable();
            $table->dateTime('ticket_update_date')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
        });
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('ticketing_attachment', function (Blueprint $table) {
            $table->string('ticket_attachment_id', 21)->primary();
            $table->string('ticket_cde', 255)->nullable();
            $table->string('ticket_path', 255)->nullable()->comment('path of attachment');
            $table->text('images_path')->nullable()->comment('path of images attachment');
            $table->text('videos_path')->nullable()->comment('path of videos attachment');
            $table->text('documents_path')->nullable()->comment('path of documents attachment');
            $table->dateTime('ticket_attachment_date')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'))->comment('date of attachment');
        });

        Schema::create('lib_office', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string('ID_AGENCY', 100)->nullable();
            $table->string('AGENCY_CODE', 20)->nullable();
            $table->string('INFO_AGENCY', 100)->nullable();
            $table->string('ID_REGION', 100)->nullable();
            $table->string('INFO_REGION', 100)->nullable();
            $table->string('SHORTNAME_REGION', 20)->nullable();
            $table->string('ID_SERVICE', 100)->nullable();
            $table->string('SERVICE_CODE', 20)->nullable();
            $table->string('INFO_SERVICE', 240)->nullable();
            $table->string('SHORTNAME_SERVICE', 45)->nullable();
            $table->string('ID_DIVISION', 240)->nullable();
            $table->string('INFO_DIVISION', 100)->nullable();
            $table->string('ID_SECTIONUNIT', 12)->nullable();
            $table->string('ID_CODE', 12)->nullable();
            $table->string('OFFICE_CODE', 20)->nullable();
            $table->string('LOCATION_CODE', 12)->nullable();
            $table->string('STATUS_CODE', 12)->nullable();
            $table->string('INFO_SECTIONUNIT', 100)->nullable();
            $table->timestamps();
        });
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('ticket_type');
        Schema::dropIfExists('ticketing_property_ref');
        Schema::dropIfExists('ticketing_main');
        Schema::dropIfExists('ticketing_history');
        Schema::dropIfExists('ticketing_attachment');
        Schema::dropIfExists('lib_office');
    }
};
