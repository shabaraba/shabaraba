export default function legacyPagination(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return;

  const url = new URL(request.url);
  const rawPage = url.searchParams.get('page');
  if (rawPage === null || !/^\d+$/.test(rawPage)) return;

  const page = Number(rawPage);
  if (page < 1 || !Number.isSafeInteger(page)) return;

  const basePath = url.pathname.replace(/\/$/, '');
  url.pathname = page === 1 ? basePath : `${basePath}/page/${page}`;
  url.searchParams.delete('page');

  if (url.hostname === 'blog.shaba.dev') {
    url.protocol = 'https:';
    url.host = 'shaba.dev';
  }

  return Response.redirect(url, 301);
}
