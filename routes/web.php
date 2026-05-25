<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\CareRecordController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('residents', ResidentController::class)
        ->except(['destroy']);

    Route::resource('care-records', CareRecordController::class)
    ->only(['index', 'create', 'store', 'show']);
});


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('Admin/Index');
    })->name('admin.index');
});

require __DIR__.'/settings.php';
