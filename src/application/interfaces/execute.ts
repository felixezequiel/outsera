export interface Execute<Param, ReturnType = void> {
  execute(param?: Param): Promise<ReturnType>;
}
