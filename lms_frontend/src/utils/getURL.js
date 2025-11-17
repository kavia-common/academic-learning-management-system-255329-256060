export const getURL = () => {
  let url =
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  if (!String(url).startsWith("http")) {
    url = `https://${url}`;
  }
  if (!String(url).endsWith("/")) {
    url = `${url}/`;
  }
  return url;
};
