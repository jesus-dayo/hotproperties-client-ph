export class FileHolder {
  public pending = false;
  public serverResponse: { status: number, response: any };

  constructor(public src: string, public file: File) {
  }
}
