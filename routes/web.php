<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\CareRecordController;
use App\Http\Controllers\HandoverNoteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\FamilyNoteController;
use App\Http\Controllers\FamilyNoteReportController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::get('dashboard', DashboardController::class)
        ->name('dashboard');

    Route::resource('residents', ResidentController::class)
        ->except(['destroy']);

    Route::resource('care-records', CareRecordController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::resource('handovers', HandoverNoteController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::post('handovers/{handover}/read', [HandoverNoteController::class, 'markAsRead'])
        ->name('handovers.read');

    Route::post('handovers/{handover}/complete', [HandoverNoteController::class, 'complete'])
        ->name('handovers.complete');

    Route::get('family-notes-report', [FamilyNoteReportController::class, 'index'])
    ->name('family-notes.report');
    
    Route::resource('family-notes', FamilyNoteController::class)
    ->except(['destroy']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('residents', ResidentController::class)
        ->except(['destroy']);

    Route::resource('care-records', CareRecordController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::resource('handovers', HandoverNoteController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::post('handovers/{handover}/read', [HandoverNoteController::class, 'markAsRead'])
        ->name('handovers.read');

    Route::post('handovers/{handover}/complete', [HandoverNoteController::class, 'complete'])
        ->name('handovers.complete');
});

Route::middleware(['auth', 'verified', 'role:admin', 'active'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/index');
        })->name('index');

        Route::resource('users', UserController::class)
            ->only(['index', 'create', 'store', 'edit', 'update']);

        Route::resource('audit-logs', AuditLogController::class)
            ->only(['index']);
    });

require __DIR__.'/settings.php';
