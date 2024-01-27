export abstract class Storage {
  abstract get(fileName: string): Promise<string | undefined>
}
