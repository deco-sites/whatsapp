import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getSupabaseClient } from "../clients/browserClient.ts";

interface HomeProps {
  isLoggedIn: boolean;
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const client = getSupabaseClient();
    const { data: { session } } = await client.auth.getSession();
    
    return ctx.render({ isLoggedIn: !!session });
  }
};

export default function Home({ data }: PageProps<HomeProps>) {
  const { isLoggedIn } = data;
  
  return (
    <div class="min-h-screen bg-base-100">
      <Head>
        <title>WhatsApp Bot Admin</title>
        <meta name="description" content="Manage your WhatsApp bots with ease" />
      </Head>
      
      {/* Header/Navbar */}
      <div class="navbar bg-base-200 shadow-md">
        <div class="flex-1">
          <span class="text-xl font-bold px-4">WhatsApp Bot Admin</span>
        </div>
        <div class="flex-none">
          {isLoggedIn ? (
            <a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
          ) : (
            <a href="/login" class="btn btn-primary">Login</a>
          )}
        </div>
      </div>
      
      {/* Hero Section */}
      <section class="py-12 md:py-24 bg-base-100">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Manage Your WhatsApp Bots
          </h1>
          <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            A powerful admin panel to create, configure, and monitor your WhatsApp bots
          </p>
          {isLoggedIn ? (
            <a href="/dashboard" class="btn btn-primary btn-lg">Go to Dashboard</a>
          ) : (
            <a href="/login" class="btn btn-primary btn-lg">Get Started</a>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section class="py-12 bg-base-200">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Easy Setup</h3>
                <p>Connect your WhatsApp account in seconds with a simple QR code scan</p>
              </div>
            </div>
            
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Automated Responses</h3>
                <p>Create custom automated responses for your customers</p>
              </div>
            </div>
            
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Real-time Monitoring</h3>
                <p>Track your bot's performance and message history in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer class="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <p class="font-bold">WhatsApp Bot Admin</p>
          <p>&copy; {new Date().getFullYear()} - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
} 