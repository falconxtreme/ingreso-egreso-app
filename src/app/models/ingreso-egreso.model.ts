export class IngresoEgreso {
  public uid: string;

  constructor(
    public descripcion: string,
    public monto: number,
    public tipo: string
  ) {}
}
