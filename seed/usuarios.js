import bcrypt from "bcrypt"

const usuarios = [
  {
    nombre: "Miguel",
    email: "miguel@gmail.com",
    passwor: 1,
    password: bcrypt.hashSync("password", 10)
  }
]

export default usuarios;