export const RETURN_URL_QUERY_PARAM = "returnUrl";

export const redirectUserToLogin = (req: Request) => {
  const currentUrl = new URL(req.url);
  const { pathname, search } = currentUrl;

  const returnUrlQuery = new URLSearchParams();
  returnUrlQuery.set(RETURN_URL_QUERY_PARAM, pathname + search);

  return {
    data: null,
    status: 302,
    headers: new Headers({ location: `/login?${returnUrlQuery.toString()}` }),
  };
};

const SUCCESS_LOGIN_PATH = "/login/success";

const WELL_KNOWN = [
  "webdraw.ai",
  "webdraw.com",
  "localhost",
  "deco.site",
  "deco.chat"
];

export const redirectToLoginUrl = (_url: string, headers?: Headers) => {
  const url = new URL(_url);
  const returnUrlSearchParams = getReturnUrlSearchParams(_url);

  const protocol = headers?.has("x-forwarded-proto")
    ? headers.get("x-forwarded-proto") + ":"
    : url.protocol;

  const returnUrl = new URL(
    url.searchParams.get(RETURN_URL_QUERY_PARAM) ?? "/",
    url.href,
  );

  if (
    returnUrl.host !== url.host &&
    WELL_KNOWN.includes(returnUrl.hostname)
  ) {
    return returnUrl.href;
  }

  return `${protocol}//${url.host}${SUCCESS_LOGIN_PATH}?${returnUrlSearchParams.toString()}`;
};

export const getReturnUrlSearchParams = (_url: string) => {
  const url = new URL(_url);
  const returnUrlSearchParams = new URLSearchParams();

  returnUrlSearchParams.set(
    RETURN_URL_QUERY_PARAM,
    url.searchParams.get(RETURN_URL_QUERY_PARAM) ?? _url,
  );

  return returnUrlSearchParams;
}; 