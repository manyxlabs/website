// Runs only for the paths `run_worker_first` lists in wrangler.jsonc: the free tools'
// pages, bundles and sitemap, which its own Worker (manyxlabs/photo-resizer) serves.
// Every other path is this site's static assets and never reaches this code.
export default {
  fetch: (request: Request, env: { RESIZER: { fetch(request: Request): Promise<Response> } }) => env.RESIZER.fetch(request),
};
