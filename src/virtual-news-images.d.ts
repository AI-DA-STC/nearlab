declare module 'virtual:news-images' {
  /** Photos found in each `public/uploads/news/<folder>/`, keyed by folder. */
  const folders: Record<string, { src: string; width: number; height: number }[]>;
  export default folders;
}
