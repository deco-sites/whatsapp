import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getSupabaseClient } from "../../clients/browserClient.ts";

interface DashboardProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
    };
  } | null;
}

export const handler: Handlers<DashboardProps> = {
  async GET(req, ctx) {
    const client = getSupabaseClient();
    const { data: { session } } = await client.auth.getSession();
    
    // User is already authenticated due to middleware check
    return ctx.render({ user: session?.user ?? null });
  },
};

export default function Dashboard({ data }: PageProps<DashboardProps>) {
  const { user } = data;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  
  return (
    <div class="min-h-screen bg-base-100">
      <Head>
        <title>Dashboard - WhatsApp Bot Admin</title>
      </Head>
      
      <div class="navbar bg-base-200 shadow-md">
        <div class="flex-1">
          <a href="/" class="text-xl font-bold px-4">WhatsApp Bot Admin</a>
        </div>
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">
            <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img 
                  src={user?.user_metadata?.avatar_url || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.user_metadata?.full_name || 
                      user?.user_metadata?.name || 
                      user?.email || "User"
                    )}`
                  } 
                  alt="User avatar" 
                />
              </div>
            </label>
            <ul class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              <li class="mb-2 p-2 text-center">
                <div class="font-bold">{userName}</div>
                <div class="text-sm opacity-70">{user?.email}</div>
              </li>
              <div class="divider my-0"></div>
              <li><a href="/profile"><i class="fas fa-user mr-2"></i>Profile</a></li>
              <li><a href="/settings"><i class="fas fa-cog mr-2"></i>Settings</a></li>
              <div class="divider my-0"></div>
              <li>
                <form method="POST" action="/api/auth/signout">
                  <button type="submit" class="w-full text-left text-error">
                    <i class="fas fa-sign-out-alt mr-2"></i>Sign out
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <main class="container mx-auto p-4 md:p-8">
        <div class="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold">Welcome, {userName}!</h1>
            <p class="text-base-content/70">Manage your WhatsApp bots and configurations</p>
          </div>
          <a href="/clients/new" class="btn btn-primary mt-4 md:mt-0">
            <i class="fas fa-plus mr-2"></i>Create New Bot
          </a>
        </div>
        
        <div class="stats shadow w-full mb-8">
          <div class="stat">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div class="stat-title">Total Bots</div>
            <div class="stat-value">0</div>
            <div class="stat-desc">Your WhatsApp Bots</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div class="stat-title">Active Bots</div>
            <div class="stat-value">0</div>
            <div class="stat-desc">Currently running</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div class="stat-title">Messages</div>
            <div class="stat-value">0</div>
            <div class="stat-desc">Total processed</div>
          </div>
        </div>
        
        <div class="card bg-base-200 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title">Quick Actions</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <a href="/clients/new" class="btn btn-outline">New Bot</a>
              <a href="/templates" class="btn btn-outline">Message Templates</a>
              <a href="/reports" class="btn btn-outline">Analytics</a>
              <a href="/settings" class="btn btn-outline">Settings</a>
            </div>
          </div>
        </div>
        
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4">Recent Activity</h2>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Bot Name</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="4" class="text-center py-8">
                    <div class="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="mt-4 text-base-content/70">No activity yet</p>
                      <a href="/clients/new" class="btn btn-sm btn-primary mt-4">Create Your First Bot</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 