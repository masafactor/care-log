<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->orderBy('id')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => $this->roleOptions(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'is_active' => $data['is_active'],
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', '職員ユーザーを登録しました。');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_active' => $user->is_active,
            ],
            'roles' => $this->roleOptions(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        $currentUser = $request->user();

        $adminCount = User::query()
            ->where('role', UserRole::Admin->value)
            ->where('is_active', true)
            ->count();

        $isTargetActiveAdmin = $user->isAdmin() && $user->is_active;

        $willBeAdmin = $data['role'] === UserRole::Admin->value;
        $willBeActive = (bool) $data['is_active'];

        if ($currentUser->id === $user->id && ! $willBeActive) {
            return back()->withErrors([
                'is_active' => '自分自身を無効化することはできません。',
            ]);
        }

        if ($currentUser->id === $user->id && ! $willBeAdmin) {
            return back()->withErrors([
                'role' => '自分自身の管理者権限を外すことはできません。',
            ]);
        }

        if ($isTargetActiveAdmin && $adminCount <= 1 && ! $willBeActive) {
            return back()->withErrors([
                'is_active' => '最後の有効な管理者を無効化することはできません。',
            ]);
        }

        if ($isTargetActiveAdmin && $adminCount <= 1 && ! $willBeAdmin) {
            return back()->withErrors([
                'role' => '最後の有効な管理者の権限を変更することはできません。',
            ]);
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'is_active' => $data['is_active'],
        ]);

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return redirect()
            ->route('admin.users.index')
            ->with('success', '職員ユーザーを更新しました。');
    }

    private function roleOptions(): array
    {
        return collect(UserRole::cases())
            ->map(fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ])
            ->values()
            ->all();
    }
}