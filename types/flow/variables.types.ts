export interface Variable {
  id: string;
  name: string;
  value: string | number | boolean;
  saveInResults?: boolean;
}