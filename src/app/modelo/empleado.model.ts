export interface EmpleadoModel {
  /*modelo base de todos los empleados*/
  id?: string;
  cedula?: number;
  nombres?: string;
  apellidos?: string;
  email?: string;
  nacimiento?: string;
  direccion?: string;
  telefono?: string;
  estado?: boolean;
  tipo_vacuna?: string;
  fecha_vacuna?: string;
  dosis?: number;
}
