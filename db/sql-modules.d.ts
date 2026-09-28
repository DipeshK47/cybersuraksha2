// Allow importing raw SQL migration files as strings (Vite `?raw` loader).
declare module "*.sql?raw" {
  const content: string;
  export default content;
}
