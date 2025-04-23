import { Head } from "$fresh/runtime.ts";
import { Handler, PageProps } from "$fresh/server.ts";
import { getSupabaseClient } from "../../clients/browserClient.ts";
import { redirectToLoginUrl } from "../../utils/auth.ts";

type LoginData = {
  loginLinks: {
    google: string;
  };
};

export const handler: Handler<LoginData> = async (req, ctx) => {
  const redirectTo = redirectToLoginUrl(req.url, req.headers);

  const client = getSupabaseClient();

  const { data: { url: googleLoginUrl } } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  return ctx.render({
    loginLinks: {
      google: googleLoginUrl ?? "#",
    },
  });
};

export default function Login({
  data: {
    loginLinks: {
      google,
    },
  },
}: PageProps<LoginData>) {
  return (
    <div class="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <Head>
        <title>WhatsApp Bot Admin - Login</title>
        <meta name="description" content="Login to your WhatsApp Bot Admin Panel" />
      </Head>
      
      <div class="card w-full max-w-md bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold">WhatsApp Bot Admin</h1>
            <p class="text-sm opacity-70 mt-2">Sign in to manage your WhatsApp bots</p>
          </div>
          
          <div class="flex flex-col items-center gap-6">
            <a 
              href={google}
              class="btn btn-outline w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" 
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
              </svg>
              Continue with Google
            </a>
            
            <p class="text-sm text-center opacity-70">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 