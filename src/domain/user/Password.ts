export default interface Password {
  value: string;
  validate(password: string): boolean;
}
