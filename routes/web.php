<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\CareRecordController;
use App\Http\Controllers\HandoverNoteController;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('residents', ResidentController::class)
        ->except(['destroy']);
    Route::resource('handovers', HandoverNoteController::class)
    ->only(['index', 'create', 'store', 'show']);

    Route::post('handovers/{handover}/read', [HandoverNoteController::class, 'markAsRead'])
        ->name('handovers.read');

    Route::resource('care-records', CareRecordController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::resource('handovers', HandoverNoteController::class)
    ->only(['index', 'create', 'store', 'show', 'edit', 'update']);

    Route::post('handovers/{handover}/read', [HandoverNoteController::class, 'markAsRead'])
        ->name('handovers.read');

    Route::post('handovers/{handover}/complete', [HandoverNoteController::class, 'complete'])
        ->name('handovers.complete');
});


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('Admin/Index');
    })->name('admin.index');
});

require __DIR__.'/settings.php';
