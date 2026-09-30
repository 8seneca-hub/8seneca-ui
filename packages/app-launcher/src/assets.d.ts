// Logos are inlined into the bundle as data URLs (see the tsup loader), so
// consumers need no asset pipeline.
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
