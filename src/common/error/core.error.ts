export class CoreError {
  protected api: string;
  protected errorHandle: Object;
  protected status: number;

  errorHandler(src): { id: string; message: string } {
    const error = this.errorHandle[src.message];
    console.log(src);

    if (!error) {
      return {
        id: `Out.of.control.error`,
        message: `오류가 발생하였습니다.`,
      };
    }

    return error;
  }
}
