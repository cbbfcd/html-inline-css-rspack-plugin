export function is(filenameExtension: string) {
  const reg = new RegExp(`\.${filenameExtension}$`)
  return (fileName: string) => reg.test(fileName)
}

export const isCSS = is('css')

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
