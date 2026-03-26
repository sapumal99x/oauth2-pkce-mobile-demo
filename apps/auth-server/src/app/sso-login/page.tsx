import { redirect } from "next/navigation";

type SsoLoginPageProps = {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    code_challenge?: string;
  }>;
};

/**
 * SSO entry route.
 * Input: OAuth request query values from /login.
 * Output: Immediate redirect to mock SSO provider page with same OAuth context.
 */
export default async function SsoLoginPage({ searchParams }: SsoLoginPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams({
    client_id: params.client_id ?? "",
    redirect_uri: params.redirect_uri ?? "",
    code_challenge: params.code_challenge ?? "",
  });

  console.log("SSO login started", {
    clientId: params.client_id ?? "",
    redirectUri: params.redirect_uri ?? "",
  });

  redirect(`/sso-provider?${query.toString()}`);
}
